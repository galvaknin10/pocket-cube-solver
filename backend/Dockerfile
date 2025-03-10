# Use an official Python image
FROM python:3.9

# Set the working directory inside the container
WORKDIR /app

# Copy the backend source code into the container
COPY . .

# Install dependencies
RUN pip install --no-cache-dir fastapi uvicorn -r requirements.txt

# Expose FastAPI's default port
EXPOSE 8000

# Run FastAPI when the container starts
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
