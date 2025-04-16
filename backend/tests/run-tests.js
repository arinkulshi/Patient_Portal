const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');


const testDataDir = path.join(__dirname, 'fixtures');
if (!fs.existsSync(testDataDir)) {
  fs.mkdirSync(testDataDir, { recursive: true });
}


function runTests(options = []) {
  try {
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


function main() {
  const args = process.argv.slice(2);
  
  
  let options = ['--runInBand'];
  
  
  if (args.length > 0) {
    options = options.concat(args);
  }
  
  if (!runTests(options)) {
    process.exit(1);
  }
}

main();