# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG PYTHON_VERSION=3.11.9
FROM python:${PYTHON_VERSION}-slim as base

# Prevents Python from writing pyc files.
ENV PYTHONDONTWRITEBYTECODE=1

# Keeps Python from buffering stdout and stderr to avoid situations where
# the application crashes without emitting any logs due to buffering.
ENV PYTHONUNBUFFERED=1

# Set default environment variables to prevent empty string issues
ENV MAX_CONVERSATION_HISTORY=50
ENV SESSION_TIMEOUT=3600
ENV MAX_SEARCH_RESULTS=5
ENV LOG_LEVEL=INFO

WORKDIR /app

# Create a non-privileged user that the app will run under.
# See https://docs.docker.com/go/dockerfile-user-best-practices/
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser


# Copy requirements and install dependencies
COPY requirements.txt ./
RUN --mount=type=cache,target=/root/.cache/pip \
    python -m pip install --upgrade pip \
    && python -m pip install -r requirements.txt


# Copy the source code into the container
COPY . .

# Switch to the non-privileged user to run the application
USER appuser

# Expose the port that the application listens on
EXPOSE 8001

# Run the FastAPI app using uvicorn
CMD ["uvicorn", "main:app", "--host=0.0.0.0", "--port=8001"]
