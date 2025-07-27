import * as express from 'express';
import * as http from 'http';
import * as _ from 'lodash';
import { parse } from 'minimist';
import fetch from 'node-fetch';

// Import vulnerable utility functions
import { processUserData } from './utils';

// Create Express application
const app = express();
const server = http.createServer(app);

// Parse command line arguments using vulnerable minimist version
const args = parse(process.argv.slice(2));
const port = args.port || 3000;

// Use vulnerable lodash function
const userConfig = _.merge({}, { admin: false }, args.user);

app.get('/api/user/:id', async (req, res) => {
  try {
    // Using vulnerable node-fetch version
    const response = await fetch(`https://api.example.com/users/${req.params.id}`);
    const userData = await response.json();
    
    // Process data using function from utils.ts
    const processedData = processUserData(userData);
    
    res.json(processedData);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('User config:', userConfig);
});
