const http = require('http');

const data = JSON.stringify({
  email: "fresh_1774439405986@example.com",
  password: "Password123"
});

const req = http.request(
  {
    hostname: 'localhost',
    port: 3001,
    path: '/api/v1/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  },
  (res) => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
      const authData = JSON.parse(body);
      const token = authData.data.token;
      
      const req2 = http.request({
        hostname: 'localhost',
        port: 3001,
        path: '/api/v1/organizations/5ee82204-2cf1-4c0a-9670-72751d7ee2ae/reservations?limit=100&sortOrder=desc&date=2026-03-25',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }, (res2) => {
        let body2 = '';
        res2.on('data', d => body2 += d);
        res2.on('end', () => {
          console.log(`Reservations Status: ${res2.statusCode}`);
          console.log(`Reservations Body: ${body2}`);
        });
      });
      req2.end();
    });
  }
);
req.write(data);
req.end();
