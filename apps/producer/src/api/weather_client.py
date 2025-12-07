# Weather API Client Module
import openmeteo_requests
import requests_cache
from retry_requests import retry
import logging
from config.settings import OPEN_METEO_URL, CACHE_EXPIRE_SECONDS

logger = logging.getLogger(__name__)

class WeatherAPIClient:
    # Client for OpenMeteo weather API    
    def __init__(self):
        # Initialize API client with caching and retry mechanism
        cache_session = requests_cache.CachedSession('.cache', expire_after=CACHE_EXPIRE_SECONDS)
        retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
        self.client = openmeteo_requests.Client(session=retry_session)
        logger.info("Weather API client initialized")
    
    def fetch_weather_data(self, params):
        # Fetch weather data from API
        try:
            logger.debug(f"Fetching weather data with params: {params}")
            response = self.client.weather_api(OPEN_METEO_URL, params=params)
            logger.info("Weather data fetched successfully")
            return response[0]
        except Exception as e:
            logger.error(f"Error fetching weather data: {e}")
            raise
