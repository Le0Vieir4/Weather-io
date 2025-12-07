# Weather-IO Consumer 🌦️

A Go-based RabbitMQ consumer that processes weather data messages and forwards them to a NestJS API.

## 📋 Overview

This service consumes weather data from a RabbitMQ queue, transforms the data by rounding temperature and UV values, and sends the processed data to a NestJS backend API.

## 🚀 Features

- **RabbitMQ Integration**: Consumes messages from the `weather` queue
- **Data Transformation**: 
  - Rounds temperatures to the nearest integer
  - Rounds UV index to 1 decimal place
  - Validates precipitation probability (ensures non-negative values)
- **HTTP POST**: Sends transformed data to NestJS API
- **Automatic Retry**: Implements connection retry logic for RabbitMQ (up to 10 attempts)
- **Docker Support**: Includes multi-stage Dockerfile for optimized builds

## 📦 Dependencies

```go
github.com/rabbitmq/amqp091-go v1.10.0
```

See `go.mod` for the complete list of dependencies.

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEST_URL` | NestJS API base URL | `http://localhost:3000/` |
| `RABBIT_URL` | RabbitMQ connection URL | `amqp://guest:guest@localhost:5672/` |

## 📊 Data Structures

### Input (from RabbitMQ)
```json
{
  "location": {
    "city": "São Paulo",
    "latitude": -23.5505,
    "longitude": -46.6333,
    "timezone": "America/Sao_Paulo",
    "pastDays": 0
  },
  "current": {
    "time": "2025-12-07T10:00",
    "temperature": 25.5,
    "relativeHumidity": 65.0,
    "apparentTemperature": 27.3,
    "isDay": true,
    "uv": 8.55,
    "precipitationProbability": 20,
    "weatherCode": "Partly Cloudy"
  },
  "daily": [
    {
      "date": "09/12/2025",
      "temperatureMax": 33.99,
      "temperatureMin": 23.34,
      "apparentTemperatureMax": 37.28,
      "apparentTemperatureMin": 27.23,
      "uvIndexMax": 8.55,
      "precipitationProbability": 28,
      "weatherCode": "Cloudy"
    }
  ],
  "aiInsight": "AI-generated weather insights..."
}
```

### Output (to NestJS API)
```json
{
  "time": "2025-12-07T10:00 - America/Sao_Paulo",
  "city": "São Paulo",
  "current": [
    {
      "time": "2025-12-07T10:00",
      "temperature": 26.0,
      "relativeHumidity": 65.0,
      "apparentTemperature": 27.0,
      "isDay": true,
      "uv": 8.6,
      "precipitationProbability": 20,
      "weatherCode": "Partly Cloudy"
    }
  ],
  "daily": [
    {
      "date": "09/12/2025",
      "temperatureMax": 34.0,
      "temperatureMin": 23.0,
      "apparentTemperatureMax": 37.0,
      "apparentTemperatureMin": 27.0,
      "uvIndexMax": 8.6,
      "precipitationProbability": 28,
      "weatherCode": "Cloudy"
    }
  ],
  "aiInsight": "AI-generated weather insights..."
}
```

## 🛠️ Development

### Prerequisites
- Go 1.23+
- RabbitMQ server
- NestJS API endpoint

### Running Locally

1. **Install dependencies:**
   ```bash
   go mod download
   ```

2. **Set environment variables:**
   ```bash
   export NEST_URL="http://localhost:3000/"
   export RABBIT_URL="amqp://guest:guest@localhost:5672/"
   ```

3. **Run the consumer:**
   ```bash
   go run main.go transformData.go
   ```

### Building

```bash
go build -o consumer main.go transformData.go
```

## 🐳 Docker

### Build Image
```bash
docker build -t weather-consumer .
```

### Run Container
```bash
docker run -e NEST_URL="http://api:3000/" \
           -e RABBIT_URL="amqp://guest:guest@rabbitmq:5672/" \
           weather-consumer
```

## 📁 Project Structure

```
.
├── Dockerfile              # Multi-stage Docker build
├── README.md              # This file
├── go.mod                 # Go module dependencies
├── go.sum                 # Dependency checksums
├── main.go                # Main application entry point
└── transformData.go       # Data transformation logic
```

## 🔄 Data Transformation Logic

The `transformData` function applies the following transformations:

### Current Weather
- **Temperature**: Rounded to nearest integer using `math.Round()`
- **Apparent Temperature**: Rounded to nearest integer
- **UV Index**: Rounded to 1 decimal place

### Daily Forecast
- **All Temperatures**: Rounded to nearest integer
- **UV Index Max**: Rounded to 1 decimal place
- **Precipitation Probability**: Validated to be non-negative

## 🐛 Error Handling

- **Connection Errors**: Automatic retry with 5-second intervals (max 10 attempts)
- **Invalid JSON**: Logged and skipped, processing continues
- **API Errors**: Logged and skipped, processing continues

## 📝 Logging

The consumer logs the following events:
- ✅ Successful message reception
- ✅ Successful API transmission
- ❌ Connection failures (with retry attempts)
- ❌ JSON parsing errors
- ❌ API communication errors

## 🤝 Integration

This service is part of the Weather-IO ecosystem:
- **Input**: Receives data from Python producer via RabbitMQ
- **Output**: Sends processed data to NestJS API for storage/presentation

## 📄 License

[Add your license here]

## 👥 Authors

[Add authors/contributors here]
