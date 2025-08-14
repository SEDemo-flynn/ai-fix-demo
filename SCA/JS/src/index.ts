import express from 'express';
import * as http from 'http';
import * as _ from 'lodash';

// Import vulnerable utility functions
import { processUserData } from './utils';

// Create Express application
const app = express();
const server = http.createServer(app);

// Parse command line arguments using built-in process.argv (instead of minimist)
const args: any = {};
process.argv.slice(2).forEach(arg => {
  if (arg.startsWith('--port=')) {
    args.port = parseInt(arg.split('=')[1]);
  }
  if (arg.startsWith('--user=')) {
    try {
      args.user = JSON.parse(arg.split('=')[1]);
    } catch {
      args.user = {};
    }
  }
});

const port = args.port || 3000;

// FIXED: Use lodash 3.x compatible approach to prevent prototype pollution
// Create a clean copy of args.user first
const cleanUserArgs = args.user ? JSON.parse(JSON.stringify(args.user)) : {};

// Remove dangerous keys that could cause prototype pollution
if (cleanUserArgs.__proto__) delete cleanUserArgs.__proto__;
if (cleanUserArgs.constructor) delete cleanUserArgs.constructor;
if (cleanUserArgs.prototype) delete cleanUserArgs.prototype;

const userConfig = _.merge({}, { admin: false }, cleanUserArgs);

// Lodash 3.x.x compatible methods (reverting from 4.x changes)
const sampleData = [
  { id: 1, name: 'John', age: 30, roles: ['user', 'admin'] },
  { id: 2, name: 'Jane', age: 25, roles: ['user'] },
  { id: 3, name: 'Bob', age: 35, roles: ['user', 'moderator'] }
];

// Using _.pluck() which is available in lodash 3.x
const userNames = ((_ as any).pluck)(sampleData, 'name');
console.log('User names (using _.pluck):', userNames);

// Using _.where() which is available in lodash 3.x
const admins = ((_ as any).where)(sampleData, { roles: ['user', 'admin'] });
console.log('Admins (using _.where):', admins);

// Using _.findWhere() which is available in lodash 3.x
const specificUser = ((_ as any).findWhere)(sampleData, { name: 'Jane' });
console.log('Specific user (using _.findWhere):', specificUser);

// Using _.contains() which is the lodash 3.x method name
const hasJohn = ((_ as any).contains)(userNames, 'John');
console.log('Contains John (using _.contains):', hasJohn);

// Using _.all() which is the lodash 3.x method name
const allHaveRoles = ((_ as any).all)(sampleData, (user: any) => user.roles && user.roles.length > 0);
console.log('All have roles (using _.all):', allHaveRoles);

// Using _.any() and _.contains() which are lodash 3.x method names
const anyAdmins = ((_ as any).any)(sampleData, (user: any) => ((_ as any).contains)(user.roles, 'admin'));
console.log('Any admins (using _.any):', anyAdmins);

// Using _.collect() which is available in lodash 3.x
const userAges = ((_ as any).collect)(sampleData, 'age');
console.log('User ages (using _.collect):', userAges);

// Using _.detect() and _.contains() which are lodash 3.x method names
const firstAdmin = ((_ as any).detect)(sampleData, (user: any) => ((_ as any).contains)(user.roles, 'admin'));
console.log('First admin (using _.detect):', firstAdmin);

// Using _.foldl() which is available in lodash 3.x
const totalAge = ((_ as any).foldl)(sampleData, (sum: number, user: any) => sum + user.age, 0);
console.log('Total age (using _.foldl):', totalAge);

// Using _.foldr() which is available in lodash 3.x
const reverseAgeSum = ((_ as any).foldr)(sampleData, (sum: number, user: any) => sum + user.age, 0);
console.log('Reverse age sum (using _.foldr):', reverseAgeSum);

// Express middleware to parse JSON
app.use(express.json());

app.get('/api/user/:id', async (req: express.Request, res: express.Response) => {
  try {
    // Simulate user data instead of using node-fetch (since it's not in package.json)
    const userId = req.params.id;
    const mockUserData = {
      id: parseInt(userId),
      name: `User ${userId}`,
      email: `user${userId}@example.com`,
      created: new Date().toISOString()
    };

    // Process data using function from utils.ts
    const processedData = processUserData(mockUserData);

    res.json(processedData);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

// Add a simple root endpoint
app.get('/', (req: express.Request, res: express.Response) => {
  res.json({
    message: 'Vulnerable Dependencies Demo API',
    endpoints: [
      'GET / - This endpoint',
      'GET /api/user/:id - Get user data'
    ],
    lodashVersion: '3.0.1',
    expressVersion: '4.16.0'
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('User config:', userConfig);
  console.log('Available endpoints:');
  console.log(`  GET http://localhost:${port}/`);
  console.log(`  GET http://localhost:${port}/api/user/:id`);
});
