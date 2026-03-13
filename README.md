# ARK Core Template

Este repositorio e um template para projetos Laravel com Inertia + React + Docker.

**Stack**
- PHP 8.4+ / Laravel 12 / Inertia 2 / React 19 / TypeScript / Tailwind 4
- MySQL 8.4
- Docker + Docker Compose v2

**Arquitetura**
Veja `CLAUDE.md` e `docs/ARCHITECTURE.md`.

**Como usar o template**
1. Clone o repositorio
2. Rode o setup interativo

```bash
./scripts/setup.sh
```

O script vai:
- Gerar `.env` a partir de `.env.example`
- Configurar banco, Redis, portas e storage
- Atualizar `docker-compose.yml` conforme suas escolhas
- Instalar dependencias PHP e JS
- Subir os containers e rodar migrations

**Pre requisitos**
- Docker
- Docker Compose v2
- Composer (local)
- Node.js + npm (local)

**Desenvolvimento**
```bash
# Subir containers (se ainda nao estiverem no ar)
docker compose up -d

# Servidor de desenvolvimento (Octane + Vite)
docker compose exec app composer dev
```

Acesso: `http://localhost:APP_PORT` (por padrao `80`).

**Testes e qualidade**
```bash
# Backend
composer test
vendor/bin/pint --dirty
vendor/bin/phpstan analyse

# Frontend
npx eslint .
npm run types
npm run test
```

**Storage (local, azure, s3, volume)**
O setup pergunta o driver:
- `local`
- `azure`
- `s3`
- `volume`

Se escolher `volume`, o script habilita o volume em `docker-compose.yml` e define `VOLUME_STORAGE_PATH` na `.env`.
Para NFS, use a configuracao comentada em `docker-compose.yml` e ajuste:
- `NFS_SERVER_ADDR`
- `NFS_SERVER_PATH`

**Boost MCP (opcional)**
O setup pergunta se deseja instalar o Laravel Boost MCP para integracao com editores.

**Observacoes**
- O template nao remove `.git` automaticamente. Se quiser iniciar um historico novo, remova e reinicialize manualmente.

