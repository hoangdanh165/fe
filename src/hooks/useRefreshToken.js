import axios from '../services/axios'; 
import useAuth from './useAuth';

const REFRESH_URL = '/auth/token/refresh/'; 

const useRefreshToken = () => {
    const { getRefreshToken, setAccessToken } = useAuth();

    const refresh = async () => {
        try {
            const refreshToken = getRefreshToken();
            console.log("OLD REFRESH TOKEN: ", refreshToken)
            const response = await axios.post(REFRESH_URL, 
                {
                    refresh: refreshToken
                }, 
                {
                    withCredentials: true, 
                    headers: { 
                        'Content-Type': 'application/json' 
                    }, 
                }
            );
            const newAccessToken = response?.data?.access;
            setAccessToken(newAccessToken);
            console.log("NEW TOKEN: ", newAccessToken)
            return newAccessToken;
        } catch (error) {
            console.error('Lỗi refresh token:', error);
            throw error; 
        }
    };

    return refresh;
};

export default useRefreshToken;
