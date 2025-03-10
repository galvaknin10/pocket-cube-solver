# Use an official Python image
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Copy requirements first and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install gdown to properly download Google Drive files
RUN pip install gdown

# Ensure the /data directory exists
RUN mkdir -p /data

# Download the large file from Google Drive with proper flags
RUN gdown --id 1qRwBc83zIU_uDC356Ls55JmWaU9Co7pX -O /data/tree_data.pkl --fuzzy

# Copy the backend code
COPY . .

# Expose the FastAPI port
EXPOSE 8000

# Run FastAPI using Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]




