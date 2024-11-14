import useAuth from "./useAuth";
import axios from "../services/axios";
const REFRESH_URL = '/api/v1/users/refresh/';


const useRefreshToken = () => {
    const { setAuth } = useAuth();
    
    const refresh = async () => {
        const response = await axios.post(REFRESH_URL,
            {}, 
            { withCredentials: true }
        );

        setAuth(prev => {
            return { 
                ...prev, 
                role: response.data.role,
                accessToken: response.data.accessToken, 
                avatar: response.data.avatar,
                status: response.data.status, 
                fullName: response.data.fullName, 
            }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;