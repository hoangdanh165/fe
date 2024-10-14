import { useLocation, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const CheckLogin = ({ children }) => {
    const { auth } = useAuth();
    const location = useLocation();
    console.log(auth?.email)
    if (auth?.email) {
        return <Navigate to={location.state?.from || "/"} replace />;
    }

    return children;
}

export default CheckLogin;
