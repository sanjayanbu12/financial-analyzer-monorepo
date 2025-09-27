# STAGE 1: Build the React application
FROM node:18-alpine as build-stage

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the production-ready static files
RUN npm run build


# STAGE 2: Serve the application with Nginx
FROM nginx:stable-alpine as production-stage

# Copy the built files from the previous stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# ADD THIS LINE: Copy the Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# The default command for the nginx image is to start the server
CMD ["nginx", "-g", "daemon off;"]