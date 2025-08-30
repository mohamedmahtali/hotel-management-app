import React, { useEffect, useState } from 'react'
import { RoomsAPI } from '../api.js'

export default function Rooms() {
  const [rooms, setRooms] = useState([])
  const [form, setForm] = useState({ number:'', type:'single', price_per_night: 80, status: 'available' })
  const [error, setError] = useState(null)

  async function refresh() { setRooms(await RoomsAPI.list()) }
  useEffect(() => { refresh() }, [])

  async function addRoom(e) {
    e.preventDefault()
    try {
      await RoomsAPI.create(form)
      setForm({ number:'', type:'single', price_per_night: 80, status: 'available' })
      refresh()
    } catch (err) { setError(err.message) }
  }

  async function remove(id) { await RoomsAPI.remove(id); refresh() }

  return (
    <div>
      <h2>Rooms</h2>
      {error && <p style={{ color:'red' }}>{error}</p>}
      <form onSubmit={addRoom} style={{ display:'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 8, alignItems: 'end', marginBottom: 12 }}>
        <div><label>No.<br/><input value={form.number} onChange={e=>setForm({...form, number:e.target.value})} required/></label></div>
        <div><label>Type<br/>
          <select value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>
            <option>single</option><option>double</option><option>suite</option>
          </select>
        </label></div>
        <div><label>Price/night (€)<br/><input type="number" step="0.01" value={form.price_per_night} onChange={e=>setForm({...form, price_per_night:parseFloat(e.target.value)})} required/></label></div>
        <div><label>Status<br/>
          <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
            <option>available</option><option>maintenance</option>
          </select>
        </label></div>
        <button type="submit">Add</button>
      </form>

      <table width="100%" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr><th align="left">ID</th><th align="left">No.</th><th align="left">Type</th><th align="left">€/night</th><th align="left">Status</th><th></th></tr>
        </thead>
        <tbody>
          {rooms.map(r => (
            <tr key={r.id} style={{ borderTop: '1px solid #eee' }}>
              <td>{r.id}</td><td>{r.number}</td><td>{r.type}</td><td>{r.price_per_night}</td><td>{r.status}</td>
              <td><button onClick={()=>remove(r.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
