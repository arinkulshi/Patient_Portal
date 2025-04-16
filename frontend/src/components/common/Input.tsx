import React, { forwardRef } from 'react';
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  FormHelperText,
  FormControl
} from '@mui/material';

interface InputProps extends Omit<TextFieldProps, 'variant'> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  helperText?: string;
  errorText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    startIcon, 
    endIcon, 
    helperText, 
    errorText, 
    error,
    fullWidth = true,
    size = 'medium',
    ...props 
  }, ref) => {
    return (
      <FormControl fullWidth={fullWidth} error={error}>
        <TextField
          {...props}
          ref={ref}
          variant="outlined"
          size={size}
          error={error || !!errorText}
          InputProps={{
            ...props.InputProps,
            startAdornment: startIcon ? (
              <InputAdornment position="start">{startIcon}</InputAdornment>
            ) : undefined,
            endAdornment: endIcon ? (
              <InputAdornment position="end">{endIcon}</InputAdornment>
            ) : undefined,
          }}
        />
        {(helperText || errorText) && (
          <FormHelperText error={!!errorText}>
            {errorText || helperText}
          </FormHelperText>
        )}
      </FormControl>
    );
  }
);

Input.displayName = 'Input';

export default Input;