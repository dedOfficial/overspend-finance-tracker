# Stage 1: Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Copy all project files (lock files will be included if they exist)
# This ensures lock files are available for dependency installation
# We copy everything except what's in .dockerignore (node_modules, dist, etc.)
COPY . .

# Install dependencies
# Try npm ci first (if package-lock.json exists), then yarn, then npm install
RUN if [ -f package-lock.json ]; then \
      npm ci --legacy-peer-deps; \
    elif [ -f yarn.lock ]; then \
      yarn install --frozen-lockfile; \
    else \
      npm install --legacy-peer-deps; \
    fi

# Build the application
RUN npm run build || yarn build

# Stage 2: Production stage
FROM nginx:alpine

# Install gettext for envsubst (to substitute environment variables)
RUN apk add --no-cache gettext

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create nginx templates directory and configuration template with PORT variable
RUN mkdir -p /etc/nginx/templates && \
    echo 'server { \
    listen ${PORT} default_server; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Gzip compression \
    gzip on; \
    gzip_vary on; \
    gzip_min_length 1024; \
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json; \
    \
    # Security headers \
    add_header X-Frame-Options "SAMEORIGIN" always; \
    add_header X-Content-Type-Options "nosniff" always; \
    add_header X-XSS-Protection "1; mode=block" always; \
    \
    # SPA routing - fallback to index.html \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    # Cache static assets \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/templates/default.conf.template

# Create startup script to substitute PORT variable
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'set -e' >> /docker-entrypoint.sh && \
    echo 'export PORT=${PORT:-8080}' >> /docker-entrypoint.sh && \
    echo 'envsubst '"'"'$PORT'"'"' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf' >> /docker-entrypoint.sh && \
    echo 'exec nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Set default PORT (Cloud Run will override this)
ENV PORT=8080

# Expose port (Cloud Run uses PORT env var)
EXPOSE 8080

# Use custom entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
