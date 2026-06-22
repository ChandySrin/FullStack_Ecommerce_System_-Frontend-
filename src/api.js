import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    Accept: 'application/json',
  },
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem('commerce_token', token);
    return;
  }

  delete api.defaults.headers.common.Authorization;
  localStorage.removeItem('commerce_token');
}

const token = localStorage.getItem('commerce_token');
if (token) {
  setAuthToken(token);
}

export default api;
