import React from 'react';
import { Typography, Box, Chip, Paper, Grid, Divider, IconButton, Tooltip } from '@mui/material';
import { format } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';

import Button from '@/components/common/Button';
import { Report } from '@/types/report';
import { detectMedicalAlerts, AlertInfo } from '@/utils/alerts';

interface ReportDetailsProps {
  report: Report;
  onDelete?: (id: string) => void;
}

const ReportDetails: React.FC<ReportDetailsProps> = ({ report, onDelete }) => {
  const alerts = detectMedicalAlerts(report);
  const reportDate = format(new Date(report.date), 'MMMM d, yyyy');
  const createdAt = format(new Date(report.createdAt), 'MMM d, yyyy h:mm a');
  const updatedAt = format(new Date(report.updatedAt), 'MMM d, yyyy h:mm a');

  return (
    <Box>
      <Box className="flex items-center mb-4">
        <Button
          component={Link}
          to="/reports"
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          className="mr-4"
        >
          Back to Reports
        </Button>
        
        <Typography variant="h5" component="h1" className="flex-grow">
          Medical Report Details
        </Typography>
        
        <Box>
          <Tooltip title="Edit Report">
            <IconButton 
              component={Link} 
              to={`/reports/${report.id}/edit`}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          
          {onDelete && (
            <Tooltip title="Delete Report">
              <IconButton 
                onClick={() => onDelete(report.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Alert Messages */}
      {alerts.length > 0 && (
        <Box className="mb-4">
          {alerts.map((alert: AlertInfo, index: number) => (
            <Box
              key={index}
              className={`p-3 rounded mb-2 ${
                alert.severity === 'high'
                  ? 'bg-red-100 border-l-4 border-red-500'
                  : alert.severity === 'medium'
                  ? 'bg-yellow-100 border-l-4 border-yellow-500'
                  : 'bg-blue-100 border-l-4 border-blue-500'
              }`}
            >
              <Typography variant="subtitle2" className="font-bold">
                {alert.message}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      <Paper className="p-6 mb-6 shadow-md">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Patient Name
            </Typography>
            <Typography variant="h6" className="mb-4">
              {report.patientName}
            </Typography>
            
            <Typography variant="subtitle2" color="textSecondary">
              Patient ID
            </Typography>
            <Typography variant="body1" className="mb-4">
              {report.patientId}
            </Typography>
            
            <Typography variant="subtitle2" color="textSecondary">
              Report Types
            </Typography>
            <Chip 
              label={report.type} 
              color="primary" 
              className="mt-1"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Report Date
            </Typography>
            <Typography variant="body1" className="mb-4">
              {reportDate}
            </Typography>
            
            <Typography variant="subtitle2" color="textSecondary">
              Created
            </Typography>
            <Typography variant="body1" className="mb-4">
              {createdAt}
            </Typography>
            
            <Typography variant="subtitle2" color="textSecondary">
              Last Updated
            </Typography>
            <Typography variant="body1">
              {updatedAt}
            </Typography>
          </Grid>
        </Grid>
        
        <Divider className="my-4" />
        
        <Typography variant="subtitle1" className="font-bold mb-2">
          Report Summary
        </Typography>
        <Typography variant="body1" className="whitespace-pre-line">
          {report.summary}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ReportDetails;