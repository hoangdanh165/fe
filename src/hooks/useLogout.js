import axios from "../services/axios";
import useAuth2 from "./useAuth2";
import Cookies from "js-cookie";

const useLogout = () => {
    const { setAuth } = useAuth2(); 
    const logout = async () => {
        setAuth({});
        document.cookie = 'refresh_token' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        // try {
        //     const csrfToken = Cookies.get('csrftoken'); // Lấy CSRF token từ cookies

        //     axios.post('/api/v1/users/log-out/', {}, {
        //         headers: {
        //             'X-CSRFToken': csrfToken  // Gửi CSRF token qua headers
        //         },
        //         withCredentials: true
        //     });            

        // } catch (err) {
        //     console.error(err);
        // }
        
    }

    return logout;
}

export default useLogout