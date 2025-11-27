import openmeteo_requests
import requests_cache
from retry_requests import retry
from datetime import datetime
import json


cache_session = requests_cache.CachedSession('.cache', expire_after=3600) # chama o instancia o cache da sessao e define um tempo de expirar o cache
retry_session = retry(cache_session, retries=5, backoff_factor=0.2) # chama o retry da api, passando o cache e o retries para tentar forçar a reconexão
openmeteo = openmeteo_requests.Client(session=retry_session) # instancia o client e faz o request pra api iniciando a sessão
def data():
    # define a url de chamada da api e os parametros
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": -22.8765,
        "longitude": -43.7770,
        "daily": [
            "temperature_2m_max",
            "temperature_2m_min",
            "apparent_temperature_max",
            "apparent_temperature_min",
            "uv_index_max",
            "rain_sum"
        ],
        "current": [
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "is_day",
            "precipitation",
            "rain"
        ],
        "timezone": "America/Sao_Paulo",
        "models": "best_match"
    }
    # faz a chamada da api utilizando os parametros definidos na variavel
    res = openmeteo.weather_api(url, params=params)[0]
    current = res.Current() # recebe os dados atuais 
    daily = res.Daily() # recebe os dado diarios

    # Obtém a data/hora atual e formata no padrão brasileiro: DD/MM/YYYY HH:MM:SS
    now = datetime.now()
    current_time = now.strftime("%d/%m/%Y %H:%M:%S")

    # Converte todo os valores para o tipo compativel do python
    def py(v):
        """Converte float32, int32 ou numpy para tipos nativos Python."""
        if hasattr(v, "item"):
            return v.item()  # numpy.float32 -> float
        return v

    rain_mm = py(current.Variables(5).Value())
    rain_probability = min(int(rain_mm * 25), 100)

    # cria a varivel pra armazenar os dados no formato json com as variaveis ja sendo formatadas
    payload = {
        "location": {
            "city": "Itaguaí-Rj",
            "latitude": params["latitude"],
            "longitude": params["longitude"],
            "timezone": params["timezone"]
        },
        "current": {
            "time": current_time,
            "temperature": int(py(current.Variables(0).Value())),
            "apparentTemperature": int(py(current.Variables(2).Value())),
            "relativeHumidity": int(py(current.Variables(1).Value())),
            "isDay": bool(py(current.Variables(3).Value())),
            "precipitationMm": float(py(current.Variables(4).Value())),
            "rainMm": float(rain_mm),
            "rainProbability": int(rain_probability)
        },
        "daily": {
            "temperatureMax": int(py(daily.Variables(0).ValuesAsNumpy()[0])),
            "temperatureMin": int(py(daily.Variables(1).ValuesAsNumpy()[0])),
            "apparentTemperatureMax": int(py(daily.Variables(2).ValuesAsNumpy()[0])),
            "apparentTemperatureMin": int(py(daily.Variables(3).ValuesAsNumpy()[0])),
            "uvIndexMax": int(py(daily.Variables(4).ValuesAsNumpy()[0])),
            "rainSum": float(py(daily.Variables(5).ValuesAsNumpy()[0]))
        }
    }
    payload = json.dumps(payload, ensure_ascii=False, indent=2) # faz a serialização do objeto para o formato json(STR) 
    return payload 
data()
