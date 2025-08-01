// src/api/index.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // adjust if your backend runs on a different port
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
