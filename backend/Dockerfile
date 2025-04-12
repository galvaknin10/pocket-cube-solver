# Use an official Python image
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Copy requirements first and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Ensure the /data directory exists
RUN mkdir -p /data

# Copy the backend code
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Run FastAPI using Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]





