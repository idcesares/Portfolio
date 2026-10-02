# syntax=docker/dockerfile:1
# Multi-stage Dockerfile for Astro Portfolio
# Supports both development and production builds

# Base stage - shared dependencies
FROM node:22-alpine AS base

# Install pnpm (pinned for reproducibility — must match packageManager in package.json)
RUN --mount=type=secret,id=proxy_ca \
    if [ -f /run/secrets/proxy_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/proxy_ca; fi; \
    corepack enable && NODE_USE_ENV_PROXY=1 corepack prepare pnpm@10.33.0 --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Development stage
FROM base AS development

# Install all dependencies (including devDependencies)
RUN --mount=type=secret,id=proxy_ca \
    if [ -f /run/secrets/proxy_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/proxy_ca; fi; \
    pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Expose Astro dev server port
EXPOSE 4321

# Start development server with host binding for Docker
CMD ["pnpm", "dev", "--host", "0.0.0.0"]

# Builder stage - for production builds
FROM base AS builder

# Install all dependencies
RUN --mount=type=secret,id=proxy_ca \
    if [ -f /run/secrets/proxy_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/proxy_ca; fi; \
    pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN --mount=type=secret,id=proxy_ca \
    if [ -f /run/secrets/proxy_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/proxy_ca; fi; \
    NODE_USE_ENV_PROXY=1 pnpm build:preview

# Production stage - lightweight runtime
FROM node:22-alpine AS production

# Install pnpm (pinned for reproducibility — must match packageManager in package.json)
RUN --mount=type=secret,id=proxy_ca \
    if [ -f /run/secrets/proxy_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/proxy_ca; fi; \
    corepack enable && NODE_USE_ENV_PROXY=1 corepack prepare pnpm@10.33.0 --activate

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install only production dependencies
RUN --mount=type=secret,id=proxy_ca \
    if [ -f /run/secrets/proxy_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/proxy_ca; fi; \
    pnpm install --prod --frozen-lockfile

# Copy built application from builder
COPY --from=builder --chown=node:node /app/dist-preview ./dist-preview
COPY --from=builder --chown=node:node /app/scripts/check-preview.mjs ./scripts/check-preview.mjs

# Drop privileges
USER node

# Expose preview server port
EXPOSE 4321

# Start preview server
CMD ["node", "dist-preview/server/entry.mjs"]
