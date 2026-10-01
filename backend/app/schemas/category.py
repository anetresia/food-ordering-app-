from pydantic import BaseModel, Field


# Category create panna request data
class CategoryCreate(BaseModel):
    # Category name minimum 2 characters
    name: str = Field(min_length=2)

    # Description optional
    description: str | None = None


# Category update panna request data
class CategoryUpdate(BaseModel):
    # Update panna category name optional
    name: str | None = Field(default=None, min_length=2)

    # Description optional
    description: str | None = None


# API response-ku use pannuvom
class CategoryResponse(BaseModel):
    id: int
    name: str
    description: str | None = None

    # SQLAlchemy model object-la irundhu response create panna
    model_config = {
        "from_attributes": True
    }