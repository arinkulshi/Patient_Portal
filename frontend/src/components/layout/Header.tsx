import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Header: React.FC = () => {
  const appName = import.meta.env.VITE_APP_NAME || 'Patient Portal';

  return (
    <AppBar position="static" className="bg-primary-600">
      <Toolbar>
        <Typography variant="h6" component="div" className="flex items-center mr-4">
          <svg 
            className="w-8 h-8 mr-2" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 2L4 6V18L12 22L20 18V6L12 2Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="transparent"
            />
            <path 
              d="M12 7V17M7 12H17" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
          {appName}
        </Typography>
        
        <Box className="flex-grow">
        
          
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;