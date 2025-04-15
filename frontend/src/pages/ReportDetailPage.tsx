import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="card">
      <h1 className="text-3xl font-bold text-primary mb-4">
        Report Details
      </h1>
      <p className="text-gray-700 mb-4">
        Viewing details for report ID: {id}
      </p>
      <Link to="/reports" className="text-primary hover:underline">
        &larr; Back to Reports
      </Link>
    </div>
  );
};
export default ReportDetailPage;
