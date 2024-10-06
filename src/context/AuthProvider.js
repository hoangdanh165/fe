import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = function ({ children }) {
    const [auth, setAuth] = useState({});

    return React.createElement(
        AuthContext.Provider,
        { value: { auth, setAuth } },
        children
    );
};

export default AuthContext;
