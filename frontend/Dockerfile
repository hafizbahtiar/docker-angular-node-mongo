# Stage 1: Build the Angular app
FROM node:lts-slim

WORKDIR /usr/src/app

# Copy package files first to leverage Docker's build cache
COPY package*.json ./
COPY package-lock.json ./

# Install project dependencies using npm ci for clean, reproducible builds.
# No need for global @angular/cli installation here for `ng serve`.
# No need to remove node_modules/package-lock.json here; Docker is building fresh layers.
RUN npm ci

# Copy the rest of your application code
COPY . .

# Expose the port where the Angular dev server will run
EXPOSE 4200

# Command to start the Angular development server
# Use the full path to the ng executable within node_modules/.bin/
# Removed --disable-host-check if your builder doesn't support it, as warned previously.
CMD ["node_modules/.bin/ng", "serve", "--host", "0.0.0.0"]