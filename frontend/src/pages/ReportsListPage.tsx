import React, { useEffect } from 'react';
import { Box } from '@mui/material';

import MainLayout from '@/components/layout/MainLayout';
import ReportFilters from '@/components/reports/ReportFilters';
import ReportList from '@/components/reports/ReportList';
import { useReports } from '@/hooks/useReports';
import { useReportFilters } from '@/context/ReportFilterContext';
import { ReportFilterParams } from '@/types/report';
import { Typography } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import Card from '@/components/common/Card';

const ReportsListPage: React.FC = () => {


  




  const { filters, updateFilter, resetFilters } = useReportFilters();
  const { 
    reports, 
    pagination, 
    loading, 
    error, 
    fetchReports, 
    deleteReport 
  } = useReports(filters);

  useEffect(() => {
    // Initial fetch with current filters
    fetchReports(filters);
  }, []);

  const handlePageChange = (page: number) => {
    updateFilter('offset', (page - 1) * (filters.limit || 10));
    fetchReports({
      ...filters,
      offset: (page - 1) * (filters.limit || 10)
    });
  };

  const handleLimitChange = (limit: number) => {
    updateFilter('limit', limit);
    updateFilter('offset', 0);
    fetchReports({
      ...filters,
      limit,
      offset: 0
    });
  };

  const handleFilterChange = (key: keyof ReportFilterParams, value: any) => {
    updateFilter(key, value);
  };

  const handleApplyFilters = () => {
    fetchReports(filters);
  };

  const handleResetFilters = () => {
    resetFilters();
    fetchReports({
      limit: 10,
      offset: 0,
      sortBy: 'date',
      sortDirection: 'desc'
    });
  };

  const handleDeleteReport = async (id: string) => {
    const success = await deleteReport(id);
    
    // If delete was successful and we're now showing an empty page,
    // go back to the previous page (if we're not already on the first)
    if (success && pagination && reports.length === 1 && pagination.page > 1) {
      handlePageChange(pagination.page - 1);
    }
    
    return success;
  };

  return (
    <MainLayout>

<Box className="mb-8">
  <Box className="flex flex-col md:flex-row justify-between items-start mb-6">
    <Box className="mb-4 md:mb-0">
      <Typography variant="h4" component="h1" className="mb-2">
        Welcome to Patient Portal
      </Typography>
      <Typography variant="subtitle1" color="textSecondary">
        Manage and access patient medical reports in a centralized system
      </Typography>
    </Box>
    
    <Card
      title="Total Reports"
      icon={<DescriptionIcon />}
      className="min-w-[200px] text-center"
    >
      <Typography variant="h3" className="my-4 font-bold text-primary-600">
        {pagination?.total || 0}
      </Typography>
    </Card>
  </Box>
</Box>



      <Box className="mb-8">
        <ReportFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          onApply={handleApplyFilters}
        />
        
        <ReportList
          reports={reports}
          pagination={pagination}
          loading={loading}
          error={error}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onDelete={handleDeleteReport}
        />
      </Box>
    </MainLayout>
  );
};

export default ReportsListPage;