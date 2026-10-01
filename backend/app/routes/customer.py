from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.customer import Customer
from app.models.user import User
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerResponse
from app.routes.dependencies import get_current_user, get_current_admin

router = APIRouter(prefix="/customers", tags=["Customers"])


# Database session create panna
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# CREATE CUSTOMER
@router.post("/", response_model=CustomerResponse)
def create_customer(
    customer_data: CustomerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Same email already irukka-nu check panrom
    existing_customer = db.query(Customer).filter(
        Customer.email == customer_data.email
    ).first()

    if existing_customer:
        raise HTTPException(
            status_code=400,
            detail="Customer email already exists"
        )

    # Login pannirukkura user's email-oda
    # customer email match aaganum
    if customer_data.email != current_user.email:
        raise HTTPException(
            status_code=403,
            detail="Customer email must match logged-in user email"
        )

    new_customer = Customer(
        name=customer_data.name,
        email=customer_data.email,
        phone=customer_data.phone,
        address=customer_data.address
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    return new_customer


# READ ALL CUSTOMERS
# Admin mattum all customers-a paarkalaam
@router.get("/", response_model=list[CustomerResponse])
def get_customers(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    customers = db.query(Customer).all()

    return customers


# READ ONE CUSTOMER
@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    # User thanoda own customer data mattum paarkalaam
    if customer.email != current_user.email:
        raise HTTPException(
            status_code=403,
            detail="You can only access your own customer profile"
        )

    return customer


# UPDATE CUSTOMER
@router.put("/{customer_id}", response_model=CustomerResponse)
def update_customer(
    customer_id: int,
    customer_data: CustomerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    # Own profile mattum update panna allow panrom
    if customer.email != current_user.email:
        raise HTTPException(
            status_code=403,
            detail="You can only update your own customer profile"
        )

    # Email update panna try pannina
    if customer_data.email is not None:

        # New email login user email-oda match aaganum
        if customer_data.email != current_user.email:
            raise HTTPException(
                status_code=403,
                detail="You cannot change the customer email"
            )

        # Vera customer use pannura email-aa check panrom
        existing_customer = db.query(Customer).filter(
            Customer.email == customer_data.email,
            Customer.id != customer_id
        ).first()

        if existing_customer:
            raise HTTPException(
                status_code=400,
                detail="Customer email already exists"
            )

        customer.email = customer_data.email

    if customer_data.name is not None:
        customer.name = customer_data.name

    if customer_data.phone is not None:
        customer.phone = customer_data.phone

    if customer_data.address is not None:
        customer.address = customer_data.address

    db.commit()
    db.refresh(customer)

    return customer


# DELETE CUSTOMER
# Admin mattum delete panna mudiyum
@router.delete("/{customer_id}")
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    db.delete(customer)
    db.commit()

    return {
        "message": "Customer deleted successfully"
    }