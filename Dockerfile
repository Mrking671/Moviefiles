FROM node:18 as builder

WORKDIR /app
RUN mkdir -p client

# Server dependencies
COPY server/package*.json ./
RUN npm install

# Client dependencies
COPY client/package*.json ./client/
RUN cd client && npm install

# Copy all files
COPY . .

# Build client
RUN cd client && npm run build

# Production image
FROM node:18
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/client/dist ./public
COPY server .

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "index.js"]
