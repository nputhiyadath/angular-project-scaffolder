FROM node:18-alpine

# Install necessary build tools
RUN apk add --no-cache python3 make g++ git

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Copy source code (needed before npm install for prepare script)
COPY . .

# Install dependencies
RUN npm install

# Make the CLI executable
RUN chmod +x index.js

# Create a volume for project output
VOLUME ["/workspace"]

WORKDIR /workspace

# Install the CLI globally
RUN npm link /usr/src/app

ENTRYPOINT ["ng-scaffold"]
