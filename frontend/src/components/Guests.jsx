import React, { useEffect, useState } from 'react'
import { GuestsAPI } from '../api.js'

export default function Guests() {
  const [guests, setGuests] = useState([])
  const [form, setForm] = useState({ full_name:'', email:'', phone:'' })
  const [error, setError] = useState(null)

  async function refresh() { setGuests(await GuestsAPI.list()) }
  useEffect(() => { refresh() }, [])

  async function addGuest(e) {
    e.preventDefault()
    try {
      await GuestsAPI.create(form)
      setForm({ full_name:'', email:'', phone:'' })
      refresh()
    } catch (err) { setError(err.message) }
  }

  async function remove(id) { await GuestsAPI.remove(id); refresh() }

  return (
    <div>
      <h2>Guests</h2>
      {error && <p style={{ color:'red' }}>{error}</p>}
      <form onSubmit={addGuest} style={{ display:'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 8, alignItems: 'end', marginBottom: 12 }}>
        <div><label>Full name<br/><input value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} required/></label></div>
        <div><label>Email<br/><input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required/></label></div>
        <div><label>Phone<br/><input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/></label></div>
        <button type="submit">Add</button>
      </form>

      <table width="100%" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr><th align="left">ID</th><th align="left">Name</th><th align="left">Email</th><th align="left">Phone</th><th></th></tr>
        </thead>
        <tbody>
          {guests.map(g => (
            <tr key={g.id} style={{ borderTop: '1px solid #eee' }}>
              <td>{g.id}</td><td>{g.full_name}</td><td>{g.email}</td><td>{g.phone}</td>
              <td><button onClick={()=>remove(g.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
