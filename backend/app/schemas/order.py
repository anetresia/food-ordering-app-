from pydantic import BaseModel
from datetime import datetime
from typing import Literal


# Order create panna request data
class OrderCreate(BaseModel):
    # Customer ID required
    customer_id: int


# Order update panna request data
class OrderUpdate(BaseModel):
    # Allowed order statuses mattum accept panrom
    status: Literal[
        "Pending",
        "Confirmed",
        "Preparing",
        "Out for Delivery",
        "Delivered",
        "Cancelled"
    ]


# API response-ku use pannuvom
class OrderResponse(BaseModel):
    id: int
    customer_id: int
    total_amount: float
    status: str
    created_at: datetime

    # SQLAlchemy model object-la irundhu response create panna
    model_config = {
        "from_attributes": True
    }