FROM node:18.20.4-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY server.js ./
COPY routes/ ./routes/
COPY models/ ./models/
EXPOSE 3001
CMD ["node", "server.js"]




# FROM node:18
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 3001
# CMD ["node", "server.js"]