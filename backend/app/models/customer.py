from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class Customer(Base):
    # MySQL table name
    __tablename__ = "customers"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Required
    name = Column(String(100), nullable=False)

    # Required + Unique
    email = Column(String(150), unique=True, nullable=False)

    # Required
    phone = Column(String(20), nullable=False)

    # Required
    address = Column(String(255), nullable=False)

    # Oru customer pala orders place pannalaam
    orders = relationship("Order", back_populates="customer")