import React, { ReactNode } from 'react';
import { 
  Card as MuiCard, 
  CardContent, 
  CardHeader, 
  CardActions,
  Typography,
  Box
} from '@mui/material';

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  highlight?: 'info' | 'success' | 'warning' | 'error' | 'none';
  className?: string;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  subtitle, 
  icon, 
  children, 
  actions,
  highlight = 'none',
  className = ''
}) => {
  const highlightClasses = {
    info: 'border-l-4 border-blue-500',
    success: 'border-l-4 border-green-500',
    warning: 'border-l-4 border-yellow-500',
    error: 'border-l-4 border-red-500',
    none: ''
  };

  return (
    <MuiCard 
      className={`shadow-md hover:shadow-lg transition-shadow ${highlightClasses[highlight]} ${className}`}
      variant="outlined"
    >
      {(title || subtitle) && (
        <CardHeader
          title={
            title && (
              <Box className="flex items-center">
                {icon && <span className="mr-2">{icon}</span>}
                <Typography variant="h6">{title}</Typography>
              </Box>
            )
          }
          subheader={subtitle && <Typography color="text.secondary">{subtitle}</Typography>}
        />
      )}
      
      <CardContent>
        {children}
      </CardContent>
      
      {actions && (
        <CardActions className="flex justify-end">
          {actions}
        </CardActions>
      )}
    </MuiCard>
  );
};

export default Card;