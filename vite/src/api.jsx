import axios from "axios";
import { ACCESS_TOKEN } from "./token";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

// look at local storage to see if you access token
// if there is add authorization to the request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if(token) {
            config.headers.Authorization = `Bearer ${token}` //pass a jwt token
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)



export default api