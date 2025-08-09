const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting SpaceSnap Backend Server...');
console.log('📁 Working directory:', __dirname);
console.log('⚡ Environment: Development');
console.log('🔗 Will start on: http://localhost:5000');
console.log('📋 Available AI endpoints:');
console.log('   POST /api/images/ai/test - Test AI connection');
console.log('   POST /api/images/ai/generate - Generate images');
console.log('   GET /api/images/ai/proxy/* - Proxy images');
console.log('');

const server = spawn('node', ['server.js'], {
  stdio: 'inherit',
  cwd: __dirname
});

server.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGINT');
  process.exit();
});