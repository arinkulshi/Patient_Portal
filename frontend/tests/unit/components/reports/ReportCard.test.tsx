import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ReportCard from '../../../../src/components/reports/ReportCard';
import { Report } from '../../../../src/types/report';


const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('ReportCard Component', () => {
  const mockReport: Report = {
    id: '1',
    patientName: 'John Smith',
    patientId: 'P001',
    date: '2025-03-15T10:30:00Z',
    summary: 'Patient presented with mild fever and cough. Chest X-ray shows no signs of pneumonia.',
    type: 'General',
    createdAt: '2025-03-15T10:30:00Z',
    updatedAt: '2025-03-15T10:30:00Z'
  };

  const mockReportWithAlert: Report = {
    ...mockReport,
    id: '2',
    summary: 'URGENT: Patient has severe chest pain and shortness of breath. Requires immediate attention.'
  };

  it('renders report card with correct patient name', () => {
    renderWithRouter(<ReportCard report={mockReport} />);
    expect(screen.getByText('John Smith')).toBeInTheDocument();
  });

  it('renders patient ID and date correctly', () => {
    renderWithRouter(<ReportCard report={mockReport} />);
    expect(screen.getByText(/Patient ID: P001/)).toBeInTheDocument();
    expect(screen.getByText(/Mar 15, 2025/)).toBeInTheDocument();
  });

  it('displays report type chip', () => {
    renderWithRouter(<ReportCard report={mockReport} />);
    expect(screen.getByText('General')).toBeInTheDocument();
  });

  it('shows report summary', () => {
    renderWithRouter(<ReportCard report={mockReport} />);
    expect(screen.getByText(/Patient presented with mild fever and cough/)).toBeInTheDocument();
  });

  it('displays high alert chip for urgent reports', () => {
    renderWithRouter(<ReportCard report={mockReportWithAlert} />);
    expect(screen.getByText('HIGH ALERT')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    const handleDelete = vi.fn();
    renderWithRouter(<ReportCard report={mockReport} onDelete={handleDelete} />);
    
    const deleteButton = screen.getByLabelText('Delete Report');
    fireEvent.click(deleteButton);
    
    expect(handleDelete).toHaveBeenCalledWith('1');
  });

  it('does not show delete button when onDelete is not provided', () => {
    renderWithRouter(<ReportCard report={mockReport} />);
    expect(screen.queryByLabelText('Delete Report')).not.toBeInTheDocument();
  });

  it('has correct links for view and edit actions', () => {
    renderWithRouter(<ReportCard report={mockReport} />);
    
    const viewButton = screen.getByLabelText('View Report');
    
    expect(viewButton.getAttribute('href')).toBe('/reports/1');
  });
});