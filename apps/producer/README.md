# 🌦️ Weather Producer — OpenMeteo → RabbitMQ

Este serviço realiza consultas periódicas à API do **Open-Meteo**, formata os dados meteorológicos da cidade de **Itaguaí – RJ**, e envia o payload como mensagem para uma fila no **RabbitMQ**.

O objetivo é permitir que outros serviços (consumidores) processem, armazenem e exibam os dados do clima.

---

## 📁 Estrutura do Projeto

```
/weather-producer
│
├── data.py            # Consulta a API e gera o payload JSON
├── main.py            # Worker que envia dados ao RabbitMQ
├── .env               # Variáveis sensíveis (RabbitMQ)
├── requirements.txt
└── README.md
```

---

## 🔧 Tecnologias Utilizadas

* Python 3.10+
* Open-Meteo API
* openmeteo-requests (wrapper oficial)
* RabbitMQ + pika
* schedule (tarefas periódicas)
* python-dotenv (variáveis de ambiente)
* requests_cache (cache de requisições)
* retry_requests (repetição automática)

---

## 🔐 Arquivo `.env`

Crie um arquivo `.env` na raiz do projeto:

```
RABBIT_HOST=seu_host
RABBIT_PORT=5672
RABBIT_USER=usuario
RABBIT_PASS=senha
```

---

## 📦 Instalação das dependências

```
pip install -r requirements.txt
```

### Exemplo de `requirements.txt`:

```
pika
python-dotenv
schedule
openmeteo-requests
requests-cache
retry-requests
```

---

## ⛅ Como funciona o módulo `data.py`

O módulo `data.py` é responsável por:

1. Fazer a requisição à API do Open-Meteo.
2. Extrair os dados atuais (`current`) e diários (`daily`).
3. Formatar todos os dados em um objeto JSON estruturado.
4. Retornar o JSON como **string**.

### Função pública:

```python
payload = data()
```

Ela **não** envia nada, apenas gera e retorna o payload.

---

## 📨 Como funciona o módulo `main.py`

O arquivo `main.py` é o worker responsável por:

* Conectar ao RabbitMQ.
* Gerar automaticamente o payload chamando a função `data()`.
* Publicar a mensagem JSON na fila `weather`.
* Repetir essa operação periodicamente.

### Funcionamento interno:

* Tenta conectar ao RabbitMQ por até **10 tentativas** antes de falhar.
* Declara (ou verifica) a fila `weather`.
* Obtém o JSON chamando `data()`.
* Converte o JSON para bytes (UTF-8).
* Envia para a fila.
* Aguarda o próximo ciclo agendado.

### Agendamento padrão

```python
schedule.every(20).seconds.do(send)
```

Você pode trocar para:

```python
schedule.every().hour.do(send)
```

---

## 📤 Publicação no RabbitMQ

A mensagem enviada contém uma estrutura semelhante a:

```
{
  "location": {
    "city": "Itaguaí-Rj",
    "latitude": -22.8765,
    "longitude": -43.777,
    "timezone": "America/Sao_Paulo"
  },
  "current": {
    "time": "2025-11-27 10:15:30",
    "temperature": 29,
    "apparentTemperature": 33,
    "relativeHumidity": 65,
    "isDay": true,
    "precipitationMm": 0.0,
    "rainMm": 0.0,
    "rainProbability": 0
  },
  "daily": {
    "temperatureMax": 31,
    "temperatureMin": 22,
    "apparentTemperatureMax": 35,
    "apparentTemperatureMin": 21,
    "uvIndexMax": 8,
    "rainSum": 0.0
  }
}
```

---

## ▶️ Executando o serviço

```
python main.py
```

### Saída esperada:

```
✔️ Conectado ao RabbitMQ
✔️ Mensagem enviada com sucesso
Aguardando 1 hr para a próxima consulta...
```

---

## 🔍 Logs úteis

O sistema exibe:

* Conexão estabelecida com o RabbitMQ
* Tentativas de reconexão
* Mensagens enviadas
* Tempo até o próximo envio

---

## 🧩 Possíveis Melhorias Futuras

* Logging estruturado (JSON)
* Retry da publicação (além da conexão)
* Suporte a Dead Letter Queue (DLQ)
* Métricas Prometheus
* Consumidor para armazenar dados em PostgreSQL ou MongoDB

---

## 📜 Licença

Projeto livre para uso pessoal e comercial.
