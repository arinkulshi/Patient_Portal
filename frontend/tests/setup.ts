import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';

// Extend Vi matchers
declare global {
  namespace Vi {
    interface Assertion {
      toBeInTheDocument(): void;
      toHaveTextContent(text: string): void;
      toBeVisible(): void;
      toHaveClass(className: string): void;
    }
  }
}

// Polyfill for window.fetch during tests
import 'whatwg-fetch';

// Setup MSW
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());

// Mock environment variables
vi.mock('@/api/client', async () => {
  const actual = await vi.importActual('@/api/client');
  return {
    ...actual,
    apiClient: {
      ...actual.apiClient,
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    },
  };
});

// Mock console error for cleaner test output
const originalConsoleError = console.error;
console.error = (...args) => {
  // Don't show React error boundaries or prop type errors during tests
  if (
    /React does not recognize the .* prop on a DOM element/.test(args[0]) ||
    /Warning: React.createElement:/.test(args[0]) ||
    /Warning: Invalid prop/.test(args[0])
  ) {
    return;
  }
  originalConsoleError(...args);
};