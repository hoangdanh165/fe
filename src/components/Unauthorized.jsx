import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <section>
      <h1>Unauthorized</h1>
      <p>You do not have access to this page.</p>
      <div>
        <Link to="/">Go back to Home</Link>
      </div>
    </section>
  );
}

export default Unauthorized;
