# Use multi-stage build to optimize the image size

# Stage 1: Build React App
FROM node:20-bookworm-slim as react-build

WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend ./
RUN npm run build

# Stage 2: Set up Flask App and serve React build
FROM python:3.10

WORKDIR /backend
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Flask app and React build
COPY backend/ /backend/
COPY --from=react-build /frontend/dist /backend/static

# Expose the port Flask will run on
EXPOSE 5000

# Run the Flask app using Gunicorn
CMD ["gunicorn", "wsgi:app", "-b", "0.0.0.0:5000"]
