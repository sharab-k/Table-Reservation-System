const http = require('http');

async function test() {
  const staffData = JSON.stringify({
    businessName: "Test Res 2",
    ownerName: "Tester 2",
    email: `unique_${Date.now()}@example.com`,
    password: "Password123",
    country: "UK",
    timezone: "GMT"
  });

  const req2 = http.request({ hostname: 'localhost', port: 3001, path: '/api/v1/auth/signup', method: 'POST', headers: { 'Content-Type': 'application/json' } }, res2 => {
    let body2 = '';
    res2.on('data', d => body2 += d);
    res2.on('end', () => {
      console.log(`Staff Signup Status: ${res2.statusCode}`);
      console.log(`Body: ${body2}`);
    });
  });
  req2.write(staffData);
  req2.end();
}

test();
