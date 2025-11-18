# Multi-stage Dockerfile for Astro Portfolio
# Supports both development and production builds

# Base stage - shared dependencies
FROM node:18-alpine AS base

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Development stage
FROM base AS development

# Install all dependencies (including devDependencies)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Expose Astro dev server port
EXPOSE 4321

# Start development server with host binding for Docker
CMD ["pnpm", "dev", "--host", "0.0.0.0"]

# Builder stage - for production builds
FROM base AS builder

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Production stage - lightweight runtime
FROM node:18-alpine AS production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Expose preview server port
EXPOSE 4321

# Start preview server
CMD ["pnpm", "preview", "--host", "0.0.0.0"]
