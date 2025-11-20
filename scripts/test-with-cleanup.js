const { execSync } = require('child_process');

try {
  console.log('Running tests...\n');
  execSync('vitest run', { stdio: 'inherit' });
} catch (error) {
}

console.log('\nCleaning up test databases...\n');
try {
  execSync('node scripts/clean-test-db.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Error during cleanup:', error.message);
  process.exit(1);
}

