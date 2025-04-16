import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Button as MuiButton,
  SelectChangeEvent
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate } from 'react-router-dom';

import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { Report, ReportType, CreateReportParams, UpdateReportParams } from '@/types/report';

const reportTypes: ReportType[] = [
  'General', 
  'Lab', 
  'Radiology', 
  'Pulmonology', 
  'Cardiology', 
  'Neurology', 
  'Other'
];

interface ReportFormProps {
  initialData?: Report;
  isEditing: boolean;
  onSubmit: (data: CreateReportParams | UpdateReportParams) => Promise<Report | null>;
  isLoading: boolean;
  error: string | null;
}

const ReportForm: React.FC<ReportFormProps> = ({
  initialData,
  isEditing,
  onSubmit,
  isLoading,
  error
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateReportParams | UpdateReportParams>({
    patientName: '',
    patientId: '',
    summary: '',
    type: 'General',
    date: new Date().toISOString().split('T')[0]
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        patientName: initialData.patientName,
        patientId: initialData.patientId,
        summary: initialData.summary,
        type: initialData.type,
        date: new Date(initialData.date).toISOString().split('T')[0]
      });
    }
  }, [initialData, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: value
      });
      
      // Clear validation error when field is changed
      if (validationErrors[name]) {
        setValidationErrors({
          ...validationErrors,
          [name]: ''
        });
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.patientName || formData.patientName.trim().length < 2) {
      errors.patientName = 'Patient name is required and must be at least 2 characters';
    }
    
    if (!formData.patientId || formData.patientId.trim() === '') {
      errors.patientId = 'Patient ID is required';
    }
    
    if (!formData.summary || formData.summary.trim() === '') {
      errors.summary = 'Report summary is required';
    }
    
    if (!formData.date) {
      errors.date = 'Date is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const result = await onSubmit(formData);
      if (result) {
        // Redirect to the report detail page after successful submission
        navigate(`/reports/${result.id}`);
      }
    }
  };
  const handleSelectChange = (
    event: SelectChangeEvent<ReportType>, // this makes it type-safe
    _: React.ReactNode // the second arg is not used
  ) => {
    const { name, value } = event.target;
  
    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: value as ReportType
      }));
  
      if (validationErrors[name]) {
        setValidationErrors({
          ...validationErrors,
          [name]: ''
        });
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box className="flex items-center mb-4">
        <Button
          component={Link}
          to={isEditing && initialData ? `/reports/${initialData.id}` : '/reports'}
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          className="mr-4"
        >
          {isEditing ? 'Cancel Edit' : 'Back to Reports'}
        </Button>
        
        <Typography variant="h5" component="h1">
          {isEditing ? 'Edit Medical Report' : 'Create New Medical Report'}
        </Typography>
      </Box>

      <Card className="mb-6">
        {error && (
          <Box className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            <Typography>{error}</Typography>
          </Box>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Patient Name"
              name="patientName"
              value={formData.patientName || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!validationErrors.patientName}
              helperText={validationErrors.patientName}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Patient ID"
              name="patientId"
              value={formData.patientId || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!validationErrors.patientId}
              helperText={validationErrors.patientId}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel id="report-type-label">Report Type</InputLabel>
              <Select
  labelId="report-type-label"
  name="type"
  value={formData.type || 'General'}
  label="Report Type"
  onChange={handleSelectChange}
>
  {reportTypes.map((type) => (
    <MenuItem key={type} value={type}>{type}</MenuItem>
  ))}
</Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Report Date"
              name="date"
              type="date"
              value={formData.date || ''}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
              error={!!validationErrors.date}
              helperText={validationErrors.date}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Report Summary"
              name="summary"
              value={formData.summary || ''}
              onChange={handleChange}
              multiline
              rows={6}
              fullWidth
              required
              error={!!validationErrors.summary}
              helperText={validationErrors.summary}
            />
          </Grid>
        </Grid>
        
        <Box className="flex justify-end mt-4">
          <MuiButton 
            component={Link} 
            to={isEditing && initialData ? `/reports/${initialData.id}` : '/reports'}
            className="mr-2"
          >
            Cancel
          </MuiButton>
          
          <Button 
            type="submit"
            variant="contained" 
            color="primary"
            startIcon={<SaveIcon />}
            loading={isLoading}
            loadingText={isEditing ? "Updating..." : "Creating..."}
          >
            {isEditing ? 'Update Report' : 'Create Report'}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default ReportForm;