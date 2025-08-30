const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export async function api(path, opts = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  return res.headers.get('content-type')?.includes('application/json') ? res.json() : res.text()
}

export const RoomsAPI = {
  list: () => api('/rooms'),
  create: (payload) => api('/rooms', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => api(`/rooms/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: (id) => api(`/rooms/${id}`, { method: 'DELETE' })
}

export const GuestsAPI = {
  list: () => api('/guests'),
  create: (payload) => api('/guests', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => api(`/guests/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: (id) => api(`/guests/${id}`, { method: 'DELETE' })
}

export const BookingsAPI = {
  list: () => api('/bookings'),
  create: (payload) => api('/bookings', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => api(`/bookings/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: (id) => api(`/bookings/${id}`, { method: 'DELETE' })
}

export const AvailabilityAPI = {
  query: (check_in, check_out) => api(`/availability?check_in=${check_in}&check_out=${check_out}`)
}
