from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import SessionLocal
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.food import Food
from app.models.user import User
from app.routes.dependencies import get_current_admin


# Reports related API routes create panrom
router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


# Database session provide panna function
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# SALES / REVENUE REPORT
# Admin mattum sales report view panna mudiyum
@router.get("/sales")
def get_sales_report(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    # Total orders count panrom
    total_orders = db.query(Order).count()

    # Total revenue calculate panrom
    total_revenue = db.query(
        func.sum(Order.total_amount)
    ).scalar() or 0

    return {
        "total_orders": total_orders,
        "total_revenue": total_revenue
    }


# ORDER STATUS REPORT
# Different status-la ethana orders irukku-nu count panrom
@router.get("/order-status")
def get_order_status_report(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    # Pending orders
    pending = db.query(Order).filter(
        Order.status == "Pending"
    ).count()

    # Confirmed orders
    confirmed = db.query(Order).filter(
        Order.status == "Confirmed"
    ).count()

    # Preparing orders
    preparing = db.query(Order).filter(
        Order.status == "Preparing"
    ).count()

    # Out for Delivery orders
    out_for_delivery = db.query(Order).filter(
        Order.status == "Out for Delivery"
    ).count()

    # Delivered orders
    delivered = db.query(Order).filter(
        Order.status == "Delivered"
    ).count()

    # Cancelled orders
    cancelled = db.query(Order).filter(
        Order.status == "Cancelled"
    ).count()

    return {
        "Pending": pending,
        "Confirmed": confirmed,
        "Preparing": preparing,
        "Out for Delivery": out_for_delivery,
        "Delivered": delivered,
        "Cancelled": cancelled
    }


# POPULAR FOOD REPORT
# Most ordered foods based on quantity
@router.get("/popular-foods")
def get_popular_foods(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    # Food-wise total ordered quantity calculate panrom
    popular_foods = (
        db.query(
            Food.id,
            Food.name,
            func.sum(OrderItem.quantity).label("total_quantity")
        )
        .join(
            OrderItem,
            Food.id == OrderItem.food_id
        )
        .group_by(
            Food.id,
            Food.name
        )
        .order_by(
            func.sum(OrderItem.quantity).desc()
        )
        .all()
    )

    return [
        {
            "food_id": food.id,
            "food_name": food.name,
            "total_quantity": food.total_quantity
        }
        for food in popular_foods
    ]