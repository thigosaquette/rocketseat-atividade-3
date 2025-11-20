const fs = require('fs');
const path = require('path');

const testDbPattern = /^db\.test\.\d+\.sqlite$/;
const cwd = process.cwd();

try {
  const files = fs.readdirSync(cwd);
  let deletedCount = 0;
  let errorCount = 0;

  for (const file of files) {
    if (testDbPattern.test(file)) {
      const filePath = path.join(cwd, file);
      try {
        fs.unlinkSync(filePath);
        console.log(`✅ Deleted: ${file}`);
        deletedCount++;
      } catch (error) {
        console.warn(`⚠️  Could not delete ${file}: ${error.message}`);
        errorCount++;
      }
    }
  }

  if (deletedCount === 0 && errorCount === 0) {
    console.log('✨ No test database files found to clean');
  } else {
    console.log(`\n📊 Summary: ${deletedCount} deleted, ${errorCount} errors`);
  }
} catch (error) {
  console.error('❌ Error during cleanup:', error.message);
  process.exit(1);
}

