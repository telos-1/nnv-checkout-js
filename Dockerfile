# syntax=docker/dockerfile:1.7

###############################################################################
# Stage: build — compile the checkout bundle into /app/dist
###############################################################################
FROM node:22.13.0-bookworm AS build

ENV NX_DAEMON=false \
    NODE_OPTIONS=--max-old-space-size=4096

WORKDIR /app

# Dependencies first so the (slow) install layer caches across source changes.
# `preinstall` runs check-node-version against the "engines" field, so the base
# image tag must stay in sync with .nvmrc / package.json.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# `webpack --mode production` stamps the bundle version via
# conventional-recommended-bump, which reads git history. The real .git is
# ~900MB and is excluded from the build context, so stand in a throwaway
# single-commit repo — a "fix:" subject resolves to a deterministic patch bump.
RUN git init -q . \
    && git -c user.email=build@localhost -c user.name=docker \
        commit -q --allow-empty -m "fix: docker build" \
    && npm run build

###############################################################################
# Stage: dev — webpack watch + CORS-enabled dev server on 8080
#   docker build --target dev -t checkout-js:dev .
#   docker run --rm -p 8080:8080 -v "$PWD":/app -v /app/node_modules checkout-js:dev
###############################################################################
FROM node:22.13.0-bookworm AS dev

ENV NX_DAEMON=false \
    NODE_OPTIONS=--max-old-space-size=4096

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

EXPOSE 8080

# `dev` writes to build/, `dev:server` serves it; create it up front so the
# server does not race the first compile.
CMD ["sh", "-c", "mkdir -p build && npx npm-run-all --parallel dev dev:server"]

###############################################################################
# Stage: runtime — serve the built assets (default target)
###############################################################################
FROM nginx:1.27-alpine AS runtime

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
