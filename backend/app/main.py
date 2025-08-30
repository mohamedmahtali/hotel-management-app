from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from sqlmodel import Session
from datetime import date

from .database import init_db, get_session
from .models import (
    Room, RoomCreate, RoomRead, RoomUpdate,
    Guest, GuestCreate, GuestRead, GuestUpdate,
    Booking, BookingCreate, BookingRead, BookingUpdate
)
from . import crud

app = FastAPI(title="Hotel Management API", version="0.1.0")

# CORS for local dev (Vite default port 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/healthz")
def healthz():
    return {"status": "ok"}

# ---------- Rooms ----------
@app.post("/rooms", response_model=RoomRead)
def create_room(room_in: RoomCreate, session: Session = Depends(get_session)):
    return crud.create_room(session, room_in)

@app.get("/rooms", response_model=List[RoomRead])
def list_rooms(session: Session = Depends(get_session)):
    return crud.list_rooms(session)

@app.get("/rooms/{room_id}", response_model=RoomRead)
def get_room(room_id: int, session: Session = Depends(get_session)):
    room = crud.get_room(session, room_id)
    if not room:
        raise HTTPException(404, "Room not found")
    return room

@app.patch("/rooms/{room_id}", response_model=RoomRead)
def update_room(room_id: int, room_in: RoomUpdate, session: Session = Depends(get_session)):
    room = crud.get_room(session, room_id)
    if not room:
        raise HTTPException(404, "Room not found")
    return crud.update_room(session, room, room_in)

@app.delete("/rooms/{room_id}")
def delete_room(room_id: int, session: Session = Depends(get_session)):
    room = crud.get_room(session, room_id)
    if not room:
        raise HTTPException(404, "Room not found")
    crud.delete_room(session, room)
    return {"ok": True}

# ---------- Guests ----------
@app.post("/guests", response_model=GuestRead)
def create_guest(guest_in: GuestCreate, session: Session = Depends(get_session)):
    return crud.create_guest(session, guest_in)

@app.get("/guests", response_model=List[GuestRead])
def list_guests(session: Session = Depends(get_session)):
    return crud.list_guests(session)

@app.get("/guests/{guest_id}", response_model=GuestRead)
def get_guest(guest_id: int, session: Session = Depends(get_session)):
    guest = crud.get_guest(session, guest_id)
    if not guest:
        raise HTTPException(404, "Guest not found")
    return guest

@app.patch("/guests/{guest_id}", response_model=GuestRead)
def update_guest(guest_id: int, guest_in: GuestUpdate, session: Session = Depends(get_session)):
    guest = crud.get_guest(session, guest_id)
    if not guest:
        raise HTTPException(404, "Guest not found")
    return crud.update_guest(session, guest, guest_in)

@app.delete("/guests/{guest_id}")
def delete_guest(guest_id: int, session: Session = Depends(get_session)):
    guest = crud.get_guest(session, guest_id)
    if not guest:
        raise HTTPException(404, "Guest not found")
    crud.delete_guest(session, guest)
    return {"ok": True}

# ---------- Bookings ----------
@app.post("/bookings", response_model=BookingRead)
def create_booking(booking_in: BookingCreate, session: Session = Depends(get_session)):
    try:
        return crud.create_booking(session, booking_in)
    except ValueError as e:
        raise HTTPException(400, str(e))

@app.get("/bookings", response_model=List[BookingRead])
def list_bookings(session: Session = Depends(get_session)):
    return crud.list_bookings(session)

@app.get("/bookings/{booking_id}", response_model=BookingRead)
def get_booking(booking_id: int, session: Session = Depends(get_session)):
    booking = crud.get_booking(session, booking_id)
    if not booking:
        raise HTTPException(404, "Booking not found")
    return booking

@app.patch("/bookings/{booking_id}", response_model=BookingRead)
def update_booking(booking_id: int, booking_in: BookingUpdate, session: Session = Depends(get_session)):
    booking = crud.get_booking(session, booking_id)
    if not booking:
        raise HTTPException(404, "Booking not found")
    try:
        return crud.update_booking(session, booking, booking_in)
    except ValueError as e:
        raise HTTPException(400, str(e))

@app.delete("/bookings/{booking_id}")
def delete_booking(booking_id: int, session: Session = Depends(get_session)):
    booking = crud.get_booking(session, booking_id)
    if not booking:
        raise HTTPException(404, "Booking not found")
    crud.delete_booking(session, booking)
    return {"ok": True}

# ---------- Availability ----------
@app.get("/availability")
def availability(
    check_in: date = Query(...),
    check_out: date = Query(...)
    , session: Session = Depends(get_session)
):
    if check_out <= check_in:
        raise HTTPException(400, "check_out must be after check_in")
    rooms = crud.list_rooms(session)
    available = []
    for r in rooms:
        if crud.check_room_available(session, r.id, check_in, check_out):
            available.append(r)
    return available
