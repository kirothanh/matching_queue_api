# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the entire app
COPY . .

# Expose the application port
EXPOSE 8080:8080

# Run database migrations inside Docker container
CMD ["npx", "sequelize-cli", "db:migrate", "&&", "npm", "run", "start"]