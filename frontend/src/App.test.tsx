import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './App';
import { MemoryRouter } from 'react-router-dom';
import { type AuthContextProps } from 'react-oidc-context';

const mockAuth: Partial<AuthContextProps> = {
  isLoading: false,
  isAuthenticated: true,
  activeNavigator: undefined,
  error: undefined,
  signinRedirect: vi.fn(),
  user: {
    profile: { sub: '123', name: 'Test User' },
    access_token: 'mock-token',
    token_type: 'Bearer',
    expired: false,
    expires_in: 300,
    scopes: ['openid', 'profile'],
    toStorageString: () => '{}'
  } as unknown as AuthContextProps['user'],
  settings: {
    authority: 'http://localhost:8080/realms/myrealm',
    client_id: 'react-client-dev',
    redirect_uri: 'http://localhost:3000'
  } as unknown as AuthContextProps['settings']
};

vi.mock('react-oidc-context', () => ({
  useAuth: () => mockAuth,
  hasAuthParams: () => false
}));

describe('App', () => {
  it('renders Home page when authenticated', () => {
    mockAuth.isAuthenticated = true;
    mockAuth.isLoading = false;
    mockAuth.error = undefined;

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getAllByText(/AuthContextProps/i).length).toBeGreaterThan(0);
  });

  it('shows loading spinner when auth is loading', () => {
    mockAuth.isLoading = true;
    mockAuth.isAuthenticated = false;

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('shows error message when authentication fails', () => {
    mockAuth.isLoading = false;
    mockAuth.isAuthenticated = false;
    mockAuth.error = new Error('Connection refused');

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/Connection refused/i)).toBeInTheDocument();
  });

  it('shows message when not authenticated and no error', () => {
    mockAuth.isLoading = false;
    mockAuth.isAuthenticated = false;
    mockAuth.error = undefined;

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/not authenticated/i)).toBeInTheDocument();
  });

  it('renders NotFound for unknown routes when authenticated', () => {
    mockAuth.isAuthenticated = true;
    mockAuth.isLoading = false;
    mockAuth.error = undefined;

    render(
      <MemoryRouter initialEntries={['/nonexistent']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/no page linked/i)).toBeInTheDocument();
  });
});
