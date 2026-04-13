const BASE = '/api';

function authHeader() {
  const token = localStorage.getItem('streamcal_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function searchMedia(query) {
  const res = await fetch(`${BASE}/search?q=${encodeURIComponent(query)}`, {
    headers: authHeader(),
  });
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

export async function getSaved() {
  const res = await fetch(`${BASE}/saved`, {
    headers: authHeader(),
  });
  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Failed to fetch saved items');
  return res.json();
}

export async function saveItem(item) {
  const res = await fetch(`${BASE}/saved`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(item),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to save');
  return data;
}

export async function deleteItem(id) {
  const res = await fetch(`${BASE}/saved/${id}`, {
    method: 'DELETE',
    headers: authHeader(),
  });
  if (!res.ok) throw new Error('Failed to delete');
  return res.json();
}

export async function getCalendarEvents() {
  const res = await fetch(`${BASE}/calendar`, {
    headers: authHeader(),
  });
  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Failed to fetch calendar');
  return res.json();
}
