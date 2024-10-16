import axios from 'axios';
// const BASE_URL = 'https://kienos-backend-gfxn.onrender.com/';
const BASE_URL = 'http://localhost:8000';

export default axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});