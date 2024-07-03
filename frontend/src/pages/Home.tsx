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
        After login successfully, use{' '}
        <span className="bg-gray-200 text-sm font-mono px-2 py-1 rounded">const auth = useAuth()</span> to obtain the{' '}
        <span className="bg-gray-200 text-sm font-mono px-2 py-1 rounded">AuthContextProps</span>, which includes:
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
                  <th>Field Name</th>
                  <th>Current Value</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>user</td>
                  <td>{JSON.stringify(auth.user).substring(0, 30) + '...'}</td>
                  <td>
                    Profile of the autenticated user, see{' '}
                    <a
                      className="underline"
                      href="https://authts.github.io/oidc-client-ts/classes/User.html"
                      target="_blank"
                    >
                      User | oidc-client
                    </a>{' '}
                    for more details.
                  </td>
                </tr>
                <tr>
                  <td>settings</td>
                  <td>{JSON.stringify(auth.settings).substring(0, 30) + '...'}</td>
                  <td>
                    Configuration of you OIDC client, see{' '}
                    <a
                      className="underline"
                      href="https://authts.github.io/oidc-client-ts/interfaces/UserManagerSettings.html"
                      target="_blank"
                    >
                      UserManagerSettings | oidc-client
                    </a>{' '}
                    for more details.
                  </td>
                </tr>
                <tr>
                  <td>isLoading</td>
                  <td>{String(auth.isLoading)}</td>
                  <td>True when the library has been initialized and no navigator request is in progress.</td>
                </tr>
                <tr>
                  <td>isAuthenticated</td>
                  <td>{String(auth.isAuthenticated)}</td>
                  <td>True while the user has a valid access token.</td>
                </tr>
                <tr>
                  <td>activeNavigator</td>
                  <td>{auth.activeNavigator || 'null'}</td>
                  <td>Tracks the status of most recent signin/signout request method (may be null).</td>
                </tr>
                <tr>
                  <td>error</td>
                  <td>{JSON.stringify(auth.error) || 'null'}</td>
                  <td>Signin or silent renew error (null if everything goes right).</td>
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
