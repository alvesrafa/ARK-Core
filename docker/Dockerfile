# ==============================================================================
# Base stage — FrankenPHP with PHP 8.4
# ==============================================================================
FROM dunglas/frankenphp:1.11-builder-php8.4 AS base

RUN install-php-extensions \
    pdo_mysql \
    zip \
    gd \
    bcmath \
    opcache \
    pcntl

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# ==============================================================================
# Frontend assets build
# ==============================================================================
FROM node:22-slim AS frontend

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ==============================================================================
# Development stage — used by Sail
# ==============================================================================
FROM base AS dev

RUN install-php-extensions xdebug

COPY . .
RUN composer install --no-interaction

EXPOSE 80 443

CMD ["php", "artisan", "octane:start", "--server=frankenphp", "--host=0.0.0.0", "--port=8000"]

# ==============================================================================
# Production stage
# ==============================================================================
FROM base AS production

COPY . .
COPY --from=frontend /app/public/build ./public/build

RUN composer install --no-dev --no-interaction --optimize-autoloader \
    && php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80 443

CMD ["php", "artisan", "octane:start", "--server=frankenphp", "--host=0.0.0.0", "--port=8000"]
