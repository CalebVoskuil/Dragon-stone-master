// Setup script for Stone Dragon Backend
// This script helps with initial setup and database operations

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Stone Dragon Backend Setup\n');

function runCommand(command, description) {
  try {
    console.log(`📦 ${description}...`);
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

function checkFileExists(filePath) {
  return fs.existsSync(path.join(__dirname, filePath));
}

async function main() {
  console.log('🔍 Checking setup requirements...\n');

  // Check if .env file exists
  if (!checkFileExists('.env')) {
    console.log('📝 Creating .env file from template...');
    if (checkFileExists('env.example')) {
      fs.copyFileSync('env.example', '.env');
      console.log('✅ .env file created from env.example');
      console.log('⚠️  Please review and update the .env file with your settings\n');
    } else {
      console.log('❌ env.example file not found');
      process.exit(1);
    }
  } else {
    console.log('✅ .env file already exists\n');
  }

  // Install dependencies
  runCommand('npm install', 'Installing dependencies');

  // Generate Prisma client
  runCommand('npx prisma generate', 'Generating Prisma client');

  // Run database migrations
  runCommand('npx prisma migrate dev --name init', 'Running database migrations');

  // Seed the database
  runCommand('npx prisma db seed', 'Seeding database with initial data');

  console.log('🎉 Backend setup completed successfully!\n');
  console.log('📋 Next steps:');
  console.log('1. Start the backend server: npm run dev');
  console.log('2. Test the API: node test-api.js');
  console.log('3. Open Prisma Studio: npm run db:studio');
  console.log('4. Start the frontend: cd ../frontend && npm start\n');
  
  console.log('🔑 Test accounts created:');
  console.log('   Student: student1@example.com / password123');
  console.log('   Volunteer: volunteer1@example.com / password123');
  console.log('   Coordinator: coordinator1@example.com / password123');
  console.log('   Admin: admin@stonedragon.org / password123\n');
  
  console.log('🌐 API endpoints:');
  console.log('   Health check: http://localhost:3001/health');
  console.log('   API docs: http://localhost:3001/api');
  console.log('   Prisma Studio: http://localhost:5555');
}

main().catch(console.error);
