import { Link } from '@remix-run/react';

const Dashboard = () => {
  return (
    <main>
      <div className="flex flex-col max-w-3xl mx-auto p-6">
        <Link to="/profile">Profile</Link>
        <Link to="/">Home</Link>
      </div>
    </main>
  );
};

export default Dashboard;
