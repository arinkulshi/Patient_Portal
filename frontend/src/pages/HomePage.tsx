import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="card">
      <h1 className="text-3xl font-bold text-primary mb-4">
        Welcome to Patient Portal
      </h1>
      <p className="text-gray-700 mb-6">
        This portal allows you to view your medical reports and track your health information.
      </p>
      <div className="mt-8">
        <Link to="/reports" className="btn btn-primary">
          View Your Reports
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
