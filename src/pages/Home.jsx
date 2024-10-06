import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const Users = () => {
    const [users, setUsers] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/api/v1/users', {
                });
                console.log(response.data);
                isMounted && setUsers(response.data.results);
            } catch (err) {
                console.error(err);
                navigate('/auth/login', { state: { from: location }, replace: true });
            }
        }

        getUsers();
        
        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])
    return (
        <article>
            <h2>Danh Sách Người Dùng</h2>
            {users.length > 0 ? ( 
                <ul>
                    {users.map((user, index) => (
                        <li key={index}>
                            <img src={user.email} style={{ width: '50px', borderRadius: '50%' }} />
                            <p>Email: {user.email}</p>
                            <p>Trạng thái: {user.status}</p>
                            <p>Email đã xác minh: {user.email_verified ? "Đã xác minh" : "Chưa xác minh"}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Không có người dùng nào để hiển thị.</p>
            )}
        </article>
    );
};

export default Users;