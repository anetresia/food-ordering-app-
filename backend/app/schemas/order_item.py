from pydantic import BaseModel, Field


# Order item create panna request data
class OrderItemCreate(BaseModel):
    # Order ID required
    order_id: int

    # Food ID required
    food_id: int

    # Quantity minimum 1
    quantity: int = Field(ge=1)


# Order item update panna request data
class OrderItemUpdate(BaseModel):
    # Quantity update panna minimum 1
    quantity: int | None = Field(
        default=None,
        ge=1
    )


# API response-ku use pannuvom
class OrderItemResponse(BaseModel):
    id: int
    order_id: int
    food_id: int
    quantity: int
    unit_price: float
    subtotal: float

    # SQLAlchemy model object-la irundhu response create panna
    model_config = {
        "from_attributes": True
    }