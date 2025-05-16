"""Add performance indexes

Revision ID: 187f861b0fe9
Revises: ed04a47612d2
Create Date: 2025-05-16 20:43:38.827678

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '187f861b0fe9'
down_revision: Union[str, None] = 'ed04a47612d2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add indexes for better query performance
    op.create_index('idx_mindmaps_created_by', 'mindmaps', ['created_by'])
    op.create_index('idx_nodes_created_by', 'nodes', ['created_by'])
    op.create_index('idx_nodes_mindmap_id', 'nodes', ['mindmap_id'])
    op.create_index('idx_votes_node_id', 'votes', ['node_id'])


def downgrade() -> None:
    # Drop indexes
    op.drop_index('idx_votes_node_id', table_name='votes')
    op.drop_index('idx_nodes_mindmap_id', table_name='nodes')
    op.drop_index('idx_nodes_created_by', table_name='nodes')
    op.drop_index('idx_mindmaps_created_by', table_name='mindmaps')
