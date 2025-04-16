import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

import MainLayout from '@/components/layout/MainLayout';
import ReportDetails from '@/components/reports/ReportDetails';
import Loader from '@/components/common/Loader';
import Button from '@/components/common/Button';
import { useReport } from '@/hooks/useReport';

const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { report, loading, error} = useReport(id);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (id) {
      setDeleteLoading(true);
      try {
        // Delete the report using the API
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/reports/${id}`, {
          method: 'DELETE',
        });
        setDeleteLoading(false);
        setDeleteDialogOpen(false);
        
        // Navigate back to reports list
        navigate('/reports');
      } catch (error) {
        console.error('Error deleting report:', error);
        setDeleteLoading(false);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  

  
  if (loading) {
    return (
      <MainLayout>
        <Loader text="Loading report details..." />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Typography color="error" className="my-4">
          {error}
        </Typography>
        <Button variant="contained" onClick={() => navigate('/reports')}>
          Back to Reports
        </Button>
      </MainLayout>
    );
  }

  if (!report) {
    return (
      <MainLayout>
        <Typography variant="h5" className="mb-4">
          Report not found
        </Typography>
        <Button variant="contained" onClick={() => navigate('/reports')}>
          Back to Reports
        </Button>
      </MainLayout>
    );
  }
  

  return (
    <MainLayout>
      <ReportDetails report={report} onDelete={handleDeleteClick} />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this report for {report.patientName}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            loading={deleteLoading}
            loadingText="Deleting..."
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default ReportDetailPage;