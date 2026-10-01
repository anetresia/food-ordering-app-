from sqlalchemy import Column, Integer, String
from app.database import Base


# User table database-la create panrom
class User(Base):
    __tablename__ = "users"

    # User unique ID
    id = Column(Integer, primary_key=True, index=True)

    # User name
    name = Column(String(100), nullable=False)

    # Login-ku use panna email
    email = Column(String(150), unique=True, nullable=False)

    # Hashed password database-la store pannuvom
    password = Column(String(255), nullable=False)

    # Default role user
    # Admin user later Postman moolama create pannalaam
    role = Column(String(20), nullable=False, default="user")