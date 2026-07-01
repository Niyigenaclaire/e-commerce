const axios = require('axios');

async function test(path) {
  const api = 'https://sms-express-app-1-production-a843.up.railway.app' + path;
  
  try {
    const register = await axios.post(api, {
      email: 'testuser@example.com',
      password: 'password123'
    });
    console.log(`Success on ${path}:`, register.data);
  } catch (err) {
    if (err.response?.status === 404) {
      console.log(`404 on ${path}`);
    } else {
      console.log(`Failed on ${path} (${err.response?.status}):`, err.response?.data || err.message);
    }
  }
}

async function runAll() {
  await test('/api/auth/register');
  await test('/auth/register');
  await test('/register');
  
  try {
      const getStories = await axios.get('https://sms-express-app-1-production-a843.up.railway.app/api/stories');
      console.log('Stories:', getStories.data.length);
  } catch (err) {
      console.log('Stories endpoint failed:', err.response?.data);
  }
}

runAll();
