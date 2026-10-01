from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Order(Base):
    # MySQL table name
    __tablename__ = "orders"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Foreign Key -> Customer table
    customer_id = Column(
        Integer,
        ForeignKey("customers.id"),
        nullable=False
    )

    # Required
    total_amount = Column(Numeric(10, 2), nullable=False)

    # Required
    status = Column(
        String(30),
        nullable=False,
        default="Pending"
    )

    # Automatically store order creation date and time
    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    # Oru order oru customer-kku belong aagum
    customer = relationship("Customer", back_populates="orders")

    # Oru order-la pala order items irukkalaam
    order_items = relationship("OrderItem", back_populates="order")