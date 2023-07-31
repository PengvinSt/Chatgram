import axios from 'axios'

export const SERVER_URL = 'http://localhost:5000'



const api = axios.create({
    withCredentials:true,
    baseURL:`${SERVER_URL}/api`
})

export default api