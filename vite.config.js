import { defineConfig } from 'vite';
import pkg from './package.json';
import preact from '@preact/preset-vite';

const REPORT_PROBLEM_PATH = '/api/report-problem.php';

function developmentReportProblemMock() {
	return {
		name: 'development-report-problem-mock',
		configureServer(server) {
			server.middlewares.use((request, response, next) => {
				if (request.url?.split('?')[0] !== REPORT_PROBLEM_PATH) {
					next();
					return;
				}

				response.setHeader('Content-Type', 'application/json');
				response.setHeader('Allow', 'POST');
				if (request.method !== 'POST') {
					response.statusCode = 405;
					response.end(JSON.stringify({ success: false, message: 'Method not allowed.' }));
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

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
	base: command === 'serve' ? '/' : '/v4/',
	plugins: [developmentReportProblemMock(), preact()],
	define: {
		'import.meta.env.VITE_APP_VERSION': JSON.stringify(pkg.version)
	}
}));
