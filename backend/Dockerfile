# Build the Flask back-end
FROM python:3.12-slim

ENV PYTHONFAULTHANDLER=1 \
  PYTHONUNBUFFERED=1 \
  PYTHONHASHSEED=random \
  PIP_NO_CACHE_DIR=off \
  PIP_DISABLE_PIP_VERSION_CHECK=on \
  PIP_DEFAULT_TIMEOUT=100 \
  TESSERACT_PATH="/usr/bin/tesseract"

RUN apt-get update --fix-missing \
  && apt-get -y install tesseract-ocr \
  && apt-get -y install ffmpeg libsm6 libxext6

# System deps
RUN pip install gunicorn

WORKDIR /backend

# Copy local code to the container image
COPY requirements.txt ./

# Install production dependencies
RUN pip install -r requirements.txt

COPY ./ ./

EXPOSE 5000
CMD gunicorn main:app \
  --name backend \
  --bind 0.0.0.0:5000 \
  --timeout 3600 \
  --workers 4 \
  --log-level=info \
  --reload