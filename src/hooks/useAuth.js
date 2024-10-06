import { useState, useEffect } from 'react';
import axios from '../services/axios'; 

const LOGIN_URL = 'auth/token/obtain/';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null); // Thêm state cho accessToken
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        setLoading(true);
        setErrMsg('');
        try {
            const response = await axios.post(LOGIN_URL, JSON.stringify({ email, password }), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            const token = response?.data?.accessToken;

            // Lưu accessToken vào state
            setAccessToken(token);
            document.cookie = `accessToken=${token}; HttpOnly; Secure; SameSite=Lax`;

            setUser({ email, roles: response.data.roles }); 
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        document.cookie = 'accessToken=; Max-Age=0; path=/'; // Xóa cookie
        setUser(null);
        setAccessToken(null); // Reset accessToken khi logout
    };

    return { user, accessToken, login, logout, errMsg, loading }; // Trả về accessToken
};

export default useAuth;
