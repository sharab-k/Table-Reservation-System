const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const secret = process.env.JWT_SECRET;
if (!secret) {
  console.error('Missing JWT_SECRET');
  process.exit(1);
}

// Mock user payload based on the staff record we found
const payload = {
  id: 'e25f5a2f-0ef2-4d27-8df1-c22724e40b3d',
  email: 'airafbhai2003@gmail.com',
  role: 'manager',
  restaurantId: '5ee82204-2cf1-4c0a-9670-72751d7ee2ae',
  name: 'PIZN'
};

const token = jwt.sign(payload, secret, { expiresIn: '1h' });
console.log(token);
