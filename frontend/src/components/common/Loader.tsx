import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

interface LoaderProps {
  size?: number;
  text?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 40, 
  text, 
  fullScreen = false 
}) => {
  if (fullScreen) {
    return (
      <Box className="flex flex-col items-center justify-center fixed inset-0 bg-white bg-opacity-80 z-50">
        <CircularProgress size={size} color="primary" />
        {text && (
          <Typography className="mt-4 text-gray-700" variant="body1">
            {text}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box className="flex flex-col items-center justify-center py-8">
      <CircularProgress size={size} color="primary" />
      {text && (
        <Typography className="mt-4 text-gray-700" variant="body1">
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default Loader;