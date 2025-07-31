const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting image upload process...\n');

// Function to run a script and wait for it to complete
function runScript(scriptName) {
  return new Promise((resolve, reject) => {
    console.log(`\n📸 Running ${scriptName}...`);
    
    const scriptPath = path.join(__dirname, scriptName);
    const child = spawn('node', [scriptPath], {
      cwd: path.join(__dirname, '..'),
      env: { ...process.env },
      stdio: 'inherit'
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`${scriptName} exited with code ${code}`));
      } else {
        console.log(`✅ ${scriptName} completed successfully`);
        resolve();
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function runAllUploads() {
  try {
    // First check what's in the database
    console.log('📊 Checking current database state...');
    await runScript('checkUploadedImages.js');
    
    // Upload style room images
    console.log('\n🏠 Uploading style room images...');
    await runScript('uploadStyleRoomImages.js');
    
    // Upload quiz question images
    console.log('\n❓ Uploading quiz question images...');
    await runScript('uploadQuizQuestionImages.js');
    
    // Final check
    console.log('\n📊 Final database check...');
    await runScript('checkUploadedImages.js');
    
    console.log('\n✅ All uploads completed successfully!');
    console.log('\n🌐 You can now visit:');
    console.log('   - http://localhost:5000/api/images (to see all images)');
    console.log('   - http://localhost:5173/style-quiz (to use the quiz)');
    
  } catch (error) {
    console.error('\n❌ Error during upload process:', error.message);
    process.exit(1);
  }
}

// Run all uploads
runAllUploads();