import React, { useState } from 'react'
import Rooms from './components/Rooms.jsx'
import Guests from './components/Guests.jsx'
import Bookings from './components/Bookings.jsx'
import Availability from './components/Availability.jsx'

export default function App() {
  const [tab, setTab] = useState('rooms')

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 16, maxWidth: 1200, margin: '0 auto' }}>
      <h1>🏨 Hotel Manager</h1>
      <p style={{ marginTop: -8, opacity: .7 }}>FastAPI + React (Vite)</p>
      <nav style={{ display: 'flex', gap: 8, margin: '16px 0' }}>
        {['rooms','guests','bookings','availability'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd',
            background: tab===t ? '#efefef' : 'white', cursor:'pointer'
          }}>{t.toUpperCase()}</button>
        ))}
      </nav>

      <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
        {tab === 'rooms' && <Rooms />}
        {tab === 'guests' && <Guests />}
        {tab === 'bookings' && <Bookings />}
        {tab === 'availability' && <Availability />}
      </div>
    </div>
  )
}
