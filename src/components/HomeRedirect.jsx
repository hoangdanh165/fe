import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"; 
import paths from "../routes/paths";

const HomeRedirect = () => {
  const { auth } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Role in HomeRedirect: ", auth?.role); // Kiểm tra role trong auth
    if (auth?.role === "admin") {
      navigate(paths.dashboard); 
    } else if (auth?.role === "coach") {
      navigate(paths.customer); 
    } else {
      navigate(paths.login); 
    } 
  }, [auth?.role, navigate]);

  return null;
};

export default HomeRedirect;
