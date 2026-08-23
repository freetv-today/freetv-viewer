import { defineConfig, loadEnv } from 'vite';
import preact from '@preact/preset-vite';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const DATA_PROXY_TARGET = 'https://freetv.today';
const REPORT_PROBLEM_PATH = '/api/report-problem.php';
const PROJECT_ROOT = dirname(fileURLToPath(import.meta.url));

function developmentReportProblemMock() {
  return {
    name: 'development-report-problem-mock',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = request.url.split('?')[0];
        if (pathname !== REPORT_PROBLEM_PATH) {
          next();
          return;
        }

        response.setHeader('Content-Type', 'application/json');
        response.setHeader('Allow', 'POST');

        if (request.method !== 'POST') {
          response.statusCode = 405;
          response.end(JSON.stringify({
            success: false,
            message: 'Method not allowed.'
          }));
          return;
        }

        request.resume();
        response.statusCode = 200;
        response.end(JSON.stringify({
          success: true,
          message: 'Thank you! Your problem report has been received.'
        }));
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, PROJECT_ROOT, '');
  const dataMode = env.FREETV_DATA_MODE ?? 'remote';

  if (dataMode !== 'remote' && dataMode !== 'local') {
    throw new Error('FREETV_DATA_MODE must be either "remote" or "local".');
  }

  const dataProxy = dataMode === 'remote' ? {
    '/config.json': {
      target: DATA_PROXY_TARGET,
      changeOrigin: true,
    },
    '/playlists': {
      target: DATA_PROXY_TARGET,
      changeOrigin: true,
    },
    '/thumbs': {
      target: DATA_PROXY_TARGET,
      changeOrigin: true,
    },
  } : undefined;

  return {
    plugins: [developmentReportProblemMock(), preact()],
    resolve: {
      alias: {
        '@': resolve(PROJECT_ROOT, 'src'),
        '@components': resolve(PROJECT_ROOT, 'src/components'),
        '@pages': resolve(PROJECT_ROOT, 'src/pages'),
        '@context': resolve(PROJECT_ROOT, 'src/context'),
        '@signals': resolve(PROJECT_ROOT, 'src/signals'),
        '@hooks': resolve(PROJECT_ROOT, 'src/hooks'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: dataProxy,
    }
  };
});
