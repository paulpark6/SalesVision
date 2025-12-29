# syntax=docker/dockerfile:1

FROM node:18-bookworm-slim AS base
WORKDIR /app

FROM base AS deps
COPY apps/web/package.json apps/web/package-lock.json ./
RUN npm install

FROM base AS build
COPY apps/web/package.json apps/web/package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules
# Copy the web app source
COPY apps/web .
# Copy the database files required by the prebuild script
# COPY db ./db
# RUN ln -s /app/db /db
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0

COPY apps/web/package.json apps/web/package-lock.json ./
RUN npm install --omit=dev

COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.js ./next.config.js
COPY --from=build /app/tailwind.config.ts ./tailwind.config.ts
COPY --from=build /app/postcss.config.mjs ./postcss.config.mjs
COPY --from=build /app/components.json ./components.json
COPY --from=build /app/components.json ./components.json
COPY --from=build /app/tsconfig.json ./tsconfig.json
# Copy scripts and db for dev mode
COPY apps/web/scripts ./scripts
COPY apps/web/src ./src
COPY db ./db
RUN ln -s /app/db /db

EXPOSE 8080

CMD ["npm", "run", "start"]
