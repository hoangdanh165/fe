import { useState, useEffect, useRef, useCallback } from 'react';
import axios from '../services/axios'; 
import { useNavigate } from 'react-router-dom';

const LOGIN_URL = 'auth/token/obtain/';

const useAuth = () => {
    const accessTokenRef = useRef(null);
    const refreshTokenRef = useRef(null);
    const [user, setUser] = useState(null);


    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); 

    const getAccessToken = useCallback(() => accessTokenRef.current, []);
    const getRefreshToken = useCallback(() => refreshTokenRef.current, []);

   
    const setAccessToken = useCallback((token) => {
        accessTokenRef.current = token;
        if (token) {
            localStorage.setItem('accessToken', token);
        } else {
            localStorage.removeItem('accessToken');
        }
    }, []);

    const setRefreshToken = useCallback((refreshToken) => {
        refreshTokenRef.current = refreshToken;
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        } else {
            localStorage.removeItem('refreshToken');
        }
    }, []);


    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (token && refreshToken) {
            setAccessToken(token);
            setRefreshToken(refreshToken);
            console.log("UseEffectToken")
        }
    }, [setAccessToken, setRefreshToken]);

    useEffect(() => {
        if (user) {
            console.log("User đã thay đổi", user);
        }
    }, [user]);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            console.log('UseEffectToken')
          axios.get('/api/v1/users/identity', 
            { 
                headers: { Authorization: `Bearer ${accessToken}` } 
            })
            .then(response => setUser({email: response.data.email, status: response.data.status, role: response.data.role.name}))
            .catch(error => console.error('Failed to fetch user:', error));
        }
      }, []);

    
    const login = useCallback(async (email, password) => {
        setLoading(true);
        setErrorMessage('');
        try {
            const response = await axios.post(LOGIN_URL, JSON.stringify({ email, password }), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            const token = response?.data?.access;
            const refreshToken = response?.data?.refresh;

            console.log('Token received:', token);
            console.log('RefreshToken received:', refreshToken);
            
            setAccessToken(token);
            setRefreshToken(refreshToken);

            console.log('Token set:', getAccessToken());
            console.log('RefreshToken set:', getRefreshToken());
            
            return null;

        } catch (err) {
            if (!err?.response) {
                setErrorMessage('Không có phản hồi từ máy chủ!');
            } else if (err.response?.status === 400) {
                setErrorMessage('Thiếu tên đăng nhập hoặc mật khẩu!');
            } else if (err.response?.status === 401) {
                setErrorMessage('Tài khoản hoặc mật khẩu không đúng!');
            } else {
                setErrorMessage('Đăng nhập thất bại!');
            }
            return err;

        } finally {
            setLoading(false);
        }
    }, [setAccessToken, getAccessToken, setRefreshToken, getRefreshToken, user]);

    const logout = useCallback(() => {
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('refreshToken');
        navigate('/auth/login');
    }, [navigate, setAccessToken]);

    
    return {  user, getAccessToken, setAccessToken, 
             getRefreshToken, login, logout, 
             errorMessage, loading  }; 
};

export default useAuth;