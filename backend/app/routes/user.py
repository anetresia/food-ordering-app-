from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.user import User
from app.schemas.user import UserResponse
from app.routes.dependencies import get_current_admin


# User management related API routes create panrom
router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


# Database session provide panna function
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# GET ALL USERS
# Admin mattum ella users-um view panna mudiyum
@router.get(
    "/",
    response_model=list[UserResponse]
)
def get_users(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    # Database-la irukkura users ellam edukkrom
    users = db.query(User).all()

    return users


# GET SINGLE USER
# Admin mattum particular user-a view panna mudiyum
@router.get(
    "/{user_id}",
    response_model=UserResponse
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    # ID use panni user-a search panrom
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


# DELETE USER
# Admin mattum user delete panna mudiyum
@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    # Delete panna vendiya user-a search panrom
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Current admin thane delete panna try panraara-nu check panrom
    if user.id == current_admin.id:
        raise HTTPException(
            status_code=400,
            detail="Admin cannot delete their own account"
        )

    # User delete panrom
    db.delete(user)
    db.commit()

    return {
        "message": "User deleted successfully"
    }