import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useReports } from '../../../src/hooks/useReports';
import { reportService } from '../../../src/api/reports';
import { mockReports } from '../../mocks/report';


vi.mock('@/api/reports', () => ({
  reportService: {
    getReports: vi.fn(),
    deleteReport: vi.fn()
  }
}));

describe('useReports Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch reports on initial render', async () => {
    const mockResponse = {
      data: mockReports.slice(0, 2),
      total: mockReports.length,
      page: 1,
      limit: 10,
      totalPages: 1
    };

    (reportService.getReports as vi.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useReports());

 
    expect(result.current.loading).toBe(true);
    expect(result.current.reports).toEqual([]);
    expect(result.current.pagination).toBeNull();
    expect(result.current.error).toBeNull();


    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.reports).toEqual(mockReports.slice(0, 2));
    expect(result.current.pagination).toEqual({
      total: mockReports.length,
      page: 1,
      limit: 10,
      totalPages: 1
    });
    expect(result.current.error).toBeNull();

    // Verify the service was called
    expect(reportService.getReports).toHaveBeenCalledTimes(1);
  });

  it('should apply initial filters when provided', async () => {
    const mockResponse = {
      data: [mockReports[0]],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1
    };

    (reportService.getReports as vi.Mock).mockResolvedValue(mockResponse);

    const initialFilters = {
      patientName: 'John',
      limit: 10,
      offset: 0
    };

    const { result } = renderHook(() => useReports(initialFilters));

    // Wait for the fetch to complete
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Verify the service was called with the correct filters
    expect(reportService.getReports).toHaveBeenCalledWith(initialFilters);
  });

  it('should fetch reports when fetchReports is called with new filters', async () => {
    const initialResponse = {
      data: mockReports.slice(0, 2),
      total: mockReports.length,
      page: 1,
      limit: 10,
      totalPages: 1
    };

    const filteredResponse = {
      data: [mockReports[0]],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1
    };

    (reportService.getReports as vi.Mock)
      .mockResolvedValueOnce(initialResponse)
      .mockResolvedValueOnce(filteredResponse);

    const { result } = renderHook(() => useReports());

    // Wait for initial fetch to complete
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Call fetchReports with new filters
    const newFilters = { patientName: 'John' };
    
    act(() => {
      result.current.fetchReports(newFilters);
    });

    // Should be in loading state again
    expect(result.current.loading).toBe(true);

    // Wait for the second fetch to complete
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Check that the filtered data was loaded
    expect(result.current.reports).toEqual([mockReports[0]]);
    expect(result.current.pagination).toEqual({
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1
    });

    // Verify service was called with correct filters
    expect(reportService.getReports).toHaveBeenCalledTimes(2);
    expect(reportService.getReports).toHaveBeenLastCalledWith(newFilters);
  });

  it('should handle errors when fetching reports', async () => {
    const errorMessage = 'Failed to fetch reports';
    (reportService.getReports as vi.Mock).mockRejectedValue({
      response: {
        data: {
          error: {
            message: errorMessage
          }
        }
      }
    });

    const { result } = renderHook(() => useReports());

    // Wait for the fetch to complete with error
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Check that the error was set correctly
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.reports).toEqual([]);
    expect(result.current.pagination).toBeNull();
  });

  it('should delete a report and update the list', async () => {
    const initialReports = mockReports.slice(0, 3);
    const mockResponse = {
      data: initialReports,
      total: initialReports.length,
      page: 1,
      limit: 10,
      totalPages: 1
    };

    (reportService.getReports as vi.Mock).mockResolvedValue(mockResponse);
    (reportService.deleteReport as vi.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useReports());

    // Wait for initial fetch to complete
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Delete the first report
    const reportIdToDelete = initialReports[0].id;
    let deleteResult;

    await act(async () => {
      deleteResult = await result.current.deleteReport(reportIdToDelete);
    });

    // Check that the delete was successful
    expect(deleteResult).toBe(true);
    
    // Check that the report was removed from the list
    expect(result.current.reports).toHaveLength(initialReports.length - 1);
    expect(result.current.reports.find(r => r.id === reportIdToDelete)).toBeUndefined();

    // Verify delete service was called
    expect(reportService.deleteReport).toHaveBeenCalledWith(reportIdToDelete);
  });

  it('should handle errors when deleting a report', async () => {
    const initialReports = mockReports.slice(0, 3);
    const mockResponse = {
      data: initialReports,
      total: initialReports.length,
      page: 1,
      limit: 10,
      totalPages: 1
    };

    const errorMessage = 'Failed to delete report';
    (reportService.getReports as vi.Mock).mockResolvedValue(mockResponse);
    (reportService.deleteReport as vi.Mock).mockRejectedValue({
      response: {
        data: {
          error: {
            message: errorMessage
          }
        }
      }
    });

    const { result } = renderHook(() => useReports());

    // Wait for initial fetch to complete
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Try to delete a report
    const reportIdToDelete = initialReports[0].id;
    let deleteResult;

    await act(async () => {
      deleteResult = await result.current.deleteReport(reportIdToDelete);
    });

    // Check that the delete failed
    expect(deleteResult).toBe(false);
    
    // Check that the reports list is unchanged
    expect(result.current.reports).toHaveLength(initialReports.length);
    
    // Check that the error was set
    expect(result.current.error).toBe(errorMessage);
  });
});