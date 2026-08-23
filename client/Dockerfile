# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve
FROM node:20-alpine

RUN npm install -g serve

WORKDIR /app

COPY --from=builder /app/dist ./dist

RUN echo '{"name":"client","version":"1.0.0","scripts":{"start":"serve -s dist -l 80"}}' > package.json

EXPOSE 80

CMD ["serve", "-s", "dist", "-l", "80"]
