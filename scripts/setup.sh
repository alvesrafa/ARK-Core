#!/bin/bash

set -e

echo "========================================"
echo "  Script de Setup - Projeto Laravel"
echo "========================================"
echo ""

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "Bem-vindo ao setup interativo!"
echo "Este script vai configurar seu projeto."
echo ""

read -p "Nome do projeto: " PROJECT_NAME
PROJECT_NAME="${PROJECT_NAME:-my-project}"

read -p "Descricao do projeto: " PROJECT_DESCRIPTION
PROJECT_DESCRIPTION="${PROJECT_DESCRIPTION:-Projeto Laravel com React}"

echo ""
echo "=== Gerenciamento de Arquivos ==="
echo "1) Local (padrao)"
echo "2) Azure Blob Storage"
echo "3) NFS Volume"
echo "4) AWS S3"
read -p "Escolha (1-4): " FILE_STORAGE_CHOICE

case "$FILE_STORAGE_CHOICE" in
    2) FILE_STORAGE="azure" ;;
    3) FILE_STORAGE="nfs" ;;
    4) FILE_STORAGE="s3" ;;
    *) FILE_STORAGE="local" ;;
esac

if [ "$FILE_STORAGE" == "azure" ]; then
    read -p "Azure Storage Connection String: " AZURE_CONNECTION_STRING
    read -p "Azure Container Name: " AZURE_CONTAINER
elif [ "$FILE_STORAGE" == "nfs" ]; then
    read -p "NFS Server Address: " NFS_SERVER_ADDR
    read -p "NFS Server Path: " NFS_SERVER_PATH
elif [ "$FILE_STORAGE" == "s3" ]; then
    read -p "AWS S3 Bucket: " S3_BUCKET
    read -p "AWS S3 Region: " S3_REGION
    read -p "AWS Access Key ID: " AWS_ACCESS_KEY_ID
    read -p "AWS Secret Access Key: " AWS_SECRET_ACCESS_KEY
fi

echo ""
echo "=== Banco de Dados ==="
read -p "Usar MySQL? (S/n): " USE_MYSQL
USE_MYSQL="${USE_MYSQL:-S}"

if [[ "$USE_MYSQL" =~ ^[Ss]$ ]]; then
    USE_MYSQL="yes"
    read -p "Nome do banco de dados: " DB_NAME
    DB_NAME="${DB_NAME:-laravel}"
    read -p "Senha do MySQL: " DB_PASSWORD
    DB_PASSWORD="${DB_PASSWORD:-password}"
    read -p "Porta MySQL (default: 3306): " DB_PORT
    DB_PORT="${DB_PORT:-3306}"
else
    USE_MYSQL="no"
    DB_NAME="laravel"
    DB_PASSWORD=""
    DB_PORT="3306"
fi

echo ""
echo "=== Redis ==="
read -p "Usar Redis? (S/n): " USE_REDIS
USE_REDIS="${USE_REDIS:-S}"

if [[ "$USE_REDIS" =~ ^[Ss]$ ]]; then
    USE_REDIS="yes"
    read -p "Porta Redis (default: 6379): " REDIS_PORT
    REDIS_PORT="${REDIS_PORT:-6379}"
else
    USE_REDIS="no"
    REDIS_PORT="6379"
fi

echo ""
echo "=== Configuracoes da Aplicacao ==="
read -p "Porta da aplicacao (default: 80): " APP_PORT
APP_PORT="${APP_PORT:-80}"

read -p "URL da aplicacao (default: http://localhost): " APP_URL
APP_URL="${APP_URL:-http://localhost}"

if [ "$APP_PORT" != "80" ]; then
    APP_URL="http://localhost:$APP_PORT"
fi

echo ""
echo "=== Resumo das Configuracoes ==="
echo "Projeto: $PROJECT_NAME"
echo "Descricao: $PROJECT_DESCRIPTION"
echo "Storage: $FILE_STORAGE"
echo "MySQL: $USE_MYSQL"
echo "Redis: $USE_REDIS"
echo "Porta App: $APP_PORT"
echo ""

read -p "Continuar? (S/n): " CONFIRM
CONFIRM="${CONFIRM:-S}"
if [[ ! "$CONFIRM" =~ ^[Ss]$ ]]; then
    echo "Setup cancelado."
    exit 0
fi

echo ""
echo "=== Gerando .env.local ==="

cat > "$PROJECT_ROOT/.env.local" << EOF
# Projeto: $PROJECT_NAME
# Gerado em: $(date)
APP_NAME=$PROJECT_NAME
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=$APP_URL

# Database
DB_CONNECTION=$([ "$USE_MYSQL" == "yes" ] && echo "mysql" || echo "sqlite")
DB_HOST=127.0.0.1
DB_PORT=$DB_PORT
DB_DATABASE=$DB_NAME
DB_USERNAME=root
DB_PASSWORD=$DB_PASSWORD

# Cache & Queue
CACHE_STORE=$([ "$USE_REDIS" == "yes" ] && echo "redis" || echo "database")
QUEUE_CONNECTION=$([ "$USE_REDIS" == "yes" ] && echo "redis" || echo "database")
SESSION_DRIVER=$([ "$USE_REDIS" == "yes" ] && echo "redis" || echo "database")

# Redis
REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=$REDIS_PORT

# Docker
APP_PORT=$APP_PORT
APP_SSL_PORT=443
VITE_PORT=5173

# Filesystem
FILESYSTEM_DISK=$FILE_STORAGE
EOF

if [ "$FILE_STORAGE" == "azure" ]; then
    cat >> "$PROJECT_ROOT/.env.local" << EOF

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=$AZURE_CONNECTION_STRING
AZURE_STORAGE_CONTAINER=${AZURE_CONTAINER:-files}
EOF
elif [ "$FILE_STORAGE" == "nfs" ]; then
    cat >> "$PROJECT_ROOT/.env.local" << EOF

# NFS Volume
NFS_SERVER_ADDR=$NFS_SERVER_ADDR
NFS_SERVER_PATH=$NFS_SERVER_PATH
VOLUME_STORAGE_PATH=/app/storage/app/files
EOF
elif [ "$FILE_STORAGE" == "s3" ]; then
    cat >> "$PROJECT_ROOT/.env.local" << EOF

# AWS S3
AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
AWS_DEFAULT_REGION=$S3_REGION
AWS_BUCKET=$S3_BUCKET
FILESYSTEM_DISK=s3
EOF
fi

echo "OK - .env.local criado"

echo ""
echo "=== Atualizando docker-compose.yml ==="

if [ "$USE_MYSQL" == "no" ]; then
    sed -i '' 's/^    mysql:/    # mysql:/' "$PROJECT_ROOT/docker-compose.yml"
    sed -i '' 's/^        image: mysql:8.4/        # image: mysql:8.4/' "$PROJECT_ROOT/docker-compose.yml"
    sed -i '' 's/^        restart: unless-stopped/        # restart: unless-stopped/' "$PROJECT_ROOT/docker-compose.yml"
    sed -i '' 's/^        environment:/        # environment:/' "$PROJECT_ROOT/docker-compose.yml"
    sed -i '' 's/^            MYSQL_ROOT_PASSWORD:/            # MYSQL_ROOT_PASSWORD:/' "$PROJECT_ROOT/docker-compose.yml"
    sed -i '' 's/^            MYSQL_DATABASE:/            # MYSQL_DATABASE:/' "$PROJECT_ROOT/docker-compose.yml"
    sed -i '' 's/^        ports:/        # ports:/' "$PROJECT_ROOT/docker-compose.yml"
    sed -i '' 's/^        volumes:/        # volumes:/' "$PROJECT_ROOT/docker-compose.yml"
    sed -i '' 's/^        healthcheck:/        # healthcheck:/' "$PROJECT_ROOT/docker-compose.yml"
    sed -i '' 's/^        networks:/        # networks:/' "$PROJECT_ROOT/docker-compose.yml"
fi

if [ "$USE_REDIS" == "no" ]; then
    sed -i '' 's/^    redis:/    # redis:/' "$PROJECT_ROOT/docker-compose.yml"
    sed -i '' 's/^        image: redis:7-alpine/        # image: redis:7-alpine/' "$PROJECT_ROOT/docker-compose.yml"
    sed -i '' 's/^        restart: unless-stopped/        # restart: unless-stopped/' "$PROJECT_ROOT/docker-compose.yml"
    sed -i '' 's/^        ports:/        # ports:/' "$PROJECT_ROOT/docker-compose.yml"
    sed -i '' 's/^        volumes:/        # volumes:/' "$PROJECT_ROOT/docker-compose.yml"
    sed -i '' 's/^        healthcheck:/        # healthcheck:/' "$PROJECT_ROOT/docker-compose.yml"
    sed -i '' 's/^        networks:/        # networks:/' "$PROJECT_ROOT/docker-compose.yml"
fi

if [ "$USE_MYSQL" == "no" ] && [ "$USE_REDIS" == "no" ]; then
    sed -i '' 's/^        depends_on:/        # depends_on:/' "$PROJECT_ROOT/docker-compose.yml"
    sed -i '' 's/^            mysql:/            # mysql:/' "$PROJECT_ROOT/docker-compose.yml"
    sed -i '' 's/^                condition:/                # condition:/' "$PROJECT_ROOT/docker-compose.yml"
    sed -i '' 's/^            redis:/            # redis:/' "$PROJECT_ROOT/docker-compose.yml"
    sed -i '' 's/^                condition:/                # condition:/' "$PROJECT_ROOT/docker-compose.yml"
fi

echo "OK - docker-compose.yml atualizado"

echo ""
echo "=== Atualizando config/filesystems.php ==="

PHP_FILE="$PROJECT_ROOT/config/filesystems.php"
if [ -f "$PHP_FILE" ]; then
    if [ "$FILE_STORAGE" == "azure" ]; then
        sed -i '' "s/'default' => env('FILESYSTEM_DISK', 'local')/'default' => env('FILESYSTEM_DISK', 'azure')/" "$PHP_FILE"
    elif [ "$FILE_STORAGE" == "nfs" ]; then
        sed -i '' "s/'default' => env('FILESYSTEM_DISK', 'local')/'default' => env('FILESYSTEM_DISK', 'volume')/" "$PHP_FILE"
    elif [ "$FILE_STORAGE" == "s3" ]; then
        sed -i '' "s/'default' => env('FILESYSTEM_DISK', 'local')/'default' => env('FILESYSTEM_DISK', 's3')/" "$PHP_FILE"
    fi
    echo "OK - config/filesystems.php atualizado"
fi

echo ""
echo "=== Gerando README.md ==="

DB_TYPE=$( [ "$USE_MYSQL" == "yes" ] && echo "MySQL" || echo "SQLite (local)" )
CACHE_TYPE=$( [ "$USE_REDIS" == "yes" ] && echo "Redis" || echo "Database" )

cat > "$PROJECT_ROOT/README.md" << EOF
# $PROJECT_NAME

$PROJECT_DESCRIPTION

## Requisitos

- PHP 8.4+
- Node.js 22+
- Docker e Docker Compose
- Composer

## Quick Start

\`\`\`bash
# Clone o repositorio
git clone <repo-url>
cd $PROJECT_NAME

# Execute o setup interativo
./scripts/setup.sh

# Inicie os containers Docker
docker compose up -d

# Instale as dependencias
composer install
npm install

# Gere a chave da aplicacao
php artisan key:generate

# Execute as migracoes
php artisan migrate

# Inicie o servidor de desenvolvimento
composer dev
\`\`\`

## Configuracao

As configuracoes do projeto estao em \`.env.local\`. Para customize, edite esse arquivo.

### Banco de Dados

- Tipo: $DB_TYPE
- Nome: $DB_NAME
- Host: 127.0.0.1

### Cache & Queue

- Driver: $CACHE_TYPE

### Armazenamento

- Tipo: $FILE_STORAGE

## Comandos Uteis

\`\`\`bash
# Executar testes
composer test

# Linting PHP
vendor/bin/pint --dirty

# Analise estatica
vendor/bin/phpstan analyse

# Linting JS
npm run lint

# Verificacao de tipos
npm run types

# Build frontend
npm run build
\`\`\`

## Documentacao

- [Arquitetura](./docs/ARCHITECTURE.md)
- [Setup](./docs/SETUP.md)

## Licenca

MIT
EOF

echo "OK - README.md criado"

echo ""
echo "=== Atualizando AGENTS.md ==="

cat > "$PROJECT_ROOT/AGENTS.md" << EOF
# Agentes AI — $PROJECT_NAME

## Informacoes do Projeto

- **Nome**: $PROJECT_NAME
- **Descricao**: $PROJECT_DESCRIPTION

## Configuracoes

### Banco de Dados

- **Tipo**: $DB_TYPE
- **Nome**: $DB_NAME
- **Host**: 127.0.0.1
- **Porta**: $DB_PORT

### Cache & Queue

- **Driver**: $CACHE_TYPE
- **Porta Redis**: $REDIS_PORT

### Armazenamento

- **Tipo**: $FILE_STORAGE
- **Disco padrao**: $FILE_STORAGE

## Antes de Implementar

1. Leia CLAUDE.md para entender a arquitetura
2. Leia \`docs/ARCHITECTURE.md\` para o fluxo de dados
3. Verifique arquivos similares (siblings) antes de criar novos
4. Proponha um plano curto com arquivos impactados + testes impactados

## Criando uma Nova Entidade

Siga a ordem:
1. Migration (\`database/migrations/\`)
2. Model (\`app/Models/\`)
3. Factory (\`database/factories/\`)
4. Enum se necessario (\`app/Enums/\`)
5. DTOs (\`app/DTOs/{Domain}/\`)
6. Repository (\`app/Repositories/\`)
7. Service (\`app/Services/\`)
8. FormRequests (\`app/Http/Requests/{Domain}/\`)
9. Controller (\`app/Http/Controllers/\`)
10. Rotas (\`routes/web.php\`)
11. Zod schema (\`resources/js/forms/{domain}/schema.ts\`)
12. Form hook (\`resources/js/forms/{domain}/use-{domain}-form.ts\`)
13. Form component (\`resources/js/forms/{domain}/{domain}-form.tsx\`)
14. Pages (\`resources/js/pages/{domain}/\`)
15. Partials (\`resources/js/partials/{domain}/\`)
16. Testes backend (Pest)
17. Testes frontend (Vitest)

## Checklist de Finalizacao

- [ ] \`vendor/bin/pint --dirty\` sem erros
- [ ] \`vendor/bin/phpstan analyse\` sem erros
- [ ] \`composer test\` passando
- [ ] \`npx eslint .\` sem erros
- [ ] \`npm run types\` sem erros
- [ ] \`npm run test\` passando
- [ ] Commit message segue Conventional Commits
EOF

echo "OK - AGENTS.md atualizado"

echo ""
echo "========================================"
echo "  Setup concluido!"
echo "========================================"
echo ""
echo "Proximos passos:"
echo "1. Execute: docker compose up -d"
echo "2. Execute: composer install"
echo "3. Execute: npm install"
echo "4. Execute: php artisan key:generate"
echo "5. Execute: php artisan migrate"
echo ""
