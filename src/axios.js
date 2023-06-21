import axios from 'axios';
export const axiosInstance = axios.create({baseURL: process.env.SERVER_URL});