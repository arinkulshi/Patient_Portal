import React, { ReactNode } from 'react';
import { Container, Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  maxWidth = 'lg' 
}) => {
  return (
    <Box className="flex flex-col min-h-screen">
      <Header />
      
      <Container 
        maxWidth={maxWidth} 
        component="main" 
        className="flex-grow py-8"
      >
        {children}
      </Container>
      
      <Footer />
    </Box>
  );
};

export default MainLayout;