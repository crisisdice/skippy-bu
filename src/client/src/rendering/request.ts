type Method = 'GET' | 'POST' | 'PUT'
type Args = {
  method: Method
  endpoint: string
  data?: any
  token?: string
}

export async function request({ method, endpoint, token, data }: Args) {
  const url = 'http://localhost:3001'
  const auth = token ? { 'Authorization': `Bearer ${token}` } : undefined
  const response = await fetch(url + endpoint, {
    method,
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      ...auth,
      'Content-Type': 'application/json',
    },
    referrerPolicy: 'no-referrer',
    body: method === 'GET' ? undefined : JSON.stringify(data)
  })
  return response
}

