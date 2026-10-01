from sqlalchemy import Column, Integer, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class OrderItem(Base):
    # MySQL table name
    __tablename__ = "order_items"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Foreign Key -> Order table
    order_id = Column(
        Integer,
        ForeignKey("orders.id"),
        nullable=False
    )

    # Foreign Key -> Food table
    food_id = Column(
        Integer,
        ForeignKey("foods.id"),
        nullable=False
    )

    # Required
    quantity = Column(Integer, nullable=False)

    # Required
    unit_price = Column(Numeric(10, 2), nullable=False)

    # Required
    subtotal = Column(Numeric(10, 2), nullable=False)

    # Oru order item oru order-kku belong aagum
    order = relationship("Order", back_populates="order_items")

    # Oru order item oru food-kku belong aagum
    food = relationship("Food", back_populates="order_items")