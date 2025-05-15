"""Cleanup: drop sessions & userstest, add mindmaps

Revision ID: 94c93fbf4949
Revises: 83cd0daaf195
Create Date: 2025-05-15 14:27:26.221184
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '94c93fbf4949'
down_revision: Union[str, None] = '83cd0daaf195'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # 1) Drop FK from nodes to sessions so we can drop sessions
    op.drop_constraint('nodes_session_id_fkey', 'nodes', type_='foreignkey')

    # 2) Drop the old sessions and stray userstest tables
    op.drop_index('ix_sessions_id', table_name='sessions')
    op.drop_table('sessions')
    op.drop_table('userstest')

    # 3) Create mindmaps table
    op.create_table(
        'mindmaps',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('created_by', sa.Integer(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    )
    op.create_index(op.f('ix_mindmaps_id'), 'mindmaps', ['id'], unique=False)

    # 4) Migrate nodes → add mindmap_id & like_count, hook up new FK, drop session_id
    op.add_column('nodes', sa.Column('mindmap_id', sa.Integer(), nullable=False))
    op.add_column('nodes', sa.Column('like_count', sa.Integer(), server_default='0', nullable=False))
    op.create_foreign_key(None, 'nodes', 'mindmaps', ['mindmap_id'], ['id'], ondelete='CASCADE')
    op.drop_column('nodes', 'session_id')

    # 5) Migrate votes → drop old FKs & id, recreate new FKs (now pointing at users & nodes)
    op.drop_constraint('votes_node_id_fkey', 'votes', type_='foreignkey')
    op.drop_constraint('votes_user_id_fkey', 'votes', type_='foreignkey')
    op.drop_index('ix_votes_id', table_name='votes')
    op.drop_column('votes', 'id')
    op.create_foreign_key(None, 'votes', 'users', ['user_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key(None, 'votes', 'nodes', ['node_id'], ['id'], ondelete='CASCADE')


def downgrade() -> None:
    """Downgrade schema."""
    # Reverse the above in exact opposite order
    op.drop_constraint(None, 'votes', type_='foreignkey')
    op.drop_constraint(None, 'votes', type_='foreignkey')
    op.add_column('votes', sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True))
    op.create_index('ix_votes_id', 'votes', ['id'], unique=False)
    op.create_foreign_key('votes_node_id_fkey', 'votes', 'nodes', ['node_id'], ['id'])
    op.create_foreign_key('votes_user_id_fkey', 'votes', 'users', ['user_id'], ['id'])

    op.add_column('nodes', sa.Column('session_id', sa.Integer(), nullable=False))
    op.drop_constraint(None, 'nodes', type_='foreignkey')
    op.drop_column('nodes', 'mindmap_id')
    op.drop_column('nodes', 'like_count')
    op.create_foreign_key('nodes_session_id_fkey', 'nodes', 'sessions', ['session_id'], ['id'])
    op.create_index('ix_nodes_id', 'nodes', ['id'], unique=False)

    op.drop_index(op.f('ix_mindmaps_id'), table_name='mindmaps')
    op.drop_table('mindmaps')
    op.create_table(
        'userstest',
        sa.Column('id', sa.UUID(), primary_key=True, nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('username', sa.String(), nullable=False),
    )
    op.create_table(
        'sessions',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('created_by', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], name='sessions_created_by_fkey'),
    )
    op.create_index('ix_sessions_id', 'sessions', ['id'], unique=False)
