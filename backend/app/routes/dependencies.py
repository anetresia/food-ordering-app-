from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os

from app.database import SessionLocal
from app.models.user import User


# .env file-la irukkura values-a load panrom
load_dotenv()


# Login endpoint JWT token provide pannum
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


# JWT configuration
# Values .env file-la irundhu varum
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")


# Database session provide panna function
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# JWT token verify panni current user-a find panrom
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        # JWT token decode panrom
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        # Token-la irukkura user_id edukkrom
        user_id = payload.get("user_id")

        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    # Database-la user-a find panrom
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user


# Current user admin-aa check panrom
def get_current_admin(
    current_user: User = Depends(get_current_user)
):
    # Role admin illana access deny panrom
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return current_user