import { useState, useEffect } from "react";
import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from "../hooks/useAuth";
import { CircularProgress } from "@mui/material";

const PersistLogin = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, persist } = useAuth();
    
    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                console.error(err);
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }

        !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted = false;
    }, [auth, persist, refresh]); 

    return (
        <>
            {!persist
                ? children 
                : isLoading
                    ? (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100vh',
                        }}>
                            <CircularProgress />
                        </div>
                    )
                    : children
            }
        </>
    );
}

export default PersistLogin;
