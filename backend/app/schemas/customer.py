from pydantic import BaseModel, Field, EmailStr


# Customer create panna request data
class CustomerCreate(BaseModel):
    # Name minimum 2 characters
    name: str = Field(min_length=2)

    # Valid email format check pannum
    email: EmailStr

    # Phone required
    phone: str

    # Address required
    address: str


# Customer update panna request data
class CustomerUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2)

    email: EmailStr | None = None

    phone: str | None = None

    address: str | None = None


# API response-ku use pannuvom
class CustomerResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str
    address: str

    # SQLAlchemy model object-la irundhu response create panna
    model_config = {
        "from_attributes": True
    }