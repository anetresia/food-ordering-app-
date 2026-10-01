from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.order import Order
from app.models.customer import Customer
from app.models.order_item import OrderItem
from app.models.user import User
from app.schemas.order import OrderCreate, OrderUpdate, OrderResponse
from app.routes.dependencies import get_current_user, get_current_admin

router = APIRouter(prefix="/orders", tags=["Orders"])


# Database session create panna
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# CREATE ORDER
@router.post("/", response_model=OrderResponse)
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Customer exists-aa check panrom
    customer = db.query(Customer).filter(
        Customer.id == order.customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    # Logged-in user thanoda customer profile-ku mattum
    # order create panna mudiyum
    if customer.email != current_user.email:
        raise HTTPException(
            status_code=403,
            detail="You can only create an order for your own customer profile"
        )

    # New order create panrom
    new_order = Order(
        customer_id=order.customer_id,
        total_amount=0,
        status="Pending"
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return new_order


# READ ALL ORDERS
@router.get("/", response_model=list[OrderResponse])
def get_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Admin all orders paarkalaam
    if current_user.role == "admin":
        return db.query(Order).all()

    # Normal user-ku avanga own customer profile-oda
    # orders mattum return panrom
    customer = db.query(Customer).filter(
        Customer.email == current_user.email
    ).first()

    if not customer:
        return []

    orders = db.query(Order).filter(
        Order.customer_id == customer.id
    ).all()

    return orders


# READ ONE ORDER
@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    # Admin any order-a paarkalaam
    if current_user.role == "admin":
        return order

    # Normal user-oda customer profile find panrom
    customer = db.query(Customer).filter(
        Customer.email == current_user.email
    ).first()

    if not customer or order.customer_id != customer.id:
        raise HTTPException(
            status_code=403,
            detail="You can only access your own orders"
        )

    return order


# UPDATE ORDER STATUS
# Admin mattum status change panna mudiyum
@router.put("/{order_id}", response_model=OrderResponse)
def update_order(
    order_id: int,
    order_data: OrderUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    order.status = order_data.status

    db.commit()
    db.refresh(order)

    return order


# DELETE ORDER
# Admin mattum delete panna mudiyum
@router.delete("/{order_id}")
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    # Order items first delete panrom
    db.query(OrderItem).filter(
        OrderItem.order_id == order_id
    ).delete()

    # Then order delete panrom
    db.delete(order)
    db.commit()

    return {
        "message": "Order deleted successfully"
    }