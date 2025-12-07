# RabbitMQ Publisher Module
import pika
import time
import logging
from config.settings import RABBITMQ

logger = logging.getLogger(__name__)

class RabbitMQPublisher:
    def __init__(self):
        # Initialize RabbitMQ publisher
        self.config = RABBITMQ
        self.credentials = pika.PlainCredentials(
            self.config["user"],
            self.config["password"]
        )
        logger.info("RabbitMQ publisher initialized")
    
    def connect(self, max_retries=10):
        # Connect to RabbitMQ with retries
        for attempt in range(1, max_retries + 1):
            try:
                connection = pika.BlockingConnection(
                    pika.ConnectionParameters(
                        host=self.config["host"],
                        port=self.config["port"],
                        credentials=self.credentials
                    )
                )
                channel = connection.channel()
                logger.info(f"Connected to RabbitMQ on attempt {attempt}")
                return connection, channel
                
            except Exception as e:
                logger.warning(f"Connection attempt {attempt}/{max_retries} failed: {e}")
                if attempt < max_retries:
                    time.sleep(2)
                    
        logger.error("Failed to connect to RabbitMQ after all retries")
        return None, None
    
    def publish(self, message, queue=None):
        # Publish message to RabbitMQ
        queue_name = queue or self.config["queue"]
        
        connection, channel = self.connect()
        if not connection or not channel:
            return False
        
        try:
            # Declare queue
            channel.queue_declare(
                queue=queue_name,
                durable=True,
                exclusive=False,
                auto_delete=False
            )
            
            # Publish message
            channel.basic_publish(
                exchange='',
                routing_key=queue_name,
                body=message.encode("utf-8")
            )
            
            logger.info(f"Message published to queue '{queue_name}'")
            return True
            
        except Exception as e:
            logger.error(f"Error publishing message: {e}")
            return False
            
        finally:
            if connection:
                connection.close()
