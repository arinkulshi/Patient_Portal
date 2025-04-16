import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReportFilters from '../../../../src/components/reports/ReportFilters';
import { ReportFilterParams } from '../../../../src/types/report';

describe('ReportFilters Component', () => {
  const mockFilters: ReportFilterParams = {
    patientName: '',
    patientId: '',
    type: undefined,
    fromDate: '',
    toDate: '',
    limit: 10,
    offset: 0,
    sortBy: 'date',
    sortDirection: 'desc'
  };

  const mockOnFilterChange = vi.fn();
  const mockOnReset = vi.fn();
  const mockOnApply = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default values', () => {
    render(
      <ReportFilters
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
        onApply={mockOnApply}
      />
    );

    expect(screen.getByLabelText(/Patient Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Patient ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/From Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/To Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Reset Filters/i)).toBeInTheDocument();
    expect(screen.getByText(/Apply Filters/i)).toBeInTheDocument();
  });

  it('calls onFilterChange when patient name is entered', async () => {
    render(
      <ReportFilters
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
        onApply={mockOnApply}
      />
    );

    const patientNameInput = screen.getByLabelText(/Patient Name/i);
    fireEvent.change(patientNameInput, { target: { value: 'John' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith('patientName', 'John');
  });

  it('calls onFilterChange when patient ID is entered', () => {
    render(
      <ReportFilters
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
        onApply={mockOnApply}
      />
    );

    const patientIdInput = screen.getByLabelText(/Patient ID/i);
    fireEvent.change(patientIdInput, { target: { value: 'P001' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith('patientId', 'P001');
  });

  
  it('calls onFilterChange when from date is selected', () => {
    render(
      <ReportFilters
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
        onApply={mockOnApply}
      />
    );

    const fromDateInput = screen.getByLabelText(/From Date/i);
    fireEvent.change(fromDateInput, { target: { value: '2025-03-01' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith('fromDate', '2025-03-01');
  });

  it('calls onFilterChange when to date is selected', () => {
    render(
      <ReportFilters
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
        onApply={mockOnApply}
      />
    );

    const toDateInput = screen.getByLabelText(/To Date/i);
    fireEvent.change(toDateInput, { target: { value: '2025-03-31' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith('toDate', '2025-03-31');
  });

  it('calls onReset when reset button is clicked', () => {
    render(
      <ReportFilters
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
        onApply={mockOnApply}
      />
    );

    const resetButton = screen.getByText(/Reset Filters/i);
    fireEvent.click(resetButton);

    expect(mockOnReset).toHaveBeenCalled();
  });

  it('calls onApply when apply button is clicked', () => {
    render(
      <ReportFilters
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
        onApply={mockOnApply}
      />
    );

    const applyButton = screen.getByText(/Apply Filters/i);
    fireEvent.click(applyButton);

    expect(mockOnApply).toHaveBeenCalled();
  });

  it('calls onApply automatically when patient name changes (debounced)', async () => {
    vi.useFakeTimers();
    
    render(
      <ReportFilters
        filters={{ ...mockFilters, patientName: 'initial' }}
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
        onApply={mockOnApply}
      />
    );

    const patientNameInput = screen.getByLabelText(/Patient Name/i);
    fireEvent.change(patientNameInput, { target: { value: 'John' } });

    // Fast-forward timers to trigger the debounced function
    vi.advanceTimersByTime(500);
    
    expect(mockOnApply).toHaveBeenCalled();
    
    vi.useRealTimers();
  });

  it('displays provided filter values', () => {
    const filledFilters: ReportFilterParams = {
      patientName: 'John',
      patientId: 'P001',
      type: 'Lab',
      fromDate: '2025-03-01',
      toDate: '2025-03-31',
      limit: 10,
      offset: 0
    };

    render(
      <ReportFilters
        filters={filledFilters}
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
        onApply={mockOnApply}
      />
    );

    const patientNameInput = screen.getByLabelText(/Patient Name/i) as HTMLInputElement;
    const patientIdInput = screen.getByLabelText(/Patient ID/i) as HTMLInputElement;
    const fromDateInput = screen.getByLabelText(/From Date/i) as HTMLInputElement;
    const toDateInput = screen.getByLabelText(/To Date/i) as HTMLInputElement;

    expect(patientNameInput.value).toBe('John');
    expect(patientIdInput.value).toBe('P001');
    expect(fromDateInput.value).toBe('2025-03-01');
    expect(toDateInput.value).toBe('2025-03-31');
  });
});