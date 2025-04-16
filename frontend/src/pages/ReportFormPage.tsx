import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

import MainLayout from '@/components/layout/MainLayout';
import ReportForm from '@/components/reports/ReportForm';
import Loader from '@/components/common/Loader';
import { useReport } from '@/hooks/useReport';

const ReportFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isEditing = location.pathname.includes('/edit');
  
  const {
    report,
    loading,
    error,
    createReport,
    updateReport
  } = useReport(isEditing ? id : undefined);

  if (isEditing && loading) {
    return (
      <MainLayout>
        <Loader text="Loading report data..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ReportForm
        initialData={report}
        isEditing={isEditing}
        onSubmit={isEditing && id ? (data) => updateReport(id, data) : createReport}
        isLoading={loading}
        error={error}
      />
    </MainLayout>
  );
};

export default ReportFormPage;