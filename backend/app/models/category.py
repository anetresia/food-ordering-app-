from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class Category(Base):
    # MySQL-la create aagura table name
    __tablename__ = "categories"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Category name - required + unique
    name = Column(String(100), unique=True, nullable=False)

    # Description optional
    description = Column(String(255), nullable=True)

    # Oru category-ku pala foods irukkalaam
    foods = relationship("Food", back_populates="category")