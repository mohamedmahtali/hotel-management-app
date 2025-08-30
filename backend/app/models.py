from datetime import date
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class RoomBase(SQLModel):
    number: str
    type: str
    price_per_night: float
    status: str = "available"  # available, maintenance

class Room(RoomBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    bookings: List["Booking"] = Relationship(back_populates="room")

class RoomCreate(RoomBase):
    pass

class RoomRead(RoomBase):
    id: int

class RoomUpdate(SQLModel):
    number: Optional[str] = None
    type: Optional[str] = None
    price_per_night: Optional[float] = None
    status: Optional[str] = None

class GuestBase(SQLModel):
    full_name: str
    email: str
    phone: Optional[str] = None

class Guest(GuestBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    bookings: List["Booking"] = Relationship(back_populates="guest")

class GuestCreate(GuestBase):
    pass

class GuestRead(GuestBase):
    id: int

class GuestUpdate(SQLModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class BookingBase(SQLModel):
    check_in: date
    check_out: date
    status: str = "confirmed"  # confirmed, cancelled

class Booking(BookingBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    room_id: int = Field(foreign_key="room.id")
    guest_id: int = Field(foreign_key="guest.id")
    room: Optional[Room] = Relationship(back_populates="bookings")
    guest: Optional[Guest] = Relationship(back_populates="bookings")

class BookingCreate(BookingBase):
    room_id: int
    guest_id: int

class BookingRead(BookingBase):
    id: int
    room_id: int
    guest_id: int

class BookingUpdate(SQLModel):
    check_in: Optional[date] = None
    check_out: Optional[date] = None
    status: Optional[str] = None
    room_id: Optional[int] = None
    guest_id: Optional[int] = None
