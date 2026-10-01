from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import SessionLocal
from app.models.food import Food
from app.models.category import Category
from app.models.customer import Customer
from app.models.order import Order
from app.models.user import User
from app.routes.dependencies import get_current_admin


# Admin dashboard related API routes create panrom
router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


# Database session provide panna function
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# ADMIN DASHBOARD
# Admin mattum dashboard data view panna mudiyum
@router.get("/")
def get_dashboard(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    # Total foods count panrom
    total_foods = db.query(Food).count()

    # Total categories count panrom
    total_categories = db.query(Category).count()

    # Total customers count panrom
    total_customers = db.query(Customer).count()

    # Total orders count panrom
    total_orders = db.query(Order).count()

    # Total revenue calculate panrom
    total_revenue = db.query(
        func.sum(Order.total_amount)
    ).scalar() or 0

    # Pending orders count panrom
    pending_orders = db.query(Order).filter(
        Order.status == "Pending"
    ).count()

    # Delivered orders count panrom
    delivered_orders = db.query(Order).filter(
        Order.status == "Delivered"
    ).count()

    # Dashboard data return panrom
    return {
        "total_foods": total_foods,
        "total_categories": total_categories,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "pending_orders": pending_orders,
        "delivered_orders": delivered_orders
    }