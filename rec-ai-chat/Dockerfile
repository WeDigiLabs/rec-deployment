
# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.15.0

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app

# Install dependencies separately for better caching

# Install all dependencies (including devDependencies) for build
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci


# Build the Next.js app
FROM deps AS build
COPY . .
RUN npm run build


# Production image, copy only necessary files

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3002
WORKDIR /app

# Use non-root user for security
USER node

# Copy only production dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts
COPY --from=build /app/app ./app
COPY --from=build /app/types ./types
COPY --from=build /app/services ./services
COPY --from=build /app/hooks ./hooks
COPY --from=build /app/postcss.config.mjs ./postcss.config.mjs
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/eslint.config.mjs ./eslint.config.mjs

# Expose the port Next.js will run on
EXPOSE 3002

# Start the Next.js server
CMD ["npm", "start"]
