from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.category import router as category_router
from app.routes.food import router as food_router
from app.routes.customer import router as customer_router
from app.routes.order import router as order_router
from app.routes.order_item import router as order_item_router
from app.routes.auth import router as auth_router
from app.routes.dashboard import router as dashboard_router
from app.routes.reports import router as reports_router
from app.routes.user import router as user_router


# FastAPI application create panrom
app = FastAPI(
    title="Food Ordering API",
    description="Food Ordering System Backend API",
    version="1.0.0"
)


# React frontend-kku backend API access panna allow panrom
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Category routes connect panrom
app.include_router(category_router)

# Food routes connect panrom
app.include_router(food_router)

# Customer routes connect panrom
app.include_router(customer_router)

# Order routes connect panrom
app.include_router(order_router)

# Order Item routes connect panrom
app.include_router(order_item_router)

# Authentication routes connect panrom
app.include_router(auth_router)

# Admin dashboard routes connect panrom
app.include_router(dashboard_router)

# Reports routes connect panrom
app.include_router(reports_router)

# User management routes connect panrom
app.include_router(user_router)


# Basic API test route
@app.get("/")
def root():
    return {
        "message": "Food Ordering API is running"
    }