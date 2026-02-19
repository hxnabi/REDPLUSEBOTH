from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import BlogPost, BlogCategory
from pydantic import BaseModel


router = APIRouter(prefix="/blogs", tags=["blogs"])


class BlogSummary(BaseModel):
    id: int
    title: str
    slug: str
    category: BlogCategory
    excerpt: Optional[str] = None
    read_time_minutes: Optional[int] = None
    highlight: bool
    created_at: datetime

    class Config:
        from_attributes = True


class BlogDetail(BaseModel):
    id: int
    title: str
    slug: str
    category: BlogCategory
    excerpt: Optional[str] = None
    content: str
    read_time_minutes: Optional[int] = None
    highlight: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


@router.get("/", response_model=List[BlogSummary])
def list_blogs(db: Session = Depends(get_db)) -> List[BlogSummary]:
    posts = (
        db.query(BlogPost)
        .order_by(BlogPost.created_at.desc())
        .all()
    )
    return posts


@router.get("/{slug}", response_model=BlogDetail)
def get_blog(slug: str, db: Session = Depends(get_db)) -> BlogDetail:
    post = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if post is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found",
        )
    return post

