import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Playground from './pages/Playground';
import NotFound from './pages/NotFound';
import { useEffect, useState } from 'react';
import { hasAuthParams, useAuth } from 'react-oidc-context';

const App = () => {
  const auth = useAuth();
  const [hasTriedSignin, setHasTriedSignin] = useState(false);

  /**
   * Automatic sign-in
   *
   * See {@link https://github.com/authts/react-oidc-context?tab=readme-ov-file#automatic-sign-in}
   */
  useEffect(() => {
    if (!hasAuthParams() && !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading && !hasTriedSignin) {
      auth.signinRedirect();
      setHasTriedSignin(true);
    }
  }, [auth, hasTriedSignin]);

  if (auth.isLoading) {
    return (
      <div className="flex justify-center items-center h-24 mt-48">
        <span className="loading loading-spinner loading-lg"></span>
        <span className="ml-8 text-lg font-medium">
          Loading... (it may take a while for the first time, just have some coffee~ ☕️)
        </span>
      </div>
    );
  }

  if (auth.error || !auth.isAuthenticated) {
    return (
      <div role="alert" className="alert alert-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {auth.error ? (
          <span>😬 Ops, login error: {auth.error.message} (checkout Keycloak status and configuration)</span>
        ) : (
          <span>🤔 You're still not authenticated, and I don't know why... Maybe you can find out! </span>
        )}
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/">
        <Route index element={<Home />}></Route>
        <Route path="/playground" element={<Playground />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Route>
    </Routes>
  );
};

// const ProtectedApp = withAuthenticationRequired(App, {
//   OnRedirecting: () => <div>Redirecting to the login page...</div>
// });
// export default ProtectedApp;

export default App;
