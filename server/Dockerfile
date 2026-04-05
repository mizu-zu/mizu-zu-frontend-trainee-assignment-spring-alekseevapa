FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS production

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .

ENV NODE_ENV=production
ENV PORT=4000

USER appuser

EXPOSE 4000

CMD ["npm", "start"]
