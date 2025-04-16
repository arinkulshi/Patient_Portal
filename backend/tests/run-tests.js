const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Create temporary test directory if it doesn't exist
const testDataDir = path.join(__dirname, 'fixtures');
if (!fs.existsSync(testDataDir)) {
  fs.mkdirSync(testDataDir, { recursive: true });
}

/**
 * Run tests with the specified options
 */
function runTests(options = []) {
  try {
    // Run the tests
    const command = `jest ${options.join(' ')}`;
    console.log(`Running: ${command}`);
    
    execSync(command, { 
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'test',
        DATA_DIR: testDataDir
      }
    });
    
    return true;
  } catch (error) {
    console.error('Tests failed:', error.message);
    return false;
  }
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  
  // Default options
  let options = ['--runInBand']; // Run tests sequentially
  
  // Add any command-line arguments
  if (args.length > 0) {
    options = options.concat(args);
  }
  
  if (!runTests(options)) {
    process.exit(1);
  }
}

main();