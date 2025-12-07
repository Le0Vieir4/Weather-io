import json
import logging
from openai import OpenAI
from config.settings import OPENAI_API_KEY, OPENAI_MODEL

logger = logging.getLogger(__name__)

class AIService:
    # Service for AI-powered weather insights
    
    def __init__(self):
        # Initialize AI service
        self.client = OpenAI(api_key=OPENAI_API_KEY)
        logger.info("AI service initialized")
    
    def generate_insight(self, weather_data):
        # Generate a short weather insight in Portuguese
        logger.info("Generating AI insight")
        
        current = weather_data["current"]
        daily = weather_data["daily"][:3]
        
        prompt = f"""
Analise os dados meteorológicos e gere APENAS UMA FRASE curta com um alerta ou recomendação importante.

DADOS ATUAIS:
- Temperatura: {current["temperature"]}°C
- Umidade: {current["relativeHumidity"]}%
- Índice UV: {current["uv"]}
- Condição: {current["weatherCode"]}
- Probabilidade de Chuva: {current["precipitationProbability"]}%

PRÓXIMOS 3 DIAS:
{json.dumps(daily, indent=2, ensure_ascii=False)}

Retorne apenas UMA frase objetiva (máximo 15 palavras) com um alerta ou recomendação útil.
Exemplos: "Alto índice UV - use protetor solar" ou "Chuva prevista amanhã - leve guarda-chuva"
"""

        try:
            response = self.client.chat.completions.create(
                model=OPENAI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "Você é um assistente meteorológico que fornece alertas curtos e objetivos em português brasileiro."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=50
            )
            insight = response.choices[0].message.content.strip()
            logger.info(f"AI insight generated: {insight}")
            return insight
            
        except Exception as e:
            logger.error(f"Error generating AI insight: {e}")
            return "Condições normais - sem alertas especiais"
