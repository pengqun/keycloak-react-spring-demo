import { UserConfigExport, defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());

  const commonConfig: UserConfigExport = {
    plugins: [react()],
    base: '/'
  };

  if (command === 'serve') {
    return {
      ...commonConfig,
      server: {
        open: true,
        strictPort: true,
        proxy: {
          // Local proxy to avoid CORS issues in dev mode
          '/api': {
            target: env.VITE_BACKEND_BASE_URL,
            changeOrigin: true,
            rewrite: (path) => {
              return path.replace(/^\/api/, '');
            }
          }
        }
      }
    };
  }

  // command === 'build'
  return {
    ...commonConfig
  };
});
