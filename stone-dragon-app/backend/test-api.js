// Simple test script to verify the backend API is working
// Run this after starting the backend server

const API_BASE = 'http://localhost:3001';

async function testAPI() {
  console.log('🧪 Testing Stone Dragon Backend API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log(' Health check:', healthData.status);
    console.log('   Environment:', healthData.environment);
    console.log('   Uptime:', Math.round(healthData.uptime), 'seconds\n');

    // Test API overview
    console.log('2. Testing API overview...');
    const apiResponse = await fetch(`${API_BASE}/api`);
    const apiData = await apiResponse.json();
    console.log(' API overview:', apiData.message);
    console.log('   Available endpoints:', Object.keys(apiData.endpoints).join(', '));
    console.log('   Version:', apiData.version, '\n');

    // Test login with seeded user
    console.log('3. Testing authentication...');
    const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'student1@example.com',
        password: 'password123',
      }),
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log(' Login successful!');
      console.log('   User:', loginData.data.user.firstName, loginData.data.user.lastName);
      console.log('   Role:', loginData.data.user.role);
      console.log('   Token received:', loginData.data.token ? 'Yes' : 'No');
      
      // Test authenticated endpoint
      const token = loginData.data.token;
      console.log('\n4. Testing authenticated endpoint...');
      const profileResponse = await fetch(`${API_BASE}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        console.log(' Profile endpoint working!');
        console.log('   User ID:', profileData.data.id);
      } else {
        console.log(' Profile endpoint failed:', profileResponse.status);
      }
    } else {
      console.log(' Login failed:', loginResponse.status);
      const errorData = await loginResponse.json();
      console.log('   Error:', errorData.message);
    }

    console.log('\n API testing completed!');
    console.log('\n Next steps:');
    console.log('1. Start the React Native frontend: cd frontend && npm start');
    console.log('2. Test the mobile app with Expo Go');
    console.log('3. Use the test accounts to explore the app');

  } catch (error) {
    console.error(' API test failed:', error.message);
    console.log('\n Troubleshooting:');
    console.log('1. Make sure the backend server is running: npm run dev:backend');
    console.log('2. Check that the database is seeded: npm run db:seed');
    console.log('3. Verify the server is running on port 3001');
  }
}

// Run the test
testAPI();
