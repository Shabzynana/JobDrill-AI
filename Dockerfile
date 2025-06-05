# -------- Stage 1: Build Stage --------
FROM node:18 as builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Build NestJS (compiles to /dist)
RUN npm run build


# -------- Stage 2: Production Image --------
FROM node:18-slim

WORKDIR /app

# Copy only necessary files
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

# Copy compiled app from builder
COPY --from=builder /app/dist ./dist


# Set environment
ENV NODE_ENV=production

# Render expects app to listen on this port
EXPOSE 5000

# Start the compiled NestJS app
CMD ["node", "dist/main.js"]

