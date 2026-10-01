from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from app.database import Base


class Food(Base):
    # MySQL table name
    __tablename__ = "foods"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Required
    name = Column(String(100), nullable=False)

    # Optional
    description = Column(String(255), nullable=True)

    # Required - Decimal for food price
    price = Column(Numeric(10, 2), nullable=False)

    # Optional
    image = Column(String(255), nullable=True)

    # Default True
    is_available = Column(Boolean, default=True)

    # Foreign Key -> Category table
    category_id = Column(
        Integer,
        ForeignKey("categories.id"),
        nullable=False
    )

    # Oru food oru category-kku belong aagum
    category = relationship("Category", back_populates="foods")

    # Oru food pala order items-la varalaam
    order_items = relationship("OrderItem", back_populates="food")