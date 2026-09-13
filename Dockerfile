# ==========================================
# Stage 1: Build Frontend Assets
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies with cached layers
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build production bundle
COPY . .

# Build-time environment variable for FastAPI API Gateway
ARG VITE_API_BASE_URL=/api/v1
ARG VITE_USE_BACKEND_API=true
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_USE_BACKEND_API=$VITE_USE_BACKEND_API

RUN npm run build

# ==========================================
# Stage 2: Serve via Nginx Alpine
# ==========================================
FROM nginx:1.27-alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
