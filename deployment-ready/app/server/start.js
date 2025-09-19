// Simple start script for the AICN application
const path = require('path');
const { spawn } = require('child_process');

// Change to the server directory
const serverDir = path.join(__dirname);
const serverFile = path.join(serverDir, 'server.js');

// Start the server
const serverProcess = spawn('node', [serverFile], {
  cwd: serverDir,
  stdio: 'inherit'
});

serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

serverProcess.on('error', (err) => {
  console.error('Failed to start server:', err);
});