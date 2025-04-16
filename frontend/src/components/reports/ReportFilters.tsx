import React, { useEffect } from 'react';
import { Grid, Box, MenuItem, FormControl, InputLabel, Select, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';

import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';
import { ReportFilterParams, ReportType } from '@/types/report';
import { useDebounce } from '@/hooks/useDebounce';

const reportTypes: ReportType[] = [
  'General', 
  'Lab', 
  'Radiology', 
  'Pulmonology', 
  'Cardiology', 
  'Neurology', 
  'Other'
];

interface ReportFiltersProps {
  filters: ReportFilterParams;
  onFilterChange: (key: keyof ReportFilterParams, value: any) => void;
  onReset: () => void;
  onApply: () => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  onApply,
}) => {
  const debouncedPatientName = useDebounce(filters.patientName || '', 500);
  const debouncedPatientId = useDebounce(filters.patientId || '', 500);
  
  useEffect(() => {
    if (filters.patientName !== undefined) {
      onApply();
    }
  }, [debouncedPatientName, debouncedPatientId]);
  
  return (
    <Card 
      title="Search and Filter Reports" 
      icon={<FilterListIcon />}
      className="mb-6"
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Input
            label="Patient Name"
            value={filters.patientName || ''}
            onChange={(e) => onFilterChange('patientName', e.target.value)}
            placeholder="Search by patient name"
            startIcon={<SearchIcon />}
            fullWidth
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Input
            label="Patient ID"
            value={filters.patientId || ''}
            onChange={(e) => onFilterChange('patientId', e.target.value)}
            placeholder="Enter patient ID"
            fullWidth
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <Select
              labelId="report-type-label"
              id="report-type"
              value={filters.type || ''}
              label="Report Type"
              onChange={(e) => onFilterChange('type', e.target.value)}
              displayEmpty
            >
              <MenuItem value="">All Types</MenuItem>
              {reportTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="From Date"
            type="date"
            value={filters.fromDate || ''}
            onChange={(e) => onFilterChange('fromDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="To Date"
            type="date"
            value={filters.toDate || ''}
            onChange={(e) => onFilterChange('toDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
      </Grid>
      
      <Box className="flex justify-end mt-4">
        <Button 
          variant="outlined" 
          onClick={onReset}
          startIcon={<ClearIcon />}
          className="mr-2"
        >
          Reset Filters
        </Button>
        
        <Button 
          variant="contained" 
          onClick={onApply}
          startIcon={<FilterListIcon />}
        >
          Apply Filters
        </Button>
      </Box>
    </Card>
  );
};

export default ReportFilters;