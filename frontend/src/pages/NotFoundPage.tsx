import React from 'react';
import { Box, Typography, Button as MuiButton } from '@mui/material';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';

const NotFoundPage: React.FC = () => {
  return (
    <MainLayout>
      <Box className="flex flex-col items-center justify-center py-16">
        <Typography variant="h1" className="text-gray-400 text-9xl font-bold mb-4">
          404
        </Typography>
        
        <Typography variant="h4" className="mb-6 text-center">
          Oops! Page Not Found
        </Typography>
        
        <Typography variant="body1" className="mb-8 text-center max-w-md text-gray-600">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
        
        <MuiButton
          component={Link}
          to="/"
          variant="contained"
          color="primary"
          size="large"
        >
          Back to Home
        </MuiButton>
      </Box>
    </MainLayout>
  );
};

export default NotFoundPage;