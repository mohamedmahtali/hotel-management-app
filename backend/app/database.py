import os
from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./hotel.db")
engine = create_engine(DATABASE_URL, echo=False)

def get_session():
    with Session(engine) as session:
        yield session

def init_db():
    from .models import Room, Guest, Booking  # Ensure models are imported
    SQLModel.metadata.create_all(engine)
