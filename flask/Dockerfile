# Use the official Python image as the base
FROM python:3.9-slim

# Set environment variables to prevent Python from buffering and writing .pyc files
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Set the working directory
WORKDIR /app

# Copy application code into the working directory
COPY requirements.txt .
COPY *.py .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Expose the port the application runs on
EXPOSE 8000

# Command to run the application with Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:8000", "app:app"]
