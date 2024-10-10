import { useContext, useDebugValue } from "react";
import AuthContext from "../providers/AuthProvider";

const useAuth2 = () => {
    const { auth } = useContext(AuthContext);
    useDebugValue(auth, auth => auth?.email ? "Logged In" : "Logged Out")
    return useContext(AuthContext);
}

export default useAuth2;