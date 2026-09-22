// Parameterized query to prevent SQL injection (CWE-89)
function getUserByName(db, username) {
    const query = 'SELECT * FROM users WHERE username = ?';
    return new Promise((resolve, reject) => {
        db.all(query, [username], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// Example of XSS vulnerability
function displayUserContent(content) {
    document.getElementById('content').innerHTML = content;
    // VULNERABILITY: Direct insertion of user content without escaping (High Severity)
}

// VULNERABILITY: Weak password validation (Low Severity)
function validatePassword(password) {
    // Just checks length, no complexity requirements
    return password.length >= 6;
}

// VULNERABILITY: Insecure random token generation (Low Severity)
function generateSessionToken() {
    return Math.random().toString(36).substring(2, 15);
}

// Export functions for use in server.js
module.exports = {
    getUserByName,
    displayUserContent,
    validatePassword,
    generateSessionToken
};
