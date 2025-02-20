import { Link } from '@remix-run/react';

const Dashboard = () => {
  return (
    <main>
      <div className="flex flex-col max-w-3xl mx-auto p-6">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/">Home</Link>
        <Link to="/" data-disable-progress={true}>
          Home (without progress)
        </Link>
      </div>
    </main>
  );
};

export default Dashboard;
