import os
from typing import List, Optional

import cloudinary
import cloudinary.uploader
from fastapi import (
    APIRouter,
    Depends,
    File,
    Header,
    HTTPException,
    UploadFile,
)
from sqlalchemy.orm import Session

from .. import auth, models, schemas
from ..database import get_db


# ---------------------------------------------------------------------------
# Cloudinary configuration
# ---------------------------------------------------------------------------

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)


# ---------------------------------------------------------------------------
# Router
# ---------------------------------------------------------------------------

router = APIRouter(
    prefix="/api/posts",
    tags=["posts"],
)


# ---------------------------------------------------------------------------
# Authentication
# ---------------------------------------------------------------------------

def get_current_admin(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db),
):
    """
    Validate the Bearer JWT and make sure the user is an admin.
    """

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Not authenticated",
        )

    token = authorization.split(" ", 1)[1]

    username = auth.verify_token(token)

    if not username:
        raise HTTPException(
            status_code=401,
            detail="Invalid token",
        )

    user = (
        db.query(models.User)
        .filter(models.User.username == username)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )

    if not user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )

    return user


# ---------------------------------------------------------------------------
# Static routes MUST come before /{post_id}
# ---------------------------------------------------------------------------

@router.get(
    "/",
    response_model=List[schemas.PostResponse],
)
def get_posts(
    db: Session = Depends(get_db),
):
    """
    Get all posts.
    Public endpoint.
    """

    return (
        db.query(models.Post)
        .order_by(models.Post.created_at.desc())
        .all()
    )


@router.post(
    "/upload-image",
)
async def upload_image(
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_admin),
):
    """
    Upload an image to Cloudinary.
    Admin only.
    """

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file provided",
        )

    # Optional but useful validation
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Only image files are allowed",
        )

    content = await file.read()

    if not content:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty",
        )

    try:
        result = cloudinary.uploader.upload(content)

        return {
            "image_url": result["secure_url"]
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Image upload failed: {str(exc)}",
        )


# ---------------------------------------------------------------------------
# Dynamic post route
# KEEP THIS AFTER /upload-image
# ---------------------------------------------------------------------------

@router.get(
    "/{post_id}",
    response_model=schemas.PostResponse,
)
def get_post(
    post_id: int,
    db: Session = Depends(get_db),
):
    """
    Get a single post by ID.
    Public endpoint.
    """

    post = (
        db.query(models.Post)
        .filter(models.Post.id == post_id)
        .first()
    )

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )

    return post


@router.post(
    "/",
    response_model=schemas.PostResponse,
)
def create_post(
    post: schemas.PostCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin),
):
    """
    Create a new post.
    Admin only.
    """

    new_post = models.Post(
        **post.model_dump()
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return new_post


@router.put(
    "/{post_id}",
    response_model=schemas.PostResponse,
)
def update_post(
    post_id: int,
    post: schemas.PostUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin),
):
    """
    Update an existing post.
    Admin only.
    """

    db_post = (
        db.query(models.Post)
        .filter(models.Post.id == post_id)
        .first()
    )

    if not db_post:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )

    update_data = post.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(db_post, key, value)

    db.commit()
    db.refresh(db_post)

    return db_post


@router.delete(
    "/{post_id}",
)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin),
):
    """
    Delete an existing post.
    Admin only.
    """

    db_post = (
        db.query(models.Post)
        .filter(models.Post.id == post_id)
        .first()
    )

    if not db_post:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )

    db.delete(db_post)
    db.commit()

    return {
        "message": "Post deleted successfully"
    }