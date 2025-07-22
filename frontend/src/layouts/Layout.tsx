import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

type NavItemType = {
  text: string;
  to: string;
};

const { VITE_KEYCLOAK_REALM_URL, VITE_KEYCLOAK_CLIENT_ID } = import.meta.env;
const accountConsoleUrl = `${VITE_KEYCLOAK_REALM_URL}/account?referrer=${VITE_KEYCLOAK_CLIENT_ID}&referrer_uri=${window.location.origin}`;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const auth = useAuth();
  const navigate = useNavigate();

  const navItems: NavItemType[] = [
    {
      text: 'Home',
      to: '/'
    },
    {
      text: 'API Playground',
      to: '/playground'
    }
  ];

  return (
    <div className="mx-auto mt-2 px-2 max-w-screen-xl">
      <div className="navbar bg-base-100 mb-3">
        <div className="flex-1">
          <span className="font-extrabold text-3xl">Keycloak Demo</span>
          <span className="ml-2 badge badge-md">for React & Spring</span>
          <ul className="menu menu-horizontal px-3 text-base">
            {navItems.map((item) => (
              <li key={item.to}>
                <a
                  onClick={() => {
                    navigate(item.to);
                  }}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-none gap-2">
          {auth.isAuthenticated ? (
            <>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS Navbar component"
                      src={
                        auth.user?.profile?.picture ??
                        'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg'
                      }
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow menu menu-md dropdown-content bg-base-100 rounded-box w-28"
                >
                  <li>
                    <a href={accountConsoleUrl}>Profile</a>
                  </li>
                  <li>
                    <a onClick={() => auth.signoutRedirect()}>Logout</a>
                  </li>
                </ul>
              </div>
              <span className="font-serif text-light text-gray-500">{auth.user?.profile?.name}</span>
            </>
          ) : (
            <div className="navbar-end">
              <a className="btn w-32 font-normal" onClick={() => auth.signinRedirect()}>
                Login
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="px-3 mb-3">{children}</div>
    </div>
  );
};

export default Layout;
