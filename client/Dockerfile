# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Accept backend URL as build argument
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Stage 2: Serve
FROM node:20-alpine

RUN npm install -g serve

WORKDIR /app

COPY --from=builder /app/dist ./dist

RUN echo '{"name":"client","version":"1.0.0","scripts":{"start":"serve -s dist -l 80"}}' > package.json

EXPOSE 80

CMD ["serve", "-s", "dist", "-l", "80"]
