# routers/nodes.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models import MindMap, Node, Vote
from ..schemas.mindmap import (
    NodeCreate, NodeUpdate, NodeResponse,
    SuccessResponse, AIIdeaResponse
)
from ..middleware.auth import get_current_user_id

router = APIRouter(prefix="/api", tags=["nodes"])


# NODE CRUD OPERATIONS

@router.post("/mindmaps/{mindmap_id}/nodes", response_model=NodeResponse, status_code=status.HTTP_201_CREATED)
async def create_node(
        mindmap_id: int,
        node_data: NodeCreate,
        current_user_id: str = Depends(get_current_user_id),
        db: Session = Depends(get_db)
):
    """
    Create a new node in a mindmap
    """
    try:
        # Verify mindmap ownership
        mindmap = db.query(MindMap).filter(
            MindMap.id == mindmap_id,
            MindMap.created_by == current_user_id
        ).first()

        if not mindmap:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Mindmap not found"
            )

        # Verify parent node exists if specified
        if node_data.parent_id:
            parent_node = db.query(Node).filter(
                Node.id == node_data.parent_id,
                Node.mindmap_id == mindmap_id
            ).first()

            if not parent_node:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Parent node not found"
                )

        # Create a new node
        new_node = Node(
            content=node_data.title,
            mindmap_id=mindmap_id,
            parent_id=node_data.parent_id if node_data.parent_id else None,
            created_by=current_user_id
        )

        db.add(new_node)
        db.commit()
        db.refresh(new_node)

        # Convert to response format
        response_data = {
            "id": new_node.id,
            "title": new_node.content,
            "content": new_node.content,
            "x_position": node_data.x_position,
            "y_position": node_data.y_position,
            "parent_id": new_node.parent_id,
            "mindmap_id": new_node.mindmap_id,
            "vote_count": 0,
            "user_votes": [],
            "created_at": new_node.created_at
        }

        return NodeResponse(**response_data)

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create node: {str(e)}"
        )


@router.get("/mindmaps/{mindmap_id}/nodes", response_model=List[NodeResponse])
async def get_mindmap_nodes(
        mindmap_id: int,
        current_user_id: str = Depends(get_current_user_id),
        db: Session = Depends(get_db)
):
    """
    Get all nodes for a specific mindmap
    """
    try:
        # Verify mindmap ownership
        mindmap = db.query(MindMap).filter(
            MindMap.id == mindmap_id,
            MindMap.created_by == current_user_id
        ).first()

        if not mindmap:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Mindmap not found"
            )

        # Get all nodes for this mindmap
        nodes = db.query(Node).filter(Node.mindmap_id == mindmap_id).all()

        # Convert to response format
        result = []
        for node in nodes:
            votes = db.query(Vote).filter(Vote.node_id == node.id).all()

            node_data = {
                "id": node.id,
                "title": node.content,
                "content": node.content,
                "x_position": 0.0,
                "y_position": 0.0,
                "parent_id": node.parent_id,
                "mindmap_id": node.mindmap_id,
                "vote_count": len(votes),
                "user_votes": [vote.user_id for vote in votes],
                "created_at": node.created_at
            }
            result.append(NodeResponse(**node_data))

        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch nodes: {str(e)}"
        )


@router.get("/nodes/{node_id}", response_model=NodeResponse)
async def get_node(
        node_id: int,
        current_user_id: str = Depends(get_current_user_id),
        db: Session = Depends(get_db)
):
    """
    Get a specific node
    """
    try:
        # Get node and verify ownership through mindmap
        node = db.query(Node).join(MindMap).filter(
            Node.id == node_id,
            MindMap.created_by == current_user_id
        ).first()

        if not node:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Node not found"
            )

        # Get vote information
        votes = db.query(Vote).filter(Vote.node_id == node.id).all()

        # Convert to response format
        response_data = {
            "id": node.id,
            "title": node.content,
            "content": node.content,
            "x_position": 0.0,
            "y_position": 0.0,
            "parent_id": node.parent_id,
            "mindmap_id": node.mindmap_id,
            "vote_count": len(votes),
            "user_votes": [vote.user_id for vote in votes],
            "created_at": node.created_at
        }

        return NodeResponse(**response_data)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch node: {str(e)}"
        )


@router.put("/nodes/{node_id}", response_model=NodeResponse)
async def update_node(
        node_id: int,
        node_data: NodeUpdate,
        current_user_id: str = Depends(get_current_user_id),
        db: Session = Depends(get_db)
):
    """
    Update a node
    """
    try:
        # Get node and verify ownership through mindmap
        node = db.query(Node).join(MindMap).filter(
            Node.id == node_id,
            MindMap.created_by == current_user_id
        ).first()

        if not node:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Node not found"
            )

        # Verify the parent node exists if being updated
        if node_data.parent_id is not None:
            if node_data.parent_id == node_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Node cannot be its own parent"
                )

            if node_data.parent_id != 0:
                parent_node = db.query(Node).filter(
                    Node.id == node_data.parent_id,
                    Node.mindmap_id == node.mindmap_id
                ).first()

                if not parent_node:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Parent node not found"
                    )

        # Update fields
        if node_data.title:
            node.content = node_data.title
        if node_data.content:
            node.content = node_data.content
        if node_data.parent_id is not None:
            node.parent_id = node_data.parent_id if node_data.parent_id != 0 else None

        db.commit()
        db.refresh(node)

        # Get vote information
        votes = db.query(Vote).filter(Vote.node_id == node.id).all()

        # Convert to response format
        response_data = {
            "id": node.id,
            "title": node.content,
            "content": node.content,
            "x_position": node_data.x_position or 0.0,
            "y_position": node_data.y_position or 0.0,
            "parent_id": node.parent_id,
            "mindmap_id": node.mindmap_id,
            "vote_count": len(votes),
            "user_votes": [vote.user_id for vote in votes],
            "created_at": node.created_at
        }

        return NodeResponse(**response_data)

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update node: {str(e)}"
        )


@router.delete("/nodes/{node_id}", response_model=SuccessResponse)
async def delete_node(
        node_id: int,
        current_user_id: str = Depends(get_current_user_id),
        db: Session = Depends(get_db)
):
    """
    Delete a node and all its children
    """
    try:
        # Get node and verify ownership through mindmap
        node = db.query(Node).join(MindMap).filter(
            Node.id == node_id,
            MindMap.created_by == current_user_id
        ).first()

        if not node:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Node not found"
            )

        # Store node content for a response message
        node_content = node.content

        # Delete the node and let CASCADE handle children
        db.delete(node)
        db.commit()

        return SuccessResponse(
            message=f"Node '{node_content}' and its children deleted successfully"
        )

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete node: {str(e)}"
        )


# AI INTEGRATION ENDPOINTS

@router.post("/nodes/{node_id}/generate-ideas", response_model=AIIdeaResponse)
async def generate_ai_ideas(
        node_id: int,
        current_user_id: str = Depends(get_current_user_id),
        db: Session = Depends(get_db)
):
    """
    Generate AI ideas for a specific node
    """
    try:
        # Get node and verify ownership
        node = db.query(Node).join(MindMap).filter(
            Node.id == node_id,
            MindMap.created_by == current_user_id
        ).first()

        if not node:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Node not found"
            )

        # TODO: Implement actual AI integration with OpenAI
        # For now, return mock data
        mock_response = AIIdeaResponse(
            ideas=[
                f"Expand on {node.content} with practical applications",
                f"Consider the challenges of implementing {node.content}",
                f"Explore related technologies for {node.content}",
                f"Analyze market opportunities for {node.content}"
            ],
            summary=f"Generated ideas based on the concept: {node.content}",
            related_themes=["innovation", "implementation", "market-analysis", "technology"]
        )

        return mock_response

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate AI ideas: {str(e)}"
        )