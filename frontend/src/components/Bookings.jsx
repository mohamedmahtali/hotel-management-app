import React, { useEffect, useState } from 'react'
import { BookingsAPI, RoomsAPI, GuestsAPI } from '../api.js'

export default function Bookings() {
  const [bookings, setBookings] = useState([])
  const [rooms, setRooms] = useState([])
  const [guests, setGuests] = useState([])
  const [form, setForm] = useState({ room_id:'', guest_id:'', check_in:'', check_out:'' })
  const [error, setError] = useState(null)

  async function refresh() {
    setBookings(await BookingsAPI.list())
    setRooms(await RoomsAPI.list())
    setGuests(await GuestsAPI.list())
  }
  useEffect(() => { refresh() }, [])

  async function addBooking(e) {
    e.preventDefault()
    setError(null)
    try {
      await BookingsAPI.create({
        ...form,
        room_id: parseInt(form.room_id),
        guest_id: parseInt(form.guest_id)
      })
      setForm({ room_id:'', guest_id:'', check_in:'', check_out:'' })
      refresh()
    } catch (err) { setError(err.message) }
  }

  async function remove(id) { await BookingsAPI.remove(id); refresh() }

  return (
    <div>
      <h2>Bookings</h2>
      {error && <p style={{ color:'red' }}>{error}</p>}
      <form onSubmit={addBooking} style={{ display:'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 8, alignItems: 'end', marginBottom: 12 }}>
        <div><label>Room<br/>
          <select value={form.room_id} onChange={e=>setForm({...form, room_id:e.target.value})} required>
            <option value="">— choose —</option>
            {rooms.map(r => <option key={r.id} value={r.id}>#{r.number} ({r.type})</option>)}
          </select>
        </label></div>
        <div><label>Guest<br/>
          <select value={form.guest_id} onChange={e=>setForm({...form, guest_id:e.target.value})} required>
            <option value="">— choose —</option>
            {guests.map(g => <option key={g.id} value={g.id}>{g.full_name}</option>)}
          </select>
        </label></div>
        <div><label>Check-in<br/><input type="date" value={form.check_in} onChange={e=>setForm({...form, check_in:e.target.value})} required/></label></div>
        <div><label>Check-out<br/><input type="date" value={form.check_out} onChange={e=>setForm({...form, check_out:e.target.value})} required/></label></div>
        <button type="submit">Add</button>
      </form>

      <table width="100%" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr><th align="left">ID</th><th align="left">Room</th><th align="left">Guest</th><th align="left">Check-in</th><th align="left">Check-out</th><th align="left">Status</th><th></th></tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id} style={{ borderTop: '1px solid #eee' }}>
              <td>{b.id}</td>
              <td>{b.room_id}</td>
              <td>{b.guest_id}</td>
              <td>{b.check_in}</td>
              <td>{b.check_out}</td>
              <td>{b.status}</td>
              <td><button onClick={()=>remove(b.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
