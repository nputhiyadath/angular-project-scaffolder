FROM node:18-alpine

# Install necessary build tools
RUN apk add --no-cache python3 make g++ git

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Make the CLI executable
RUN chmod +x index.js

# Create a volume for project output
VOLUME ["/workspace"]

WORKDIR /workspace

# Install the CLI globally
RUN npm link /usr/src/app

ENTRYPOINT ["ng-scaffold"]
