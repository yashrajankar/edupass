// Verification script for AICN deployment structure
const fs = require('fs');
const path = require('path');

// Define the expected directory structure
const expectedStructure = {
  '': ['app', 'config', 'docs', 'scripts', 'package.json', 'README.md'],
  'app': ['public', 'server'],
  'app/public': ['admin-features', 'user-features', 'index.html', 'style.css', 'admin.css', 'assets', 'import', 'templates', 'manifest.json', 'favicon.ico'],
  'app/server': ['config', 'services', 'scripts', 'server.js', 'start.js'],
  'config': ['.env.example', '.env.production'],
  'docs': ['DEPLOYMENT_GUIDE.md'],
  'scripts': ['start.sh', 'start.bat', 'verify-deployment.js']
};

// Function to check if a directory exists
function directoryExists(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch (err) {
    return false;
  }
}

// Function to check if a file exists
function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

// Function to verify the structure
function verifyStructure(basePath, structure) {
  let allGood = true;
  
  for (const [dir, items] of Object.entries(structure)) {
    const fullPath = path.join(basePath, dir);
    
    if (dir !== '' && !directoryExists(fullPath)) {
      console.error(`❌ Directory missing: ${fullPath}`);
      allGood = false;
      continue;
    }
    
    console.log(`✅ Checking directory: ${dir || 'root'}`);
    
    for (const item of items) {
      const itemPath = path.join(fullPath, item);
      
      if (item.includes('.') && !item.includes('-')) {
        // It's likely a file (contains dot but no dash)
        if (!fileExists(itemPath)) {
          console.error(`❌ File missing: ${itemPath}`);
          allGood = false;
        } else {
          console.log(`  ✅ File exists: ${item}`);
        }
      } else {
        // It's a directory or a file without extension
        if (!directoryExists(itemPath) && !fileExists(itemPath)) {
          console.error(`❌ Item missing: ${itemPath}`);
          allGood = false;
        } else if (directoryExists(itemPath)) {
          console.log(`  ✅ Directory exists: ${item}`);
        } else {
          console.log(`  ✅ File exists: ${item}`);
        }
      }
    }
  }
  
  return allGood;
}

// Run the verification
console.log('🔍 Verifying AICN deployment structure...\n');

const basePath = path.join(__dirname, '..');
const isStructureValid = verifyStructure(basePath, expectedStructure);

console.log('\n' + '='.repeat(50));
if (isStructureValid) {
  console.log('🎉 All required files and directories are present!');
  console.log('✅ Deployment structure verification PASSED');
} else {
  console.log('❌ Deployment structure verification FAILED');
  console.log('⚠️  Some required files or directories are missing');
}
console.log('='.repeat(50));