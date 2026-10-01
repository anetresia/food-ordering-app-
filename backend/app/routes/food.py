from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.food import Food
from app.models.category import Category
from app.models.user import User
from app.schemas.food import (
    FoodCreate,
    FoodUpdate,
    FoodResponse
)
from app.routes.dependencies import get_current_admin


# Food related API routes create panrom
router = APIRouter(
    prefix="/foods",
    tags=["Foods"]
)


# Database session provide panna function
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# CREATE FOOD
# Admin mattum food create panna allow panrom
@router.post(
    "/",
    response_model=FoodResponse
)
def create_food(
    food: FoodCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    # Given category database-la irukka-nu check panrom
    category = db.query(Category).filter(
        Category.id == food.category_id
    ).first()

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    # Food data-va database model object-aa convert panrom
    new_food = Food(
        name=food.name,
        description=food.description,
        price=food.price,
        image=food.image,
        is_available=food.is_available,
        category_id=food.category_id
    )

    # Database-la food save panrom
    db.add(new_food)
    db.commit()
    db.refresh(new_food)

    return new_food


# GET FOODS
# Search, category filter, pagination and sorting
# Public users food list-a view panna mudiyum
@router.get(
    "/",
    response_model=list[FoodResponse]
)
def get_foods(
    search: str | None = None,
    category_id: int | None = None,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1),
    sort: str | None = None,
    order: str = "asc",
    db: Session = Depends(get_db)
):
    # Base query - foods table-la irundhu data edukkrom
    query = db.query(Food)

    # Food name-la search panrom
    if search:
        query = query.filter(
            Food.name.ilike(f"%{search}%")
        )

    # Category filter apply panrom
    if category_id is not None:
        query = query.filter(
            Food.category_id == category_id
        )

    # Sorting
    if sort == "price":
        if order == "desc":
            query = query.order_by(
                Food.price.desc()
            )
        else:
            query = query.order_by(
                Food.price.asc()
            )

    elif sort == "name":
        if order == "desc":
            query = query.order_by(
                Food.name.desc()
            )
        else:
            query = query.order_by(
                Food.name.asc()
            )

    # Pagination
    skip = (page - 1) * limit

    foods = query.offset(skip).limit(limit).all()

    return foods


# GET SINGLE FOOD
# Public users particular food-a view panna mudiyum
@router.get(
    "/{food_id}",
    response_model=FoodResponse
)
def get_food(
    food_id: int,
    db: Session = Depends(get_db)
):
    # ID use panni particular food-a search panrom
    food = db.query(Food).filter(
        Food.id == food_id
    ).first()

    if not food:
        raise HTTPException(
            status_code=404,
            detail="Food not found"
        )

    return food


# UPDATE FOOD
# Admin mattum food update panna allow panrom
@router.put(
    "/{food_id}",
    response_model=FoodResponse
)
def update_food(
    food_id: int,
    food_data: FoodUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    # Update panna vendiya food-a search panrom
    food = db.query(Food).filter(
        Food.id == food_id
    ).first()

    if not food:
        raise HTTPException(
            status_code=404,
            detail="Food not found"
        )

    # Category change pannirundha
    # new category exists-a check panrom
    if food_data.category_id is not None:
        category = db.query(Category).filter(
            Category.id == food_data.category_id
        ).first()

        if not category:
            raise HTTPException(
                status_code=404,
                detail="Category not found"
            )

        food.category_id = food_data.category_id

    # User send pannina fields mattum update panrom
    if food_data.name is not None:
        food.name = food_data.name

    if food_data.description is not None:
        food.description = food_data.description

    if food_data.price is not None:
        food.price = food_data.price

    if food_data.image is not None:
        food.image = food_data.image

    if food_data.is_available is not None:
        food.is_available = food_data.is_available

    # Changes database-la save panrom
    db.commit()
    db.refresh(food)

    return food


# DELETE FOOD
# Admin mattum food delete panna allow panrom
@router.delete("/{food_id}")
def delete_food(
    food_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    # Delete panna vendiya food-a search panrom
    food = db.query(Food).filter(
        Food.id == food_id
    ).first()

    if not food:
        raise HTTPException(
            status_code=404,
            detail="Food not found"
        )

    # Food delete panrom
    db.delete(food)
    db.commit()

    return {
        "message": "Food deleted successfully"
    }