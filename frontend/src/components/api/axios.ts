import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}/api` : 'http://localhost:3000/api'),
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;