import axios from 'axios'
import { apiBase } from './apiBase'

const api = axios.create()

api.interceptors.request.use((config) => {
  config.baseURL = apiBase()
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
    }
    return Promise.reject(error)
  }
)

export default api