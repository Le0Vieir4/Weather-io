# Weather Producer - Main Entry Point
import schedule
import time
import logging

from config.logging_config import setup_logging
from config.settings import SCHEDULE
from src.services.weather_service import WeatherService
from src.services.export_service import ExportService
from src.messaging.publisher import RabbitMQPublisher

# Setup logging
logger = setup_logging()

# Initialize services
weather_service = WeatherService()
export_service = ExportService()
publisher = RabbitMQPublisher()

def send_weather_data():
    # Send weather data without AI insight
    try:
        logger.info("Sending weather data")
        
        # Get weather data
        weather_json = weather_service.get_weather_data(include_ai_insight=False)
        
        # Publish to RabbitMQ
        publisher.publish(weather_json)
        
        # Generate exports
        export_service.export_csv(weather_json)
        export_service.export_excel(weather_json)
        
    except Exception as e:
        logger.error(f"Error sending weather data: {e}")

def send_weather_data_with_insight():
    # Send weather data with AI insight
    try:
        logger.info("Sending weather data with AI insight")
        
        # Get weather data with AI insight
        weather_json = weather_service.get_weather_data(include_ai_insight=True)
        
        # Publish to RabbitMQ
        publisher.publish(weather_json)
        
        # Generate exports
        export_service.export_csv(weather_json)
        export_service.export_excel(weather_json)
        
    except Exception as e:
        logger.error(f"Error sending weather data with insight: {e}")

def main():
    # Main application loop
    logger.info("=== Weather Producer Started ===")
    logger.info(f"Schedule: Data every {SCHEDULE['data_interval_minutes']} min, Insights every {SCHEDULE['insight_interval_hours']} hour")
    
    # Initial run with insight
    send_weather_data_with_insight()
    
    # Schedule tasks
    schedule.every(SCHEDULE["data_interval_minutes"]).minutes.do(send_weather_data)
    schedule.every(SCHEDULE["insight_interval_hours"]).hours.do(send_weather_data_with_insight)
    
    # Run scheduler
    while True:
        schedule.run_pending()
        time.sleep(1)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        logger.info("=== Weather Producer Stopped ===")
    except Exception as e:
        logger.critical(f"Critical error: {e}", exc_info=True)
