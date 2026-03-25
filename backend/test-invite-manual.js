const axios = require('axios');

async function testInvite() {
  const orgId = '5ee82204-2cf1-4c0a-9670-72751d7ee2ae'; // from user's screenshot
  const url = `http://localhost:3001/api/v1/organizations/${orgId}/staff/invite`;
  
  try {
    const response = await axios.post(url, {
      email: 'airafadil619+test@gmail.com',
      role: 'manager'
    });
    console.log('Success:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('Error Status:', error.response.status);
      console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
}

testInvite();
