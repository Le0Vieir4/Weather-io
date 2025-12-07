# Imagem base leve do Python
FROM python:3.11-slim

# Define diretório da aplicação
WORKDIR /app

# Define o timezone do container para São Paulo
ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Instala dependências do sistema necessárias (certificados SSL, etc)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    tzdata \
    && rm -rf /var/lib/apt/lists/*

# Copia apenas o requirements primeiro para melhor cache
COPY requirements.txt .

# Instala dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do projeto
COPY . .

# Expõe a porta do Flask API server
EXPOSE 5000

# Define o entrypoint do serviço
CMD ["python", "main.py"]
