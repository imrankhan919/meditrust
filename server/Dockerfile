FROM node:22-alpine AS frontend-build

WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build


FROM node:22-alpine AS backend

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY server/ ./server/

COPY --from=frontend-build /app/client/dist ./client/dist

EXPOSE 5000

CMD ["node", "server/server.js"]