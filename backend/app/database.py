from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

# .env file-la irukkura values-a load panrom
load_dotenv()

# .env-la irukkura database URL-a eduthukkrom
DATABASE_URL = os.getenv("DATABASE_URL")

# MySQL database-kku SQLAlchemy engine create panrom
engine = create_engine(DATABASE_URL)

# Database session create panna session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# SQLAlchemy models ellam inherit panna Base
Base = declarative_base()