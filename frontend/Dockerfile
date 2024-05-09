# Stage 1: Build the application
FROM node:latest as node
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2: Serve the application with Nginx
FROM nginx:alpine
COPY --from=node /app/dist/frontend /usr/share/nginx/html