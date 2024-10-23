import axios from "../services/axios";
import useAuth from "./useAuth";

const useLogout = () => {
    const { setAuth } = useAuth(); 
    window.localStorage.removeItem('isLoggedIn');
    
    const logout = async () => {
        setAuth(null);
        localStorage.removeItem('persist')
        try {
            axios.post('/api/v1/users/log-out/', 
            {}, 
            {
                withCredentials: true
            });            

        } catch (err) {
            console.error(err);
        }
        
    }

    return logout;
}

export default useLogout