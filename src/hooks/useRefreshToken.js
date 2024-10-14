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

        console.log(response.data.role);
        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.accessToken, response.data.role);
            return { ...prev, 
                    role: response.data.role,
                    accessToken: response.data.accessToken }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;