import { Navigate } from 'react-router-dom';
import useAuth2 from '../hooks/useAuth2';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { auth } = useAuth2()
    console.log("ANHOIEMNUNG", auth?.role)

    if (auth?.role && allowedRoles.includes(auth.role)) {
        return children;
    } else {
        // return children;
        return <Navigate to="/auth/login" />; 
    }
};

export default PrivateRoute;
