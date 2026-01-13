# Multi-stage Dockerfile for Astro Portfolio
# Supports both development and production builds

# Base stage - shared dependencies
FROM node:22-alpine AS base

# Install pnpm (pinned for reproducibility)
RUN corepack enable && corepack prepare pnpm@10.20.0 --activate

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
FROM node:22-alpine AS production

# Install pnpm (pinned for reproducibility)
RUN corepack enable && corepack prepare pnpm@10.20.0 --activate

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built application from builder
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/public ./public

# Drop privileges
USER node

# Expose preview server port
EXPOSE 4321

# Start preview server
CMD ["pnpm", "preview", "--host", "0.0.0.0"]
