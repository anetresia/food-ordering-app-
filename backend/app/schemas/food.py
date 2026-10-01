from pydantic import BaseModel, Field


# Food create panna request data
class FoodCreate(BaseModel):
    name: str = Field(min_length=2)

    description: str | None = None

    # Price 0-kku mela irukkanum
    price: float = Field(gt=0)

    image: str | None = None

    # Default-a food available
    is_available: bool = True

    # Food-ku category required
    category_id: int


# Food update panna request data
class FoodUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2)

    description: str | None = None

    price: float | None = Field(default=None, gt=0)

    image: str | None = None

    is_available: bool | None = None

    category_id: int | None = None


# API response-ku use pannuvom
class FoodResponse(BaseModel):
    id: int
    name: str
    description: str | None = None
    price: float
    image: str | None = None
    is_available: bool
    category_id: int

    # SQLAlchemy model object-la irundhu response create panna
    model_config = {
        "from_attributes": True
    }