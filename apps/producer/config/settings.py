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
RABBIT_URL = os.getenv('RABBIT_URL', 'amqp://admin:admin@rabbitmq:5672')

# Parse URL ou usar variáveis individuais
if RABBIT_URL and RABBIT_URL.startswith('amqp://'):
    # Parsear URL completa: amqp://user:pass@host:port
    from urllib.parse import urlparse
    parsed = urlparse(RABBIT_URL)
    
    RABBITMQ = {
        "host": parsed.hostname or "rabbitmq",
        "port": parsed.port or 5672,
        "user": parsed.username or "admin",
        "password": parsed.password or "admin",
        "queue": "weather",
        "url": RABBIT_URL
    }
else:
    # Fallback para variáveis individuais (retrocompatibilidade)
    RABBITMQ = {
        "host": os.getenv('RABBIT_HOST', 'rabbitmq'),
        "port": int(os.getenv('RABBIT_PORT', 5672)),
        "user": os.getenv('RABBIT_USER', 'admin'),
        "password": os.getenv('RABBIT_PASS', 'admin'),
        "queue": "weather",
        "url": None
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
