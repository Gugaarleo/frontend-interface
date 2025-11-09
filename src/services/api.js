const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

let onUnauthorized = null
export function setOnUnauthorized(fn) { onUnauthorized = fn }

async function request(path, { method = 'GET', body, token, headers = {} } = {}) {
  const finalHeaders = { 'Content-Type': 'application/json', ...headers }
  if (token) finalHeaders['Authorization'] = `Bearer ${token}`
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  })
  let data = null
  const contentType = response.headers.get('Content-Type') || ''
  if (contentType.includes('application/json')) {
    try { data = await response.json() } catch { data = null }
  } else {
    data = await response.text().catch(() => null)
  }
  if (!response.ok) {
    if (response.status === 401 && onUnauthorized) onUnauthorized()
    const message = data?.message || data || `Erro ${response.status}`
    throw new Error(message)
  }
  return data
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
}
