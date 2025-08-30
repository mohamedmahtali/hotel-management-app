import React, { useState } from 'react'
import { AvailabilityAPI } from '../api.js'

export default function Availability() {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [rooms, setRooms] = useState([])
  const [error, setError] = useState(null)

  async function query(e) {
    e.preventDefault()
    setError(null)
    try {
      const res = await AvailabilityAPI.query(checkIn, checkOut)
      setRooms(res)
    } catch (err) {
      setError(err.message)
      setRooms([])
    }
  }

  return (
    <div>
      <h2>Availability</h2>
      {error && <p style={{ color:'red' }}>{error}</p>}
      <form onSubmit={query} style={{ display:'flex', gap: 8, alignItems: 'end', marginBottom: 12 }}>
        <label>Check-in<br/><input type="date" value={checkIn} onChange={e=>setCheckIn(e.target.value)} required/></label>
        <label>Check-out<br/><input type="date" value={checkOut} onChange={e=>setCheckOut(e.target.value)} required/></label>
        <button type="submit">Check</button>
      </form>

      {rooms.length > 0 ? (
        <table width="100%" style={{ borderCollapse: 'collapse' }}>
          <thead><tr><th align="left">ID</th><th align="left">No.</th><th align="left">Type</th><th align="left">€/night</th><th align="left">Status</th></tr></thead>
          <tbody>
            {rooms.map(r => (
              <tr key={r.id} style={{ borderTop: '1px solid #eee' }}>
                <td>{r.id}</td><td>{r.number}</td><td>{r.type}</td><td>{r.price_per_night}</td><td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p>No rooms found for the selected dates.</p>}
    </div>
  )
}
