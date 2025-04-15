import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="card text-center">
      <h1 className="text-3xl font-bold text-primary mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-gray-700 mb-6">
        The page you are looking for does not exist.
      </p>
      <div className="mt-8">
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;