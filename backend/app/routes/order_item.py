from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.order_item import OrderItem
from app.models.order import Order
from app.models.food import Food
from app.models.customer import Customer
from app.models.user import User
from app.schemas.order_item import (
    OrderItemCreate,
    OrderItemUpdate,
    OrderItemResponse
)
from app.routes.dependencies import get_current_user, get_current_admin

router = APIRouter(prefix="/order-items", tags=["Order Items"])


# Database session create panna
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Order total calculate panna helper function
def calculate_order_total(order_id: int, db: Session):
    items = db.query(OrderItem).filter(
        OrderItem.order_id == order_id
    ).all()

    total = sum(float(item.subtotal) for item in items)

    return total


# CREATE ORDER ITEM
@router.post("/", response_model=OrderItemResponse)
def create_order_item(
    item_data: OrderItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Order exists-aa check panrom
    order = db.query(Order).filter(
        Order.id == item_data.order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    # Normal user own order-ku mattum item add panna mudiyum
    if current_user.role != "admin":
        customer = db.query(Customer).filter(
            Customer.email == current_user.email
        ).first()

        if not customer or order.customer_id != customer.id:
            raise HTTPException(
                status_code=403,
                detail="You can only add items to your own order"
            )

    # Food exists-aa check panrom
    food = db.query(Food).filter(
        Food.id == item_data.food_id
    ).first()

    if not food:
        raise HTTPException(
            status_code=404,
            detail="Food not found"
        )

    # Food available-aa check panrom
    if not food.is_available:
        raise HTTPException(
            status_code=400,
            detail="Food is currently unavailable"
        )

    # Actual database price use panrom
    unit_price = float(food.price)

    # Quantity × price
    subtotal = unit_price * item_data.quantity

    new_item = OrderItem(
        order_id=item_data.order_id,
        food_id=item_data.food_id,
        quantity=item_data.quantity,
        unit_price=unit_price,
        subtotal=subtotal
    )

    db.add(new_item)

    # Order total update panrom
    db.flush()

    order.total_amount = calculate_order_total(
        order.id,
        db
    )

    db.commit()
    db.refresh(new_item)

    return new_item


# READ ALL ORDER ITEMS
@router.get("/", response_model=list[OrderItemResponse])
def get_order_items(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    # Admin all order items paarkalaam
    items = db.query(OrderItem).all()

    return items


# READ ONE ORDER ITEM
@router.get("/{item_id}", response_model=OrderItemResponse)
def get_order_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(OrderItem).filter(
        OrderItem.id == item_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Order item not found"
        )

    # Admin any item-a paarkalaam
    if current_user.role == "admin":
        return item

    # Current user's customer find panrom
    customer = db.query(Customer).filter(
        Customer.email == current_user.email
    ).first()

    # Item belong aagura order own order-aa?
    if not customer or item.order.customer_id != customer.id:
        raise HTTPException(
            status_code=403,
            detail="You can only access your own order items"
        )

    return item


# UPDATE ORDER ITEM
@router.put("/{item_id}", response_model=OrderItemResponse)
def update_order_item(
    item_id: int,
    item_data: OrderItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(OrderItem).filter(
        OrderItem.id == item_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Order item not found"
        )

    # Admin or own order item mattum update panna mudiyum
    if current_user.role != "admin":
        customer = db.query(Customer).filter(
            Customer.email == current_user.email
        ).first()

        if not customer or item.order.customer_id != customer.id:
            raise HTTPException(
                status_code=403,
                detail="You can only update your own order items"
            )

    # Quantity update
    if item_data.quantity is not None:
        item.quantity = item_data.quantity

        # Existing unit price use panni subtotal recalculate panrom
        item.subtotal = (
            float(item.unit_price) * item.quantity
        )

    # Order total recalculate panrom
    item.order.total_amount = calculate_order_total(
        item.order_id,
        db
    )

    db.commit()
    db.refresh(item)

    return item


# DELETE ORDER ITEM
@router.delete("/{item_id}")
def delete_order_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(OrderItem).filter(
        OrderItem.id == item_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Order item not found"
        )

    # Admin or own order item mattum delete panna mudiyum
    if current_user.role != "admin":
        customer = db.query(Customer).filter(
            Customer.email == current_user.email
        ).first()

        if not customer or item.order.customer_id != customer.id:
            raise HTTPException(
                status_code=403,
                detail="You can only delete your own order items"
            )

    order_id = item.order_id

    db.delete(item)

    # Delete panna apram total recalculate panrom
    db.flush()

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if order:
        order.total_amount = calculate_order_total(
            order_id,
            db
        )

    db.commit()

    return {
        "message": "Order item deleted successfully"
    }