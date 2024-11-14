import useAxiosPrivate from "./useAxiosPrivate";

const useLogout = () => {
    const axiosPrivate = useAxiosPrivate();

    const logout = async () => {
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