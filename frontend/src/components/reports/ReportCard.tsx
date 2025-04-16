import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Chip, Box, IconButton, Tooltip } from '@mui/material';
import { format } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

import Card from '@/components/common/Card';
import { Report, ReportType } from '@/types/report';
import { getHighestAlertSeverity } from '@/utils/alerts';

// Map report types to colors
const typeColorMap: Record<ReportType, string> = {
  General: 'primary',
  Lab: 'secondary',
  Radiology: 'info',
  Pulmonology: 'success',
  Cardiology: 'error',
  Neurology: 'warning',
  Other: 'default'
};

interface ReportCardProps {
  report: Report;
  onDelete?: (id: string) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onDelete }) => {
  const alertSeverity = getHighestAlertSeverity(report);
  
  const cardHighlight = alertSeverity === 'high' 
    ? 'error' 
    : alertSeverity === 'medium' 
      ? 'warning' 
      : alertSeverity === 'low' 
        ? 'info' 
        : 'none';

  const formattedDate = format(new Date(report.date), 'MMM d, yyyy');
  
  return (
    <Card
      title={report.patientName}
      subtitle={`Patient ID: ${report.patientId} | ${formattedDate}`}
      highlight={cardHighlight}
      className="h-full flex flex-col"
    >
      <Box className="mb-4 flex justify-between">
        <Chip 
          label={report.type} 
          color={typeColorMap[report.type] as any}
          size="small"
          className="mr-2"
        />
        
        {alertSeverity && (
          <Chip 
            label={`${alertSeverity.toUpperCase()} ALERT`}
            color={
              alertSeverity === 'high' 
                ? 'error' 
                : alertSeverity === 'medium' 
                  ? 'warning' 
                  : 'info'
            }
            size="small"
          />
        )}
      </Box>
      
      <Typography variant="body2" className="mb-4 flex-grow line-clamp-3">
        {report.summary}
      </Typography>
      
      <Box className="flex justify-end mt-auto">
        <Tooltip title="View Report">
          <IconButton 
            component={Link} 
            to={`/reports/${report.id}`}
            size="small"
            color="primary"
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
        
      
        
        {onDelete && (
          <Tooltip title="Delete Report">
            <IconButton 
              onClick={() => onDelete(report.id)}
              size="small"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Card>
  );
};

export default ReportCard;