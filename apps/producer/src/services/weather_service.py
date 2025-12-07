# Weather data service - main business logic
import pandas as pd
from datetime import datetime
from zoneinfo import ZoneInfo
import json
import numpy as np
import logging

from src.api.weather_client import WeatherAPIClient
from src.utils.parsers import parse_weather_code, convert_numpy_to_python
from config.settings import LOCATION, PAST_DAYS

logger = logging.getLogger(__name__)

class WeatherService:
    # Service for processing weather data
    
    def __init__(self):
        #Initialize weather service
        self.api_client = WeatherAPIClient()
        logger.info("Weather service initialized")
    
    def get_weather_data(self, include_ai_insight=False):
        # Fetch and process weather data
        logger.info(f"Fetching weather data (AI insight: {include_ai_insight})")
        
        params = self._build_api_params()
        response = self.api_client.fetch_weather_data(params)
        
        hourly = response.Hourly()
        current = response.Current()
        daily = response.Daily()
        
        now = datetime.now(ZoneInfo(LOCATION["timezone"]))
        current_time = now.strftime("%d/%m/%Y %H:%M:%S")
        
        # Process hourly precipitation
        current_precip_prob = self._get_current_precipitation(hourly, now)
        
        # Process daily data
        daily_data = self._process_daily_data(daily)
        
        # Build payload
        payload = {
            "location": LOCATION,
            "current": {
                "time": current_time,
                "temperature": float(convert_numpy_to_python(current.Variables(0).Value())),
                "relativeHumidity": float(convert_numpy_to_python(current.Variables(1).Value())),
                "apparentTemperature": float(convert_numpy_to_python(current.Variables(2).Value())),
                "isDay": bool(convert_numpy_to_python(current.Variables(3).Value())),
                "uv": float(convert_numpy_to_python(current.Variables(4).Value())),
                "weatherCode": parse_weather_code(int(convert_numpy_to_python(current.Variables(5).Value()))),
                "precipitationProbability": current_precip_prob
            },
            "daily": daily_data,
            "pastDays": PAST_DAYS
        }
        
        # Add AI insight if requested
        if include_ai_insight:
            payload = self._add_ai_insight(payload)
        
        logger.info("Weather data processed successfully")
        return json.dumps(payload, ensure_ascii=False, indent=2)
    
    def _build_api_params(self):
        # Build API request parameters
        return {
            "latitude": LOCATION["latitude"],
            "longitude": LOCATION["longitude"],
            "past_days": PAST_DAYS,
            "hourly": "precipitation_probability",
            "daily": [
                "temperature_2m_max",
                "temperature_2m_min",
                "apparent_temperature_max",
                "apparent_temperature_min",
                "uv_index_max",
                "precipitation_probability_mean",
                "weather_code"
            ],
            "current": [
                "temperature_2m",
                "relative_humidity_2m",
                "apparent_temperature",
                "is_day",
                "uv_index",
                "weather_code"
            ],
            "timezone": LOCATION["timezone"],
            "models": "best_match"
        }
    
    def _get_current_precipitation(self, hourly, now):
        # Get current hour precipitation probability
        hourly_length = hourly.Variables(0).ValuesLength()
        hourly_start = pd.to_datetime(hourly.Time(), unit="s", utc=True).tz_convert(LOCATION["timezone"])
        hourly_times = [hourly_start + pd.Timedelta(hours=i) for i in range(hourly_length)]
        hourly_precip_probs = hourly.Variables(0).ValuesAsNumpy()
        
        current_hour = now.replace(minute=0, second=0, microsecond=0)
        
        for i, hour_time in enumerate(hourly_times):
            if hour_time.replace(tzinfo=None) == current_hour.replace(tzinfo=None):
                return int(hourly_precip_probs[i]) if not np.isnan(hourly_precip_probs[i]) else 0
        
        return 0
    
    def _process_daily_data(self, daily):
        # Process daily forecast data
        length = daily.Variables(0).ValuesLength()
        start = pd.to_datetime(daily.Time(), unit="s")
        dates = [start + pd.Timedelta(days=i) for i in range(length)]
        
        temp_max = daily.Variables(0).ValuesAsNumpy()
        temp_min = daily.Variables(1).ValuesAsNumpy()
        apparent_max = daily.Variables(2).ValuesAsNumpy()
        apparent_min = daily.Variables(3).ValuesAsNumpy()
        uv_index = daily.Variables(4).ValuesAsNumpy()
        rain_probability = daily.Variables(5).ValuesAsNumpy()
        daily_weather_codes = daily.Variables(6).ValuesAsNumpy()
        
        daily_data = []
        for i in range(length):
            rain_prob = 0 if np.isnan(rain_probability[i]) else int(rain_probability[i])
            
            daily_data.append({
                "date": dates[i].strftime("%d/%m/%Y"),
                "temperatureMax": float(temp_max[i]),
                "temperatureMin": float(temp_min[i]),
                "apparentTemperatureMax": float(apparent_max[i]),
                "apparentTemperatureMin": float(apparent_min[i]),
                "uvIndexMax": float(uv_index[i]),
                "precipitationProbability": rain_prob,
                "weatherCode": parse_weather_code(int(daily_weather_codes[i]))
            })
        
        return daily_data
    
    def _add_ai_insight(self, payload):
        # Add AI-generated insight to payload
        try:
            from src.services.ai_service import AIService
            ai_service = AIService()
            insight = ai_service.generate_insight(payload)
            payload["aiInsight"] = insight
            logger.info(f"AI insight added: {insight}")
        except Exception as e:
            logger.error(f"Failed to add AI insight: {e}")
            payload["aiInsight"] = "No insight available"
        
        return payload

# Backward compatibility
def data(include_ai_insight=False):
    service = WeatherService()
    return service.get_weather_data(include_ai_insight)
