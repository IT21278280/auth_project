FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3002

CMD ["node", "server.js"]




# FROM node:18.20.4-slim
# WORKDIR /app
# COPY package*.json ./
# RUN npm install --production
# COPY server.js ./
# COPY routes/ ./routes/
# COPY models/ ./models/
# EXPOSE 3002
# CMD ["node", "server.js"]





# # Use official Node.js runtime as the base image
# FROM node:18

# # Set working directory inside the container
# WORKDIR /app

# # Copy package.json and package-lock.json to install dependencies
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application code
# COPY . .

# # Expose the port your app runs on
# EXPOSE 3002

# # Command to run the application
# CMD ["node", "server.js"]