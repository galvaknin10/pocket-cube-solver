# Use an official Python image
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Copy requirements first and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Install gdown to download files from Google Drive
RUN pip install gdown

# Ensure the /data directory exists
RUN mkdir -p /data

# # Download the large file from Google Drive
# RUN gdown --id 1dazUXOyw2vircXC_qz4YF2X9Sa4CW98D -O /data/tree_data.pkl --fuzzy

# Copy the backend code
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Run FastAPI using Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]





