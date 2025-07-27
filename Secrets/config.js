// Configuration for the application

const config = {
  // Database configuration
  database: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'admin123',
    name: 'app_db'
  },
  
  // API keys for various services
  apiKeys: {
    openai: 'sk-ABCdefGHIjklMNOpqrSTUvwxYZ0123456789',
    github: 'github_pat_11ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    mapbox: 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJja2w4czF4eXIwMTMzMnZwbGE1cjRxdWF0In0.examplekey123456',
    stripe: 'sk_test_1234567890abcdefghijklmnopqrstuvwxyz'
  },
  
  // JWT configuration
  jwt: {
    secret: 'this_is_a_very_long_secret_key_that_should_not_be_in_source_code',
    expiresIn: '24h'
  },
  
  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info'
  }
};

module.exports = config;
