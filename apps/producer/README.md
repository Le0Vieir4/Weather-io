# 🌤️ Weather-IO Producer

A professional weather data collection and distribution system that fetches weather data from Open-Meteo API, generates AI-powered insights, and publishes to RabbitMQ.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Development](#development)
- [Testing](#testing)
- [Docker](#docker)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- 🌍 **Real-time Weather Data** - Fetches current weather and forecasts from Open-Meteo API
- 🤖 **AI-Powered Insights** - Generates intelligent weather alerts using OpenAI GPT-4
- 📊 **Multiple Export Formats** - Exports data to CSV and Excel with formatting
- 🐰 **RabbitMQ Integration** - Publishes weather data to message queue
- ⏰ **Scheduled Updates** - Automatic data collection every 5 minutes
- 💡 **Smart Scheduling** - AI insights generated every hour to optimize API usage
- 📝 **Structured Logging** - Comprehensive logging system
- 🔄 **Retry Mechanism** - Automatic retry with exponential backoff
- 🗂️ **Clean Architecture** - Modular, testable, and maintainable code

## 🏗️ Architecture

```
┌─────────────────┐
│  Open-Meteo API │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│ Weather Service │─────▶│  OpenAI API  │
└────────┬────────┘      └──────────────┘
         │
         ├──────────┐
         │          │
         ▼          ▼
┌─────────────┐  ┌──────────────┐
│  RabbitMQ   │  │ Export Files │
│   Queue     │  │  (CSV/Excel) │
└─────────────┘  └──────────────┘
```

## 📁 Project Structure

```
apps/producer/
├── config/                      # Configuration files
│   ├── settings.py             # Application settings
│   └── logging_config.py       # Logging configuration
├── src/
│   ├── api/                    # External API clients
│   │   └── weather_client.py  # Open-Meteo API client
│   ├── services/               # Business logic
│   │   ├── weather_service.py # Weather data processing
│   │   ├── ai_service.py      # AI insights generation
│   │   └── export_service.py  # CSV/Excel export
│   ├── messaging/              # RabbitMQ integration
│   │   └── publisher.py       # Message publisher
│   ├── models/                 # Data models
│   │   └── weather_data.py    # Weather data schemas
│   └── utils/                  # Utilities
│       ├── parsers.py         # Weather code parser
│       └── validators.py      # Data validation
├── exports/                    # Generated export files
│   ├── csv/
│   └── excel/
├── logs/                       # Application logs
├── tests/                      # Unit tests
├── main.py                     # Application entry point
├── requirements.txt            # Production dependencies
├── requirements-dev.txt        # Development dependencies
├── .env.example               # Environment variables template
├── Dockerfile                 # Docker configuration
└── README.md                  # This file
```

## 🚀 Installation

### Prerequisites

- Python 3.11+
- RabbitMQ server
- OpenAI API key

### Steps

1. **Clone the repository**
   ```bash
   cd apps/producer
   ```

2. **Create virtual environment**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# RabbitMQ Configuration
RABBIT_HOST=localhost
RABBIT_PORT=5672
RABBIT_USER=guest
RABBIT_PASS=guest

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
```

### Application Settings

Edit `config/settings.py` to customize:

```python
# Location settings
LOCATION = {
    "city": "Itaguaí-Rj",
    "latitude": -22.8765,
    "longitude": -43.7770,
    "timezone": "America/Sao_Paulo"
}

# Schedule settings
SCHEDULE = {
    "weather_data_interval": 5,      # Minutes
    "ai_insights_interval": 60       # Minutes
}
```

## 💻 Usage

### Run the Producer

```bash
python main.py
```

The application will:
- ✅ Connect to RabbitMQ
- ✅ Fetch weather data every 5 minutes
- ✅ Generate AI insights every hour
- ✅ Export data to CSV and Excel
- ✅ Publish to RabbitMQ queue

### Manual Data Fetch

```python
from src.services.weather_service import WeatherService

weather_service = WeatherService()

# Get weather data without AI insight
data = weather_service.get_weather_data(include_ai_insight=False)

# Get weather data with AI insight
data_with_insight = weather_service.get_weather_data(include_ai_insight=True)
```

### Generate Exports

```python
from src.services.export_service import ExportService

export_service = ExportService()

# Export to CSV
export_service.export_csv(weather_json)

# Export to Excel with formatting
export_service.export_excel(weather_json)
```

## 📡 API Reference

### Weather Data Structure

```json
{
  "location": {
    "city": "Itaguaí-Rj",
    "latitude": -22.8765,
    "longitude": -43.7770,
    "timezone": "America/Sao_Paulo"
  },
  "current": {
    "time": "06/12/2025 10:30:00",
    "temperature": 28.5,
    "relativeHumidity": 65.0,
    "apparentTemperature": 30.2,
    "isDay": true,
    "uv": 8.5,
    "weatherCode": "Céu limpo",
    "precipitationProbability": 10
  },
  "daily": [
    {
      "date": "06/12/2025",
      "temperatureMax": 32.0,
      "temperatureMin": 22.0,
      "apparentTemperatureMax": 34.5,
      "apparentTemperatureMin": 23.1,
      "uvIndexMax": 9.0,
      "precipitationProbability": 15,
      "weatherCode": "Parcialmente nublado"
    }
  ],
  "pastDays": 30,
  "aiInsight": "High UV index expected - use sunscreen"
}
```

### Weather Codes

| Code | Description (PT) | Description (EN) |
|------|------------------|------------------|
| 0 | Céu limpo | Clear sky |
| 1-2 | Parcialmente nublado | Partly cloudy |
| 3 | Nublado | Overcast |
| 45, 48 | Neblina | Fog |
| 51-57 | Chuvisco | Drizzle |
| 61-82 | Chuva | Rain |
| 71-86 | Neve | Snow |
| 95-99 | Tempestade | Thunderstorm |

## 🔧 Development

### Install Development Dependencies

```bash
pip install -r requirements-dev.txt
```

### Code Style

The project follows PEP 8 guidelines with:
- Clean code principles
- Type hints where applicable
- Comprehensive docstrings
- Modular architecture

### Adding a New Service

1. Create service file in `src/services/`
2. Implement service class
3. Add configuration in `config/settings.py`
4. Update `main.py` to use the service
5. Add tests in `tests/`

## 🧪 Testing

### Run Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src

# Run specific test file
pytest tests/test_weather_service.py
```

### Test Structure

```python
# tests/test_weather_service.py
import pytest
from src.services.weather_service import WeatherService

def test_get_weather_data():
    service = WeatherService()
    data = service.get_weather_data()
    assert data is not None
    assert "location" in data
    assert "current" in data
```

## 🐳 Docker

### Build Image

```bash
docker build -t weather-producer .
```

### Run Container

```bash
docker run -d \
  --name weather-producer \
  --env-file .env \
  weather-producer
```

### Docker Compose

```yaml
version: '3.8'
services:
  producer:
    build: .
    env_file: .env
    depends_on:
      - rabbitmq
    restart: unless-stopped
```

## 🔍 Troubleshooting

### Common Issues

**RabbitMQ Connection Error**
```
Solution: Ensure RabbitMQ is running and credentials are correct
```

**OpenAI API Error**
```
Solution: Check API key is valid and you have sufficient credits
```

**Module Import Error**
```
Solution: Ensure you're in the virtual environment and dependencies are installed
```

### Logging

Logs are stored in `logs/` directory:
- `app.log` - Application logs
- Check logs for detailed error messages

### Debug Mode

Enable debug logging in `config/logging_config.py`:

```python
logging.basicConfig(
    level=logging.DEBUG,  # Change from INFO to DEBUG
    ...
)
```

## 📊 Monitoring

### Health Checks

The application logs:
- ✅ Successful data fetches
- ✅ RabbitMQ connection status
- ✅ Export file generation
- ❌ Errors and exceptions

### Metrics

Monitor:
- API call frequency
- Message queue depth
- Export file size
- Error rates

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is part of the Weather-IO system.

## 🙏 Acknowledgments

- **Open-Meteo** - Free weather API
- **OpenAI** - GPT-4 for AI insights
- **RabbitMQ** - Message queue system

## 📧 Contact

For questions or support, please open an issue in the repository.

---
**Made with ☀️ by @Leo**
