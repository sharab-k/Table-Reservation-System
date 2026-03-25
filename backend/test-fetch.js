const http = require('http');

const req = http.request({
  hostname: 'localhost',
  port: 3001,
  path: '/api/v1/organizations/5ee82204-2cf1-4c0a-9670-72751d7ee2ae/reservations?limit=100&sortOrder=desc&date=2026-03-25',
  method: 'GET'
}, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Body: ${body}`);
  });
});
req.on('error', e => console.error(e));
req.end();
