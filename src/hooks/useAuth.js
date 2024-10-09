import { useState, useEffect, useRef, useCallback } from 'react';
import axios from '../services/axios'; 
import { useNavigate } from 'react-router-dom';

const LOGIN_URL = 'auth/token/obtain/';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const accessTokenRef = useRef(null);
    const refreshTokenRef = useRef(null);

    const [errMsg, setErrMsg] = useState('');
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
        }
    }, [setAccessToken, setRefreshToken]);

    const login = useCallback(async (email, password) => {
        setLoading(true);
        setErrMsg('');
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

            
            
            setUser({ email, roles: response.data.roles }); 
        } catch (err) {
            console.error('Login error:', err);
            if (!err?.response) {
                setErrMsg('Không có phản hồi từ máy chủ');
            } else if (err.response?.status === 400) {
                setErrMsg('Thiếu tên đăng nhập hoặc mật khẩu');
            } else if (err.response?.status === 401) {
                setErrMsg('Không được phép truy cập');
            } else {
                setErrMsg('Đăng nhập thất bại');
            }
        } finally {
            setLoading(false);
        }
    }, [setAccessToken, getAccessToken, setRefreshToken, getRefreshToken]);

    const logout = useCallback(() => {
        setAccessToken(null);
        setUser(null);
        navigate('/auth/login');
    }, [navigate, setAccessToken]);

    return { user, getAccessToken, setAccessToken, getRefreshToken, login, logout, errMsg, loading }; 
};

export default useAuth;