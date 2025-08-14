const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const dbUtils = require('./database-utils');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// VULNERABILITY: Insecure CORS configuration (Low Severity)
app.use(cors({
    origin: '*', // Allows any domain to make requests
    credentials: true
}));
app.use(express.static('public'));


// Database setup
// VULNERABILITY: Weak permissions (Low Severity)
// Should set proper file permissions but doesn't
const db = new sqlite3.Database('./vulnerable_app.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    // VULNERABILITY: Debug information (Low Severity)
    console.log('Connected to the vulnerable database');
  }
});


// Initialize database
db.serialize(() => {
    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        email TEXT,
        role TEXT DEFAULT 'user'
    )`);

    // Create posts table for XSS demo
    db.run(`CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Insert sample data
    db.run(`INSERT OR IGNORE INTO users (id, username, password, email, role) VALUES
        (1, 'admin', 'admin123', 'admin@demo.com', 'admin'),
        (2, 'user1', 'password123', 'user1@demo.com', 'user'),
        (3, 'john_doe', 'secret456', 'john@demo.com', 'user')`);

    db.run(`INSERT OR IGNORE INTO posts (id, title, content, author) VALUES
        (1, 'Welcome Post', 'Welcome to our vulnerable demo app!', 'admin'),
        (2, 'Sample Post', 'This is a sample post for testing.', 'user1')`);
});

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// SECURE ENDPOINT 1: Login with parameterized queries
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // VULNERABILITY: Sensitive information logging (Low Severity)
    console.log(`Login attempt: ${username}, password: ${password}`);

    // Input validation
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required'
        });
    }

    // Validate input length to prevent excessively long inputs
    if (username.length > 50 || password.length > 100) {
        return res.status(400).json({
            success: false,
            message: 'Input length exceeds maximum allowed'
        });
    }

    // SECURE: Using parameterized queries to prevent SQL injection
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

    console.log('Executing secure query with parameters'); // Don't log actual values

    db.get(query, [username, password], (err, row) => {
        if (err) {
            console.error('Database error:', err.message);
            res.status(500).json({
                error: 'Internal server error'
                // Don't expose sensitive error details in production
            });
        } else if (row) {
            // Don't return sensitive user data
            res.json({
                success: true,
                message: 'Login successful!',
                user: {
                    id: row.id,
                    username: row.username,
                    email: row.email,
                    role: row.role
                    // Don't return password hash
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
    });
});

// SECURE ENDPOINT 2: User search with parameterized queries
app.get('/search-users', (req, res) => {
    const { query: searchQuery } = req.query;

    if (!searchQuery) {
        return res.status(400).json({ error: 'Query parameter required' });
    }

    // Input validation
    if (typeof searchQuery !== 'string' || searchQuery.length > 50) {
        return res.status(400).json({
            error: 'Invalid search query. Must be a string with maximum 50 characters'
        });
    }

    // Sanitize input - remove potentially dangerous characters
    const sanitizedQuery = searchQuery.replace(/[^\w\s@.-]/g, '');

    if (sanitizedQuery.length === 0) {
        return res.status(400).json({
            error: 'Search query contains only invalid characters'
        });
    }

    // SECURE: Using parameterized queries to prevent SQL injection
    const sql = 'SELECT username, email, role FROM users WHERE username LIKE ? OR email LIKE ?';
    const searchPattern = `%${sanitizedQuery}%`;

    console.log('Executing secure search query with parameters');

    db.all(sql, [searchPattern, searchPattern], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            res.status(500).json({
                error: 'Internal server error'
                // Don't expose sensitive error details in production
            });
        } else {
            res.json({
                results: rows,
                count: rows.length
            });
        }
    });
});

// VULNERABLE ENDPOINT 3: XSS in post creation
app.post('/create-post', (req, res) => {
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
        return res.status(400).json({ error: 'All fields required' });
    }

    // Insert post without sanitization
    db.run('INSERT INTO posts (title, content, author) VALUES (?, ?, ?)',
        [title, content, author], function(err) {
        if (err) {
            res.status(500).json({ error: 'Failed to create post' });
        } else {
            res.json({
                success: true,
                message: 'Post created successfully!',
                postId: this.lastID
            });
        }
    });
});

// VULNERABLE ENDPOINT 4: XSS in displaying posts
app.get('/posts', (req, res) => {
    db.all('SELECT * FROM posts ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Failed to fetch posts' });
        } else {
            // Return raw HTML content - vulnerable to XSS
            let html = '<div class="posts-container">';
            rows.forEach(post => {
                // VULNERABLE: Direct insertion of user content without escaping
                html += `
                    <div class="post">
                        <h3>${post.title}</h3>
                        <div class="content">${post.content}</div>
                        <p class="author">By: ${post.author}</p>
                        <p class="date">${post.created_at}</p>
                    </div>
                `;
            });
            html += '</div>';

            res.send(html);
        }
    });
});

// VULNERABLE ENDPOINT 5: Reflected XSS
app.get('/welcome', (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.send('<h2>Welcome! Please provide your name in the URL: ?name=YourName</h2>');
    }

    // VULNERABLE: Direct reflection of user input
    const welcomeMessage = `
        <html>
        <head><title>Welcome</title></head>
        <body>
            <h1>Welcome, ${name}!</h1>
            <p>Thank you for visiting our vulnerable demo app.</p>
            <a href="/">Back to main page</a>
        </body>
        </html>
    `;

    res.send(welcomeMessage);
});

// VULNERABLE ENDPOINT: SQL Injection in user details retrieval
app.get('/user-details', (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    // VULNERABLE: Directly concatenating user input into SQL query
    const query = `SELECT * FROM users WHERE id = ${userId}`;

    db.get(query, (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
        } else if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});

// VULNERABLE ENDPOINT: Reflected XSS in search
app.get('/search', (req, res) => {
    const { term } = req.query;

    if (!term) {
        return res.send('<h2>Please provide a search term</h2>');
    }

    // VULNERABLE: Directly reflecting user input in the response
    // and including a script that will call displayUserContent with user input
    res.send(`<h2>Search results for: ${term}</h2>
        <div id="content"></div>
        <script>
            // This directly uses the displayUserContent function from database-utils.js
            // Function is brought into browser context via inline script
            function displayUserContent(content) {
                document.getElementById('content').innerHTML = content;
            }

            // Call the vulnerable function with user-controlled input
            displayUserContent("Showing results for: ${term}");
        </script>`);
});

// VULNERABLE ENDPOINT: Insecure error handling
app.get('/cause-error', (req, res) => {
    try {
        // Intentionally causing an error
        throw new Error('Demo error');
    } catch (err) {
        // VULNERABILITY: Temp file usage (Low Severity)
        const fs = require('fs');
        const errorLog = `/tmp/app_error_${Date.now()}.log`;
        fs.writeFileSync(errorLog, JSON.stringify(err, null, 2));

        // VULNERABLE: Exposing sensitive error details to the client
        res.status(500).json({ error: err.message, stack: err.stack });
    }
});

// API endpoint to get all users (for demo purposes)
app.get('/api/users', (req, res) => {
    // VULNERABILITY: Missing authentication check (Low Severity)
    // This endpoint should have authentication but doesn't
    db.all('SELECT id, username, email, role FROM users', (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Failed to fetch users' });
        } else {
            res.json(rows);
        }
    });
});

// VULNERABLE ENDPOINT: Using insecure functions from database-utils.js
app.get('/api/user-by-name', (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    // VULNERABILITY: Directly calling the vulnerable getUserByName function
    // which uses string concatenation for SQL query construction
    dbUtils.getUserByName(db, username)
        .then(rows => {
            res.json({
                results: rows,
                token: dbUtils.generateSessionToken(), // Using insecure token generation
                passwordValid: dbUtils.validatePassword(username) // Using weak password validation
            });
        })
        .catch(err => {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Database error', details: err.message });
        });
});

// Secure error handling
app.use((err, req, res, next) => {
    // Log error details securely (not to client)
    console.error('Server error:', {
        message: err.message,
        timestamp: new Date().toISOString(),
        // Don't log full stack trace in production
    });

    // Send generic error message to client
    res.status(500).json({
        error: 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

// VULNERABILITY: Information disclosure in comments (Low Severity)
// Database structure:
// - users table: id, username, password (plaintext), email, role
// - admin credentials: admin/admin123
// - connection string format: sqlite3://{username}:{password}@localhost/vulnerable_app.db

// Start server
app.listen(PORT, () => {
    // VULNERABILITY: Missing HTTP headers (Low Severity)
    // Should set security headers but doesn't
    console.log(`
    🚨 VULNERABLE DEMO APP RUNNING 🚨

    Server: http://localhost:${PORT}

    This app contains intentional vulnerabilities:
    - SQL Injection vulnerabilities in login and search
    - XSS vulnerabilities in posts and welcome page
    - Hard-coded credentials and keys
    - Insecure CORS configuration
    - Sensitive information logging
    - Missing authentication
    - Information disclosure in comments

    ⚠️  DO NOT USE IN PRODUCTION! ⚠️
    `);
});

module.exports = app;
