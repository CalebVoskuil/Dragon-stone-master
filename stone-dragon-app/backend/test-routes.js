const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';

async function testRoutes() {
  console.log('🧪 Testing Stone Dragon Backend API Routes...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log(' Health check:', healthData.status);
    console.log(`   Environment: ${healthData.environment}`);
    console.log(`   Uptime: ${Math.round(healthData.uptime)} seconds\n`);

    // Test 2: API overview
    console.log('2. Testing API overview...');
    const apiResponse = await fetch(`${BASE_URL}/api`);
    const apiData = await apiResponse.json();
    console.log(' API overview:', apiData.message);
    console.log(`   Available endpoints: ${Object.keys(apiData.endpoints).join(', ')}`);
    console.log(`   Version: ${apiData.version}\n`);

    // Test 3: API Documentation
    console.log('3. Testing API documentation...');
    const docsResponse = await fetch(`${BASE_URL}/api/docs`);
    const docsData = await docsResponse.json();
    console.log(' API documentation:', docsData.title);
    console.log(`   Authentication: ${docsData.authentication}`);
    console.log(`   Endpoints available: ${Object.keys(docsData.endpoints).length} categories\n`);

    // Test 4: Schools endpoint (public)
    console.log('4. Testing schools endpoint...');
    const schoolsResponse = await fetch(`${BASE_URL}/api/schools`);
    const schoolsData = await schoolsResponse.json();
    console.log(' Schools endpoint:', schoolsData.message);
    console.log(`   Schools found: ${schoolsData.data?.length || 0}\n`);

    // Test 5: Authentication endpoints (without auth)
    console.log('5. Testing authentication endpoints...');
    
    // Test login with invalid credentials
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'wrongpassword' })
    });
    const loginData = await loginResponse.json();
    console.log(' Login validation:', loginData.message);
    console.log(`   Status: ${loginResponse.status}\n`);

    // Test 6: Protected endpoints (should fail without auth)
    console.log('6. Testing protected endpoints...');
    const profileResponse = await fetch(`${BASE_URL}/api/auth/profile`);
    const profileData = await profileResponse.json();
    console.log(' Profile protection:', profileData.message);
    console.log(`   Status: ${profileResponse.status}\n`);

    console.log(' All route tests completed successfully!');
    console.log('\n Available API Endpoints:');
    console.log('   • Authentication: /api/auth/*');
    console.log('   • Users: /api/users/*');
    console.log('   • Volunteer Logs: /api/volunteer-logs/*');
    console.log('   • Coordinator: /api/coordinator/*');
    console.log('   • Badges: /api/badges/*');
    console.log('   • Schools: /api/schools/*');
    console.log('   • Documentation: /api/docs');

  } catch (error) {
    console.error(' Test failed:', error.message);
  }
}

// Run tests
testRoutes();
