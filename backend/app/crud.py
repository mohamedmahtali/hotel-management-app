from datetime import date
from typing import List, Optional
from sqlmodel import select, Session
from .models import (
    Room, RoomCreate, RoomUpdate,
    Guest, GuestCreate, GuestUpdate,
    Booking, BookingCreate, BookingUpdate
)

# -------- Rooms --------
def create_room(session: Session, room_in: RoomCreate) -> Room:
    room = Room.model_validate(room_in, update={})
    session.add(room)
    session.commit()
    session.refresh(room)
    return room

def list_rooms(session: Session) -> List[Room]:
    return session.exec(select(Room)).all()

def get_room(session: Session, room_id: int) -> Optional[Room]:
    return session.get(Room, room_id)

def update_room(session: Session, room: Room, room_in: RoomUpdate) -> Room:
    room_data = room_in.model_dump(exclude_unset=True)
    for k, v in room_data.items():
        setattr(room, k, v)
    session.add(room)
    session.commit()
    session.refresh(room)
    return room

def delete_room(session: Session, room: Room) -> None:
    session.delete(room)
    session.commit()

# -------- Guests --------
def create_guest(session: Session, guest_in: GuestCreate) -> Guest:
    guest = Guest.model_validate(guest_in, update={})
    session.add(guest)
    session.commit()
    session.refresh(guest)
    return guest

def list_guests(session: Session) -> List[Guest]:
    return session.exec(select(Guest)).all()

def get_guest(session: Session, guest_id: int) -> Optional[Guest]:
    return session.get(Guest, guest_id)

def update_guest(session: Session, guest: Guest, guest_in: GuestUpdate) -> Guest:
    guest_data = guest_in.model_dump(exclude_unset=True)
    for k, v in guest_data.items():
        setattr(guest, k, v)
    session.add(guest)
    session.commit()
    session.refresh(guest)
    return guest

def delete_guest(session: Session, guest: Guest) -> None:
    session.delete(guest)
    session.commit()

# -------- Bookings --------
def has_overlap(a_start: date, a_end: date, b_start: date, b_end: date) -> bool:
    # Overlap if ranges intersect: (a_start < b_end) and (b_start < a_end)
    return a_start < b_end and b_start < a_end

def check_room_available(session: Session, room_id: int, check_in: date, check_out: date, exclude_booking_id: Optional[int] = None) -> bool:
    stmt = select(Booking).where(Booking.room_id == room_id)
    if exclude_booking_id is not None:
        stmt = stmt.where(Booking.id != exclude_booking_id)
    bookings = session.exec(stmt).all()
    for b in bookings:
        if b.status != "cancelled" and has_overlap(check_in, check_out, b.check_in, b.check_out):
            return False
    return True

def create_booking(session: Session, booking_in: BookingCreate) -> Booking:
    room = session.get(Room, booking_in.room_id)
    guest = session.get(Guest, booking_in.guest_id)
    if room is None:
        raise ValueError("Room not found")
    if guest is None:
        raise ValueError("Guest not found")
    if booking_in.check_out <= booking_in.check_in:
        raise ValueError("check_out must be after check_in")
    if not check_room_available(session, booking_in.room_id, booking_in.check_in, booking_in.check_out):
        raise ValueError("Room not available for given dates")
    booking = Booking.model_validate(booking_in, update={})
    session.add(booking)
    session.commit()
    session.refresh(booking)
    return booking

def list_bookings(session: Session) -> List[Booking]:
    return session.exec(select(Booking)).all()

def get_booking(session: Session, booking_id: int) -> Optional[Booking]:
    return session.get(Booking, booking_id)

def update_booking(session: Session, booking: Booking, booking_in: BookingUpdate) -> Booking:
    data = booking_in.model_dump(exclude_unset=True)
    new_check_in = data.get("check_in", booking.check_in)
    new_check_out = data.get("check_out", booking.check_out)
    new_room_id = data.get("room_id", booking.room_id)

    if new_check_out <= new_check_in:
        raise ValueError("check_out must be after check_in")
    if not check_room_available(session, new_room_id, new_check_in, new_check_out, exclude_booking_id=booking.id):
        raise ValueError("Room not available for given dates")

    for k, v in data.items():
        setattr(booking, k, v)
    session.add(booking)
    session.commit()
    session.refresh(booking)
    return booking

def delete_booking(session: Session, booking: Booking) -> None:
    session.delete(booking)
    session.commit()
