import axios from 'axios';

const api = axios.create({
  baseURL: 'http://<IP SERVER>:3000',
});

export default api;
