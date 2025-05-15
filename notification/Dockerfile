# FROM node:18.20.4-slim
# WORKDIR /app
# COPY package*.json ./
# RUN npm install --production
# COPY index.js ./
# COPY server.js ./
# COPY routes/ ./routes/
# EXPOSE 3003
# CMD ["node", "index.js"]

#Fixed errors


FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3003
CMD ["npm", "start"]




# FROM node:18
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 3003
# CMD ["node", "server.js"]