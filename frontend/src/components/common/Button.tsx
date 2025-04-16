import React from 'react';
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
} from '@mui/material';
import { LinkProps } from 'react-router-dom';

type ExtendedButtonProps = MuiButtonProps & Partial<LinkProps> & {
  loading?: boolean;
  loadingText?: string;
};

const Button: React.FC<ExtendedButtonProps> = ({
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
