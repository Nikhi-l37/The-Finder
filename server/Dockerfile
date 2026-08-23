FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN mkdir -p uploads

ENV NODE_OPTIONS=--dns-result-order=ipv4first

EXPOSE 3001

CMD ["node", "--dns-result-order=ipv4first", "index.js"]
