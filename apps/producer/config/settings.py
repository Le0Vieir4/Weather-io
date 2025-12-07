"""Application settings and configuration"""
import os
from dotenv import load_dotenv

load_dotenv()

# Location settings
LOCATION = {
    "city": "Itaguaí-Rj",
    "latitude": -22.8765,
    "longitude": -43.7770,
    "timezone": "America/Sao_Paulo"
}

# API settings
OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"
PAST_DAYS = 30

# RabbitMQ settings
RABBITMQ = {
    "host": os.getenv('RABBIT_HOST'),
    "port": os.getenv('RABBIT_PORT'),
    "user": os.getenv('RABBIT_USER'),
    "password": os.getenv('RABBIT_PASS'),
    "queue": "weather"
}

# OpenAI settings
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = "gpt-4o-mini"

# Schedule settings
SCHEDULE = {
    "data_interval_minutes": 5,
    "insight_interval_hours": 1
}

# Export settings
EXPORT_PATHS = {
    "csv": "exports/csv",
    "excel": "exports/excel"
}

# Cache settings
CACHE_EXPIRE_SECONDS = 3600
