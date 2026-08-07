# Stage 1: Build the React Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /frontend

# Copy frontend package manifest and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy React code and build static assets
COPY . .
RUN npm run build

# Stage 2: Build the FastAPI Backend
FROM python:3.11-slim
WORKDIR /app

# Install system utilities
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY janamanthan-backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application code
COPY janamanthan-backend/ .

# Copy compiled frontend assets from Stage 1 into the backend's static directory
COPY --from=frontend-builder /frontend/dist ./static

# Expose port and launch server
EXPOSE 8000
CMD ["python", "main.py"]
