import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../token";
import { useState, useEffect } from "react";

function ProtectedRoute({children}) {
    const [isAuthorized, setIsAuthorized] = useState(null)
    
    useEffect(() => {
        auth().catch(() => isAuthorized(false))
    }, [])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)

        //try to get a new token
        //try to get a response to the /api/token/refresh/ (the backend) with the refresh token which will give us a new access token
        try {
            const res = await api.post("/api/token/refresh/", {refresh: refreshToken,}); 
            //if it 200 (ok) then set the new access token
            if(res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }

        } catch(error) {
            console.log(error)
            setIsAuthorized(false)
        }
    }

    //check for access token if it expired or not
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if(!token) {
            setIsAuthorized(false)
            return
        }
        const decoded = jwtDecode(token) //give us expiration date
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000

        //if the token is expired it will ask for new token
        if(tokenExpiration < now) {
            await refreshToken()
        } else {
            setIsAuthorized(true)
        }
    }

    if (isAuthorized === null){
        return <div>Loading...</div>
    }
    //if not authorized then return to login page
    return isAuthorized ? children : <Navigate to="/login"/>
}

export default ProtectedRoute