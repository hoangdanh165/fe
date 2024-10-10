import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from '../hooks/useRefreshToken';
import useAuth2 from "../hooks/useAuth2";

const PersistLogin = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, persist } = useAuth2();

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

        // Persist logic
        !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted = false;
    }, [auth, persist, refresh]); // Ensure you include dependencies

    useEffect(() => {
        console.log(`isLoading: ${isLoading}`);
        console.log(`aT: ${JSON.stringify(auth?.accessToken)}`);
    }, [isLoading, auth]);

    // Return children if not loading, else show loading text
    return (
        <>
            {!persist
                ? children // Return children directly
                : isLoading
                    ? <p>Loading...</p>
                    : children // Return children when loading is complete
            }
        </>
    );
}

export default PersistLogin;
