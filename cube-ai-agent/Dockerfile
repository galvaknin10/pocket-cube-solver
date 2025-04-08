# cube-ai-agent/Dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY . .
RUN pip install fastapi uvicorn requests python-dotenv
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
