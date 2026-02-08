FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --silent

# Copy source
COPY . ./

# Expose Vite default dev port
EXPOSE 5173

# Start Vite dev server bound to all interfaces so other containers can reach it
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
