from pydantic import BaseModel, EmailStr, Field


# Register panna request data
class UserCreate(BaseModel):
    # User name minimum 2 characters
    name: str = Field(min_length=2)

    # Valid email format check pannum
    email: EmailStr

    # Password minimum 6 characters
    password: str = Field(min_length=6)


# Login panna request data
class UserLogin(BaseModel):
    # Login email
    email: EmailStr

    # Login password
    password: str


# Admin create panna request data
class AdminCreate(BaseModel):
    # Admin name minimum 2 characters
    name: str = Field(min_length=2)

    # Valid email format check pannum
    email: EmailStr

    # Admin password minimum 6 characters
    password: str = Field(min_length=6)


# API response-ku use pannuvom
class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str

    # SQLAlchemy model object-la irundhu response create panna
    model_config = {
        "from_attributes": True
    }