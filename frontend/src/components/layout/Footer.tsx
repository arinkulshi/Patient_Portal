import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box 
      component="footer" 
      className="px-4 py-6 mt-auto bg-gray-100 border-t"
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Typography variant="body2" color="text.secondary">
            &copy; {currentYear} Patient Portal
          </Typography>
          
          <Box className="flex mt-4 md:mt-0">
            <Link href="#" underline="hover" className="mx-2 text-gray-600 hover:text-primary-600">
              Privacy Policy
            </Link>
            <Link href="#" underline="hover" className="mx-2 text-gray-600 hover:text-primary-600">
              Terms of Service
            </Link>
            <Link href="#" underline="hover" className="mx-2 text-gray-600 hover:text-primary-600">
              Support
            </Link>
          </Box>
        </div>
      </div>
    </Box>
  );
};

export default Footer;