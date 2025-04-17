import { defineConfig } from 'cypress';
import { execSync, spawn } from 'child_process';
import { platform } from 'os';

let frontendProcess;

const isWindows = platform() === 'win32';

const killProcessOnPort = (port) => {
  try {
    if (isWindows) {
      execSync(`FOR /F "tokens=5" %p IN ('netstat -ano ^| findstr :${port} ^| findstr LISTENING') DO taskkill /F /PID %p`, { shell: true, stdio: 'ignore' });
    } else {
      execSync(`lsof -ti :${port} | xargs kill -9`, { stdio: 'ignore' });
    }
    console.log(`🛑 Killed process on port ${port}`);
  } catch (error) {
    console.log(`No process found on port ${port} or error killing it`);
  }
};

const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
};

const VITE_PORT = 5173;

// Rutas absolutas a las carpetas
const CURRENT_DIR = process.cwd();
const FRONTEND_DIR = CURRENT_DIR;

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      process.env.NODE_ENV = 'test';
      console.log(`NODE_ENV = ${process.env.NODE_ENV}`);

      on('before:run', () => {
        return new Promise((resolve) => {
          frontendProcess = spawn('npm', ['run', 'dev'], {
            cwd: FRONTEND_DIR,
            stdio: 'pipe',
            shell: true
          });

         // server is ready
         frontendProcess.stdout.on('data', (data) => {
          const output = data.toString();
          if (output.includes('Local:') || 
              output.includes('localhost:') || 
              output.includes('port 5173') || 
              output.includes('ready in')) {
            console.log('✅ Vite server running on port 5173');
          }
        });

        // catch critic error
        frontendProcess.on('error', (err) => {
          console.error(`Error starting Vite: ${err.message}`);
        });
          
          console.log('Waiting for the server to be ready...');
          setTimeout(() => {
            console.log('✅ Timeout complete, continuing testing');
            resolve();
          }, 2000);
        });
      });

      on('after:run', (results) => {
        try {
          if (frontendProcess) {
            frontendProcess.kill();
          }
          
          killProcessOnPort(VITE_PORT);

          if (results) {
                        const formattedDuration = formatTime(results.totalDuration);
                        console.log('Total duration: ', formattedDuration);
                        console.log('Total suites: ', results.totalSuites);
                        console.log('Total tests: ', results.totalTests);
                        console.log('');
                        console.log('Passed: ', results.totalPassed);
                        console.log('Failed: ', results.totalFailed);
                        console.log('Pending: ', results.totalPending);
                      }
          
          console.log('🛑 Server stopped');
        } catch (error) {
          console.error(`Error closing the server: ${error.message}`);
        }
      });
    },
  },
  viewportWidth: 1640,
  viewportHeight: 1600,
  video: false,
  reporter: 'dot',
  chromeWebSecurity: false,
});
