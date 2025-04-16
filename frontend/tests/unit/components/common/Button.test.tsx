import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import Button from '../../../../src/components/common/Button';

describe('Button Component', () => {
  it('renders correctly with children', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('shows loading spinner when loading is true', () => {
    render(<Button loading={true}>Test Button</Button>);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows loading text when provided and loading is true', () => {
    render(
      <Button loading={true} loadingText="Loading...">
        Test Button
      </Button>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Test Button')).not.toBeInTheDocument();
  });

  it('is disabled when loading is true', () => {
    render(<Button loading={true}>Test Button</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled={true}>Test Button</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies variant prop correctly', () => {
    render(<Button variant="contained">Test Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('MuiButton-contained');
  });

  it('applies color prop correctly', () => {
    render(<Button color="error">Test Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('MuiButton-colorError');
  });
});