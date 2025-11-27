# Imagem base leve do Python
FROM python:3.11-slim

# Define diretório da aplicação
WORKDIR /app

# Instala dependências do sistema necessárias (certificados SSL, etc)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copia apenas o requirements primeiro para melhor cache
COPY requirements.txt .

# Instala dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do projeto
COPY . .

# Expõe nenhuma porta porque esse serviço é um worker (não é servidor HTTP)
# EXPOSE 8000  # (não necessário)

# Define o entrypoint do serviço
CMD ["python", "main.py"]
