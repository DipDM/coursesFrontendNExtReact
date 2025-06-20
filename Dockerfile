# Use Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Build the app
RUN npm run build

# Expose the port (Next.js default)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
