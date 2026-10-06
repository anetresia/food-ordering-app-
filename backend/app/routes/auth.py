from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

from app.database import SessionLocal
from app.models.user import User
from app.schemas.user import (
    UserCreate,
    UserLogin,
    AdminCreate,
    UserResponse
)
from app.routes.dependencies import get_current_user


# .env file-la irukkura values-a load panrom
load_dotenv()


# Authentication related API routes create panrom
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# Password hash panna bcrypt use panrom
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# JWT configuration
# Values .env file-la irundhu varum
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
)


# Database session provide panna function
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# Password-a hash panrom
def hash_password(password: str):
    # bcrypt maximum 72 bytes support pannum
    password_bytes = password.encode("utf-8")

    if len(password_bytes) > 72:
        raise HTTPException(
            status_code=400,
            detail="Password must be 72 bytes or less"
        )

    return pwd_context.hash(password)


# Password verify panrom
def verify_password(
    plain_password: str,
    hashed_password: str
):
    password_bytes = plain_password.encode("utf-8")

    if len(password_bytes) > 72:
        return False

    return pwd_context.verify(
        plain_password,
        hashed_password
    )


# JWT access token create panrom
def create_access_token(data: dict):
    token_data = data.copy()

    # Token expire time set panrom
    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    token_data.update({
        "exp": expire
    })

    # JWT token generate panrom
    token = jwt.encode(
        token_data,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token


# REGISTER
# Normal registration-la role always user
@router.post(
    "/register",
    response_model=UserResponse
)
def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    # Same email-la user already irukka-nu check panrom
    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Password-a hash panrom
    hashed_password = hash_password(
        user_data.password
    )

    # New user create panrom
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_password,
        role="user"
    )

    # Database-la user save panrom
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# CREATE ADMIN
# Admin creation-ku separate endpoint
@router.post(
    "/admin",
    response_model=UserResponse
)
def create_admin(
    admin_data: AdminCreate,
    db: Session = Depends(get_db)
):
    # Same email-la user already irukka-nu check panrom
    existing_user = db.query(User).filter(
        User.email == admin_data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Admin password-a hash panrom
    hashed_password = hash_password(
        admin_data.password
    )

    # Admin user create panrom
    new_admin = User(
        name=admin_data.name,
        email=admin_data.email,
        password=hashed_password,
        role="admin"
    )

    # Database-la admin save panrom
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    return new_admin


# LOGIN
@router.post("/login")
def login_user(
    user_data: UserLogin,
    db: Session = Depends(get_db)
):
    # Email use panni user-a search panrom
    user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Password correct-a irukka-nu verify panrom
    if not verify_password(
        user_data.password,
        user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # JWT token create panrom
    access_token = create_access_token({
        "user_id": user.id,
        "role": user.role
    })

    # Token frontend-ku return panrom
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }


# GET CURRENT USER
# Login pannina current user oda details edukkrom
@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    current_user: User = Depends(get_current_user)
):
    # JWT token moolama identify panna user-a return panrom
    return current_user