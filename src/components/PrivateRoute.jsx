import { useLocation, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ allowedRoles, children }) => {
    const { auth } = useAuth();
    const location = useLocation();
    console.log(auth?.status)
    
    if (auth?.status === 2) {
        return <Navigate to="/banned" state={{ from: location }} replace />;
    }

    if (!auth?.role) {
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }

    if (allowedRoles?.includes(auth?.role)) {
        return children; 
    }
    
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
}

export default PrivateRoute;
