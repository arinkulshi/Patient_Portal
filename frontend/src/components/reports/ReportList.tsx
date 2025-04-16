import React, { useState } from 'react';
import { Grid, Typography, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

import Button from '@/components/common/Button';
import ReportCard from './ReportCard';
import Loader from '@/components/common/Loader';
import Pagination from '@/components/common/Pagination';
import { Report, Pagination as PaginationType } from '@/types/report';

interface ReportListProps {
  reports: Report[];
  pagination: PaginationType | null;
  loading: boolean;
  error: string | null;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onDelete: (id: string) => Promise<boolean>;
}

const ReportList: React.FC<ReportListProps> = ({
  reports,
  pagination,
  loading,
  error,
  onPageChange,
  onLimitChange,
  onDelete,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteClick = (id: string) => {
    setReportToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (reportToDelete) {
      setDeleteLoading(true);
      const success = await onDelete(reportToDelete);
      setDeleteLoading(false);
      
      if (success) {
        setDeleteDialogOpen(false);
        setReportToDelete(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setReportToDelete(null);
  };

  return (
    <div>
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" component="h2">
          Medical Reports
        </Typography>
        
        <Button
          component={Link}
          to="/reports/new"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          New Report
        </Button>
      </Box>

      {loading && <Loader text="Loading reports..." />}

      {error && (
        <Typography color="error" className="my-4">
          {error}
        </Typography>
      )}

      {!loading && !error && reports.length === 0 && (
        <Box className="text-center py-8">
          <Typography variant="h6" color="textSecondary">
            No reports found
          </Typography>
          <Typography color="textSecondary" className="mt-2">
            Try adjusting your filters or create a new report.
          </Typography>
        </Box>
      )}

      {!loading && !error && reports.length > 0 && (
        <>
          <Grid container spacing={3}>
            {reports.map((report) => (
              <Grid item xs={12} sm={6} md={4} key={report.id}>
                <ReportCard 
                  report={report} 
                  onDelete={handleDeleteClick} 
                />
              </Grid>
            ))}
          </Grid>

          {pagination && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              limit={pagination.limit}
              total={pagination.total}
              onPageChange={onPageChange}
              onLimitChange={onLimitChange}
            />
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this report? This action cannot be undone.
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
    </div>
  );
};

export default ReportList;