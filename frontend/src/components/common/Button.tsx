import React from 'react';
import { 
  Button as MuiButton, 
  ButtonProps as MuiButtonProps,
  CircularProgress
} from '@mui/material';

interface ButtonProps extends MuiButtonProps {
  loading?: boolean;
  loadingText?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  loading = false, 
  loadingText,
  disabled,
  startIcon,
  ...props 
}) => {
  return (
    <MuiButton
      {...props}
      disabled={loading || disabled}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : startIcon}
    >
      {loading && loadingText ? loadingText : children}
    </MuiButton>
  );
};

export default Button;