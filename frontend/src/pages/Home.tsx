import { useState } from 'react';
import { useAuth } from 'react-oidc-context';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';

const Home = () => {
  const auth = useAuth();
  const [selectedTab, setSelectedTab] = useState('tab1');

  return (
    <div>
      <h1 className="text-xl font-semibold mt-5">AuthContextProps</h1>
      <p className="py-6 mb-3">
        登录成功后，使用 <span className="bg-gray-200 text-sm font-mono px-2 py-1 rounded">const auth = useAuth()</span>{' '}
        获取认证相关上下文：
      </p>
      <div role="tablist" className="tabs tabs-lifted">
        <input
          type="radio"
          name="my_tabs"
          role="tab"
          aria-label="auth"
          checked={selectedTab === 'tab1'}
          className={`tab ${selectedTab === 'tab1' ? 'text-base font-medium' : ''}`}
          onChange={() => setSelectedTab('tab1')}
        />
        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
          <div className="overflow-x-auto">
            <table className="table text-base">
              <thead>
                <tr>
                  <th>字段名</th>
                  <th>当前值</th>
                  <th>含义</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>user</td>
                  <td>{JSON.stringify(auth.user).substring(0, 30) + '...'}</td>
                  <td>
                    用户信息，字段含义请参考：
                    <a
                      className="underline"
                      href="https://authts.github.io/oidc-client-ts/classes/User.html"
                      target="_blank"
                    >
                      User | oidc-client 接口文档
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>settings</td>
                  <td>{JSON.stringify(auth.settings).substring(0, 30) + '...'}</td>
                  <td>
                    认证配置，字段含义请参考：
                    <a
                      className="underline"
                      href="https://authts.github.io/oidc-client-ts/interfaces/UserManagerSettings.html"
                      target="_blank"
                    >
                      UserManagerSettings | oidc-client 接口文档
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>isLoading</td>
                  <td>{String(auth.isLoading)}</td>
                  <td>当库已初始化，且没有正在进行的导航请求时，值为 true</td>
                </tr>
                <tr>
                  <td>isAuthenticated</td>
                  <td>{String(auth.isAuthenticated)}</td>
                  <td>当用户拥有有效的访问令牌 (Access Token) 时, 值为 true</td>
                </tr>
                <tr>
                  <td>activeNavigator</td>
                  <td>{auth.activeNavigator || 'null'}</td>
                  <td>跟踪最近一次登录/登出请求方法的状态（可能为空）</td>
                </tr>
                <tr>
                  <td>error</td>
                  <td>{JSON.stringify(auth.error) || 'null'}</td>
                  <td>如果存在登录或静默续订 (silent renew) 错误，则不为空</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <input
          type="radio"
          name="my_tabs"
          role="tab"
          aria-label="auth.user"
          checked={selectedTab === 'tab2'}
          className={`tab ${selectedTab === 'tab2' ? 'text-base font-medium' : ''}`}
          onChange={() => setSelectedTab('tab2')}
        />
        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
          <JsonView src={auth.user} theme="vscode" />
        </div>

        <input
          type="radio"
          name="my_tabs"
          role="tab"
          aria-label="auth.settings"
          checked={selectedTab === 'tab3'}
          className={`tab ${selectedTab === 'tab3' ? 'text-base font-medium' : ''}`}
          onChange={() => setSelectedTab('tab3')}
        />
        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
          <JsonView src={auth.settings} theme="vscode" />
        </div>
      </div>
    </div>
  );
};

export default Home;
