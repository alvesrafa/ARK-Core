# Setup

## Requisitos

- PHP 8.4+
- Composer 2.x
- Node.js 22+
- MySQL 8.4

## Instalação

```bash
# Clone
git clone <repo-url> ark-core
cd ark-core

# Setup completo
composer setup

# Ou manualmente:
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm install
npm run build
```

## Desenvolvimento

```bash
# Servidor + Vite + Queue + Logs (concurrently)
composer dev

# Ou separadamente:
php artisan serve
npm run dev
```

## Seed

```bash
php artisan db:seed
```

## Docker

```bash
docker compose up -d
docker compose exec app php artisan migrate --seed
```

## Verificação

```bash
composer test                    # Pest PHP
npm run test                     # Vitest
vendor/bin/pint --test           # PHP formatter
npx eslint .                     # ESLint
npm run types                    # TypeScript
vendor/bin/phpstan analyse       # PHPStan nível 6
npm run build                    # Build produção
```
