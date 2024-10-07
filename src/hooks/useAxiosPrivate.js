import { axiosPrivate } from "../services/axios";
import { useEffect, useCallback } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { getAccessToken } = useAuth();

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    const token = getAccessToken();
                    if (token) {
                        config.headers['Authorization'] = `Bearer ${token}`;
                    }
                }
                return config;
            }, 
            (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    try {
                        const newAccessToken = await refresh();
                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return axiosPrivate(prevRequest);
                    } catch (refreshError) {
                        console.error('Không thể refresh token:', refreshError);
                        // Xử lý lỗi refresh token ở đây (ví dụ: đăng xuất người dùng)
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [getAccessToken, refresh]);

    return axiosPrivate;
};

export default useAxiosPrivate;