# Use base Python image
FROM python:3.9

# Install dependencies
RUN pip install requests

# Copy the script
COPY init-data.py /init-data.py

# Run the script to download the `.pkl` file
CMD ["python", "/fetch_data.py"]
