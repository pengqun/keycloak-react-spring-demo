import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/toast.css';

interface LayoutProps {
  children: React.ReactNode;
}

type NavItemType = {
  text: string;
  to: string;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const auth = useAuth();
  const navigate = useNavigate();

  const navItems: NavItemType[] = [
    {
      text: '首页',
      to: '/'
    },
    {
      text: 'API 测试',
      to: '/playground'
    }
  ];

  return (
    <div className="mx-auto mt-2 px-2 max-w-screen-xl">
      <div className="navbar bg-base-100 mb-3">
        <div className="flex-1">
          <span className="font-extrabold text-3xl">React-IAM Demo</span>
          <span className="ml-2 badge badge-md">for Mobi 2.0</span>
          <ul className="menu menu-horizontal px-5 text-base">
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
                  className="mt-3 z-[1] p-2 shadow menu menu-md dropdown-content bg-base-100 rounded-box w-40"
                >
                  <li>
                    {/** See: keycloak-js - accountManagement() / createAccountUrl(options) */}
                    <a
                      onClick={() =>
                        toast.info('TODO 跳转到 Keycloak 个人中心', {
                          position: 'top-center',
                          autoClose: 1000,
                          hideProgressBar: true,
                          closeOnClick: true,
                          pauseOnHover: false,
                          draggable: false,
                          progress: undefined,
                          theme: 'light',
                          transition: Slide
                        })
                      }
                    >
                      个人信息
                    </a>
                  </li>
                  <li>
                    <a onClick={() => auth.signoutRedirect()}>登出</a>
                  </li>
                </ul>
              </div>
              <span className="font-serif text-light text-gray-500">{auth.user?.profile?.preferred_username}</span>
            </>
          ) : (
            <div className="navbar-end">
              <a className="btn w-32 font-normal">登录</a>
            </div>
          )}
        </div>
      </div>
      <div>
        <ToastContainer />
      </div>
      <div className="px-3 mb-3">{children}</div>
    </div>
  );
};

export default Layout;
