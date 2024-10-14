import { useLocation, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ allowedRoles, children }) => {
    const { auth } = useAuth();
    const location = useLocation();
    console.log(auth?.role)
    if (allowedRoles?.includes(auth?.role)) {
        return children; 
    }

    if (!auth?.user) {
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }

    return <Navigate to="/auth/login" state={{ from: location }} replace />;
}

export default PrivateRoute;
