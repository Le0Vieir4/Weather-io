from dotenv import load_dotenv
import json
import time
import pika
import schedule
import os
from data import data

load_dotenv()  # Carrega as variáveis do arquivo .env

# Salva variáveis na memória
host = os.getenv('RABBIT_HOST')
port = int(os.getenv('RABBIT_PORT'))
user = os.getenv('RABBIT_USER')
password = os.getenv('RABBIT_PASS')

cred = pika.PlainCredentials(user, password)

def send():
    # Loop para tentar conectar ao RabbitMQ.
    # Evita erro caso o serviço ainda não tenha iniciado.
    for _ in range(10):
        try:
            conn = pika.BlockingConnection(
                pika.ConnectionParameters(host=host, port=port, credentials=cred)
            )
            print("✔️ Conectado ao RabbitMQ")
            break
        except Exception as e:
            print(f"❌ Tentativa {_+1}/10 - erro: {e}")
            time.sleep(2)

    ch = conn.channel()  # Abre um canal AMQP
    
    # Declara a fila que receberá as mensagens do clima
    ch.queue_declare(queue='weather', durable=True, exclusive=False, auto_delete=False)
    
    # Recupera o JSON gerado no módulo data.py
    payload = data()
    
    # Converte o JSON para bytes antes de enviar
    payload = payload.encode("utf-8")
    
    # Publica a mensagem na fila
    ch.basic_publish(exchange='', routing_key='weather', body=payload)
    print("✔️ Mensagem enviada com sucesso")

    conn.close()  # Fecha a conexão

send()
print("Aguardando 1 hr para a próxima consulta...")

# Worker que faz a consulta na API e envia para a fila periodicamente
schedule.every(20).seconds.do(send)

while True:
    schedule.run_pending()
    time.sleep(1)
