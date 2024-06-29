# Use the official Node.js 22 Alpine image as the base image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code to the working directory
COPY . .

# Compile the TypeScript code
RUN npm run build

# Expose the port the app runs on (optional, depending on your app)
# EXPOSE 8080

# Command to run the application
CMD ["npm", "start"]
