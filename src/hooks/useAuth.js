import { useState, useEffect, useRef, useCallback } from 'react';
import axios from '../services/axios'; 
import { useNavigate } from 'react-router-dom';

const LOGIN_URL = 'auth/token/obtain/';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const accessTokenRef = useRef(null);
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); 

    const getAccessToken = useCallback(() => accessTokenRef.current, []);

    const setAccessToken = useCallback((token) => {
        accessTokenRef.current = token;
        if (token) {
            localStorage.setItem('accessToken', token);
        } else {
            localStorage.removeItem('accessToken');
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAccessToken(token);
        }
    }, [setAccessToken]);

    const login = useCallback(async (email, password) => {
        setLoading(true);
        setErrMsg('');
        try {
            const response = await axios.post(LOGIN_URL, JSON.stringify({ email, password }), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            const token = response?.data?.access;
            console.log('Token received:', token);
            
            setAccessToken(token);
            console.log('Token set:', getAccessToken());
            
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
    }, [setAccessToken, getAccessToken]);

    const logout = useCallback(() => {
        setAccessToken(null);
        setUser(null);
        navigate('/auth/login');
    }, [navigate, setAccessToken]);

    return { user, getAccessToken, login, logout, errMsg, loading }; 
};

export default useAuth;