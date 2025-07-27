FROM node:18-alpine

# VULNERABILITY: Using latest tag (Low Severity)
FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# VULNERABILITY: Running with root privileges (Medium Severity)
# Should use a non-root user but doesn't

# VULNERABILITY: Using --force flag with npm install (Low Severity)
RUN npm install --force

# Bundle app source
COPY . .

# VULNERABILITY: Exposing unnecessary ports (Low Severity)
EXPOSE 3000 8080 9229

# VULNERABILITY: Running with full privileges (Medium Severity)
# Should use --security-opt=no-new-privileges but doesn't
CMD [ "node", "src/server.js" ]
