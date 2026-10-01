from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.category import Category
from app.models.user import User
from app.schemas.category import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse
)
from app.routes.dependencies import get_current_admin


# Category related API routes create panrom
router = APIRouter(
    prefix="/categories",
    tags=["Categories"]
)


# Database session provide panna function
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# CREATE CATEGORY
# Admin mattum category create panna allow panrom
@router.post(
    "/",
    response_model=CategoryResponse
)
def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    # Same name-la category already irukka-nu check panrom
    existing_category = db.query(Category).filter(
        Category.name == category.name
    ).first()

    if existing_category:
        raise HTTPException(
            status_code=400,
            detail="Category already exists"
        )

    # New category create panrom
    new_category = Category(
        name=category.name,
        description=category.description
    )

    # Database-la category save panrom
    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return new_category


# GET ALL CATEGORIES
# Public users categories view panna mudiyum
@router.get(
    "/",
    response_model=list[CategoryResponse]
)
def get_categories(
    db: Session = Depends(get_db)
):
    # Database-la irukkura ella categories-um edukkrom
    categories = db.query(Category).all()

    return categories


# GET SINGLE CATEGORY
# Public users particular category view panna mudiyum
@router.get(
    "/{category_id}",
    response_model=CategoryResponse
)
def get_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    # ID use panni category-a search panrom
    category = db.query(Category).filter(
        Category.id == category_id
    ).first()

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    return category


# UPDATE CATEGORY
# Admin mattum category update panna allow panrom
@router.put(
    "/{category_id}",
    response_model=CategoryResponse
)
def update_category(
    category_id: int,
    category_data: CategoryUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    # Update panna vendiya category-a search panrom
    category = db.query(Category).filter(
        Category.id == category_id
    ).first()

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    # Category name update panrom
    if category_data.name is not None:
        category.name = category_data.name

    # Description update panrom
    if category_data.description is not None:
        category.description = category_data.description

    # Changes database-la save panrom
    db.commit()
    db.refresh(category)

    return category


# DELETE CATEGORY
# Admin mattum category delete panna allow panrom
@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    # Delete panna vendiya category-a search panrom
    category = db.query(Category).filter(
        Category.id == category_id
    ).first()

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    # Category delete panrom
    db.delete(category)
    db.commit()

    return {
        "message": "Category deleted successfully"
    }