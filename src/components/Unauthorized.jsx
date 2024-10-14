import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Unauthorized = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(-1); 
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <section>
      <h1>Unauthorized</h1>
      <p>You do not have access to this page.</p>
      <p>You will be redirected back shortly.</p>
      <div>
        <button onClick={() => navigate(-1)}>Go back to previous page</button>
      </div>
    </section>
  );
};

export default Unauthorized;
