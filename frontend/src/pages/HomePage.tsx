import React, { useEffect, useState } from 'react';
import { Typography, Grid, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import WarningIcon from '@mui/icons-material/Warning';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import ReportCard from '@/components/reports/ReportCard';
import { useReports } from '@/hooks/useReports';
import { hasHighSeverityAlerts } from '@/utils/alerts';

const HomePage: React.FC = () => {
  const { reports, loading, error, fetchReports } = useReports({
    limit: 3,
    sortBy: 'date',
    sortDirection: 'desc',
  });

  const [stats, setStats] = useState({
    totalReports: 0,
    totalPatients: 0,
    reportsWithAlerts: 0,
  });

  useEffect(() => {
    if (reports.length > 0) {
      // Calculate basic stats from the reports we have
      const patientIds = new Set(reports.map(report => report.patientId));
      const alertReports = reports.filter(report => hasHighSeverityAlerts(report));
      
      setStats({
        totalReports: reports.length,
        totalPatients: patientIds.size,
        reportsWithAlerts: alertReports.length,
      });
    }
  }, [reports]);

  return (
    <MainLayout>
      <Box className="mb-8">
        <Typography variant="h4" component="h1" className="mb-2">
          Welcome to Patient Portal
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Manage and access patient medical reports
        </Typography>
      </Box>

      {loading ? (
        <Loader text="Loading dashboard data..." />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          {/* Stats Cards */}
          <Grid container spacing={4} className="mb-8">
            <Grid item xs={12} sm={6} md={3}>
              <Card
                title="Total Reports"
                icon={<DescriptionIcon />}
                className="text-center"
              >
                <Typography variant="h3" className="my-4 font-bold text-primary-600">
                  {stats.totalReports}
                </Typography>
                <Button
                  component={Link}
                  to="/reports"
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  View All Reports
                </Button>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                title="Patients"
                icon={<PersonIcon />}
                className="text-center"
              >
                <Typography variant="h3" className="my-4 font-bold text-secondary-600">
                  {stats.totalPatients}
                </Typography>
                <Button
                  component={Link}
                  to="/reports"
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  View Patients
                </Button>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                title="Reports with Alerts"
                icon={<WarningIcon />}
                className="text-center"
                highlight={stats.reportsWithAlerts > 0 ? 'error' : 'none'}
              >
                <Typography 
                  variant="h3" 
                  className={`my-4 font-bold ${
                    stats.reportsWithAlerts > 0 ? 'text-red-600' : 'text-gray-600'
                  }`}
                >
                  {stats.reportsWithAlerts}
                </Typography>
                <Button
                  component={Link}
                  to="/reports"
                  variant={stats.reportsWithAlerts > 0 ? 'contained' : 'outlined'}
                  color={stats.reportsWithAlerts > 0 ? 'error' : 'primary'}
                  size="small"
                  fullWidth
                >
                  Review Alerts
                </Button>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                title="Report Trends"
                icon={<TrendingUpIcon />}
                className="text-center"
              >
                <Typography variant="h3" className="my-4 font-bold text-gray-600">
                  -
                </Typography>
                <Button
                  component={Link}
                  to="/reports"
                  variant="outlined"
                  size="small"
                  fullWidth
                  disabled
                >
                  View Trends
                </Button>
              </Card>
            </Grid>
          </Grid>

          {/* Recent Reports Section */}
          <Box className="mb-4 flex justify-between items-center">
            <Typography variant="h5" component="h2">
              Recent Reports
            </Typography>
            <Button component={Link} to="/reports" variant="outlined">
              View All Reports
            </Button>
          </Box>

          <Grid container spacing={3}>
            {reports.length > 0 ? (
              reports.map(report => (
                <Grid item xs={12} md={4} key={report.id}>
                  <ReportCard report={report} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography className="text-center py-8" color="textSecondary">
                  No reports found. Create your first report to get started.
                </Typography>
              </Grid>
            )}
          </Grid>

          <Box className="mt-6 text-center">
            <Button
              component={Link}
              to="/reports/new"
              variant="contained"
              color="primary"
              size="large"
            >
              Create New Report
            </Button>
          </Box>
        </>
      )}
    </MainLayout>
  );
};

export default HomePage;