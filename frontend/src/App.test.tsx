import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders hello world', () => {
  render(<App />);
  const element = screen.getByText(/Hello World!/i);
  expect(element).toBeInTheDocument();
});
