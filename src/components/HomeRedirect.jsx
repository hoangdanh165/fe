import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; 
import paths from '../routes/paths';

const HomeRedirect = () => {
  const { auth } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.role === 'admin') {
      navigate(paths.dashboard); 
    } else if (auth?.role === 'customer') {
      navigate(paths.home); 
    } else {
      navigate(paths.login);
    }
  }, [auth, navigate]);

  return null;
};

export default HomeRedirect;
