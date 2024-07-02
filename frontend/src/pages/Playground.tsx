import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import JsonView from 'react18-json-view';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/toast.css';

const API_PATH_PREFIX = import.meta.env.DEV ? 'api' : import.meta.env.VITE_BACKEND_BASE_URL;
console.debug("Set API path prefix to '" + API_PATH_PREFIX + "'");

const PRIVATE_PATH = '/hello/private';
const PUBLIC_PATH = '/hello/public';

const Playground = () => {
  const auth = useAuth();
  const initalialAccessToken = auth.user?.access_token ?? '';

  const [apiPath, setApiPath] = useState(PRIVATE_PATH);

  const [accessToken, setAccessToken] = useState(initalialAccessToken);
  const accessTokenRef = useRef(initalialAccessToken);

  const [isAttachToken, setIsAttachToken] = useState(true);

  useEffect(() => {
    const newToken = auth.user?.access_token ?? '';
    if (accessTokenRef.current !== newToken) {
      setAccessToken(newToken);
      accessTokenRef.current = newToken;

      toast.clearWaitingQueue();
      toast.info('Renewed access token', {
        position: 'top-right',
        autoClose: 500,
        hideProgressBar: true,
        theme: 'light',
        transition: Slide
      });
      console.debug('Renewed access token: ' + auth.user?.access_token);
    }
  }, [auth.user?.access_token]);

  const queryFn = async () => {
    const headers: Record<string, string> = isAttachToken ? { authorization: `Bearer ${accessToken}` } : {};
    const response = await fetch(API_PATH_PREFIX + apiPath, { headers: headers });
    console.debug(`Querying API '${apiPath}' with token: ${accessToken}`);

    if (!response.ok) {
      throw new Error(
        `Failed to query API '${apiPath}': ${response.status} - ${response.statusText}\n
        Www-Authenticate: ${response.headers.get('www-authenticate')}`
      );
    }
    return await response.json();
  };

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ['Test'],
    retry: false,
    queryFn
  });

  useEffect(() => {
    refetch();
  }, [apiPath, accessToken, isAttachToken, refetch]);

  return (
    <div>
      <ToastContainer limit={1} />
      <h1 className="text-lg font-semibold mt-5 mb-3">请求参数</h1>
      <label className="form-control">
        <div className="label">
          <span className="label-text font-semibold">API Path</span>
        </div>
        <select
          value={apiPath}
          onChange={(event) => setApiPath(event.target.value)}
          className="select select-bordered w-64"
        >
          <option value={PRIVATE_PATH}>{PRIVATE_PATH} (有认证)</option>
          <option value={PUBLIC_PATH}>{PUBLIC_PATH} (无认证)</option>
        </select>
        <div className="label mt-3 justify-start">
          <span className="label-text font-semibold">Access Token</span>
          <input
            type="checkbox"
            checked={isAttachToken}
            onChange={(event) => setIsAttachToken(event.target.checked)}
            className="checkbox checkbox-sm ml-3"
          />
        </div>
        <textarea
          value={accessToken}
          onChange={(event) => setAccessToken(event.target.value)}
          className="textarea textarea-bordered h-24"
          disabled={!isAttachToken}
        />
      </label>
      <h1 className="text-lg font-semibold mt-6 mb-3">响应结果</h1>
      <label className="form-control">
        {isPending ? (
          <span className="loading loading-spinner loading-md"></span>
        ) : error ? (
          <>
            <div className="label">
              <span className="label-text font-semibold">Error</span>
            </div>
            <div role="alert" className="alert alert-error whitespace-pre-line">
              {error.message}
            </div>
          </>
        ) : (
          <>
            <div className="label">
              <span className="label-text font-semibold">Body</span>
            </div>
            <div className="p-3 bg-base-200">
              <JsonView src={data} theme="vscode" />
            </div>
          </>
        )}
      </label>
    </div>
  );
};

export default Playground;
