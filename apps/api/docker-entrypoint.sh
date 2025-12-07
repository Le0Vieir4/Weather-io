#!/bin/sh
set -e

echo "🚀 Iniciando aplicação..."

# Aguardar o banco de dados estar pronto (opcional, mas recomendado)
echo "⏳ Aguardando banco de dados..."
sleep 5

# Executar script de inicialização do admin
echo "👤 Inicializando admin..."
pnpm run init-admin

# Iniciar a aplicação
echo "▶️  Iniciando servidor..."
exec "$@"
