import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.css';
import App from './App';
import { Log, UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from 'react-oidc-context';
import Layout from './layouts/Layout';

const userManager = new UserManager({
  authority: import.meta.env.VITE_KEYCLOAK_BASE_URL,
  client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  redirect_uri: `${window.location.origin}${window.location.pathname}`,
  post_logout_redirect_uri: window.location.origin,
  scope: 'openid profile',
  // extraQueryParams: {'kc_idp_hint': 'aliyun'},
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
  // userStore: new WebStorageStateStore({ store: window.localStorage }),
  monitorSession: true, // this allows cross tab login/logout detection
  automaticSilentRenew: true
});

const onSigninCallback = () => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

Log.setLogger(console);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter basename="/">
      <AuthProvider userManager={userManager} onSigninCallback={onSigninCallback}>
        <QueryClientProvider client={queryClient}>
          <Layout>
            <App />
          </Layout>
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
