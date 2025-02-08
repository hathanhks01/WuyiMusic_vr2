import axios from 'axios';

const http = axios.create({
  baseURL: 'https://localhost:7078/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default http;
