import React from 'react';
import { Pagination as MuiPagination, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface PaginationProps {
  page: number;
  totalPages: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  limitOptions?: number[];
  showTotalCount?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  limit,
  total,
  onPageChange,
  onLimitChange,
  limitOptions = [10, 25, 50, 100],
  showTotalCount = true,
}) => {
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  const handleLimitChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onLimitChange(event.target.value as number);
  };

  return (
    <Box className="flex flex-col sm:flex-row justify-between items-center mt-4 py-2">
      <Box className="mb-4 sm:mb-0">
        {showTotalCount && (
          <span className="text-gray-600">
            Showing {Math.min(total, (page - 1) * limit + 1)} - {Math.min(total, page * limit)} of {total} results
          </span>
        )}
      </Box>

      <Box className="flex items-center">
        <FormControl size="small" variant="outlined" className="mr-4 min-w-[100px]">
          <InputLabel id="results-per-page-label">Per Page</InputLabel>
          <Select
            labelId="results-per-page-label"
            value={limit}
            onChange={handleLimitChange}
            label="Per Page"
          >
            {limitOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <MuiPagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
          size="medium"
        />
      </Box>
    </Box>
  );
};

export default Pagination;