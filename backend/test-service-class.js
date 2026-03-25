require('dotenv').config();
const { AuthService } = require('./dist/services/auth.service');

async function test() {
  const service = new AuthService();
  try {
    const res = await service.login({
      email: "fresh_1774439405986@example.com",
      password: "Password123"
    });
    console.log("Success:", !!res.token);
  } catch (err) {
    console.log("Error:", err.statusCode, err.message);
  }
}

test();
