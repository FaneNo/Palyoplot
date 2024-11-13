import { Navigate } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "../contexts/authContext";

function ProtectedRoute({ children }) {
    const { isLoggedIn } = useContext(AuthContext);

    if (isLoggedIn === null){
        return <div>Loading...</div>
    }
    //if not authorized then return to login page
    return isLoggedIn ? children : <Navigate to="/login" replace/>;
}

export default ProtectedRoute;