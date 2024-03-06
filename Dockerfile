# Use the official Node.js 14 image
FROM node:18

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install project dependencies
RUN pnpm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the TypeScript code
RUN pnpm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run your application
CMD ["pnpm", "start:prod"]
