import useAxiosPrivate from "./useAxiosPrivate";
import useAuth from "./useAuth";

const useLogout = () => {
    const { setAuth } = useAuth(); 
    const axiosPrivate = useAxiosPrivate();

    const logout = async () => {
        setAuth(null);
        localStorage.removeItem('persist');
        try {
            axiosPrivate.post('/api/v1/users/log-out/', 
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