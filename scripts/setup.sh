#!/usr/bin/env bash
set -euo pipefail
# =============================================================================
# ARK Core — Interactive Setup Script
# =============================================================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
CHECKPOINT_FILE="$PROJECT_DIR/.setup-checkpoint"
# -----------------------------------------------------------------------------
# 1. Header & Utilities
# -----------------------------------------------------------------------------
# Colors (with fallback for dumb terminals)
if command -v tput &>/dev/null && tput colors &>/dev/null; then
    BOLD=$(tput bold)
    CYAN=$(tput setaf 6)
    GREEN=$(tput setaf 2)
    YELLOW=$(tput setaf 3)
    RED=$(tput setaf 1)
    RESET=$(tput sgr0)
else
    BOLD="" CYAN="" GREEN="" YELLOW="" RED="" RESET=""
fi
cleanup() {
    local exit_code=$?
    if [ $exit_code -ne 0 ]; then
        print_error "Setup failed (exit code $exit_code). Check the output above for details."
        if [ -f "$CHECKPOINT_FILE" ]; then
            print_warning "Checkpoint saved. Re-run ./scripts/setup.sh to continue from where it left off."
        fi
    fi
}
trap cleanup EXIT
print_header() {
    echo ""
    echo "${BOLD}${CYAN}╔══════════════════════════════════════════╗${RESET}"
    echo "${BOLD}${CYAN}║       ARK Core — Project Setup           ║${RESET}"
    echo "${BOLD}${CYAN}╚══════════════════════════════════════════╝${RESET}"
    echo ""
}
print_step() {
    echo "${BOLD}${CYAN}▸ $1${RESET}"
}
print_success() {
    echo "${GREEN}✔ $1${RESET}"
}
print_error() {
    echo "${RED}✖ $1${RESET}" >&2
}
print_warning() {
    echo "${YELLOW}⚠ $1${RESET}"
}
prompt_text() {
    local prompt="$1"
    local default="${2:-}"
    local result
    if [ -n "$default" ]; then
        printf "${BOLD}%s${RESET} [${YELLOW}%s${RESET}]: " "$prompt" "$default" >&2
    else
        printf "${BOLD}%s${RESET}: " "$prompt" >&2
    fi
    read -r result
    echo "${result:-$default}"
}
prompt_yesno() {
    local prompt="$1"
    local default="${2:-y}"
    local result
    if [ "$default" = "y" ]; then
        printf "${BOLD}%s${RESET} [${YELLOW}Y/n${RESET}]: " "$prompt" >&2
    else
        printf "${BOLD}%s${RESET} [${YELLOW}y/N${RESET}]: " "$prompt" >&2
    fi
    read -r result
    result="${result:-$default}"
    case "$result" in
        [Yy]*) echo "yes" ;;
        *) echo "no" ;;
    esac
}
prompt_choice() {
    local prompt="$1"
    shift
    local options=("$@")
    local i
    echo "${BOLD}${prompt}${RESET}" >&2
    for i in "${!options[@]}"; do
        echo "  $((i + 1))) ${options[$i]}" >&2
    done
    printf "Choose [${YELLOW}1${RESET}]: " >&2
    read -r choice
    choice="${choice:-1}"
    if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le "${#options[@]}" ]; then
        echo "${options[$((choice - 1))]}"
    else
        echo "${options[0]}"
    fi
}
slugify() {
    echo "$1" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//'
}
generate_password() {
    openssl rand -base64 24 | tr -d '/+=' | head -c 16
}
# -----------------------------------------------------------------------------
# Checkpoint system
# -----------------------------------------------------------------------------
save_checkpoint() {
    declare -p PROJECT_NAME PROJECT_SLUG PROJECT_DESCRIPTION \
        DB_DATABASE DB_PASSWORD USE_REDIS APP_PORT FILESYSTEM_DISK \
        AZURE_STORAGE_CONNECTION_STRING AZURE_STORAGE_CONTAINER AZURE_STORAGE_URL \
        AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_BUCKET AWS_DEFAULT_REGION \
        VOLUME_STORAGE_PATH USE_BOOST COMPLETED_STEPS > "$CHECKPOINT_FILE" 2>/dev/null || true
}
load_checkpoint() {
    # shellcheck source=/dev/null
    source "$CHECKPOINT_FILE"
}
mark_step_done() {
    COMPLETED_STEPS="${COMPLETED_STEPS} $1"
    save_checkpoint
}
is_step_done() {
    [[ " ${COMPLETED_STEPS} " == *" $1 "* ]]
}
check_prerequisites() {
    print_step "Checking prerequisites..."
    if ! command -v docker &>/dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    if ! docker compose version &>/dev/null; then
        print_error "Docker Compose (v2) is not available. Please install Docker Compose."
        exit 1
    fi
    if ! docker info &>/dev/null 2>&1; then
        print_error "Docker daemon is not running. Please start Docker."
        exit 1
    fi
    print_success "All prerequisites met."
}
# -----------------------------------------------------------------------------
# 2. Collect Information
# -----------------------------------------------------------------------------
collect_info() {
    echo "${BOLD}Let's configure your new project:${RESET}"
    echo ""
    PROJECT_NAME=$(prompt_text "Project name" "ARK Core")
    local auto_slug
    auto_slug=$(slugify "$PROJECT_NAME")
    PROJECT_SLUG=$(prompt_text "Project slug" "$auto_slug")
    PROJECT_DESCRIPTION=$(prompt_text "Project description" "")
    local db_default
    db_default=$(echo "$PROJECT_SLUG" | tr '-' '_')
    DB_DATABASE=$(prompt_text "Database name" "$db_default")
    local random_pass
    random_pass=$(generate_password)
    DB_PASSWORD=$(prompt_text "Database password" "$random_pass")
    USE_REDIS=$(prompt_yesno "Use Redis?" "y")
    APP_PORT=$(prompt_text "Local app port" "80")
    echo ""
    FILESYSTEM_DISK=$(prompt_choice "Storage driver:" "local" "azure" "s3" "volume")
    # Storage-specific questions
    AZURE_STORAGE_CONNECTION_STRING=""
    AZURE_STORAGE_CONTAINER=""
    AZURE_STORAGE_URL=""
    AWS_ACCESS_KEY_ID=""
    AWS_SECRET_ACCESS_KEY=""
    AWS_BUCKET=""
    AWS_DEFAULT_REGION=""
    VOLUME_STORAGE_PATH=""
    case "$FILESYSTEM_DISK" in
        azure)
            echo ""
            print_step "Azure Blob Storage configuration:"
            AZURE_STORAGE_CONNECTION_STRING=$(prompt_text "  Connection string" "")
            AZURE_STORAGE_CONTAINER=$(prompt_text "  Container name" "files")
            AZURE_STORAGE_URL=$(prompt_text "  Storage URL (optional)" "")
            ;;
        s3)
            echo ""
            print_step "AWS S3 configuration:"
            AWS_ACCESS_KEY_ID=$(prompt_text "  Access Key ID" "")
            AWS_SECRET_ACCESS_KEY=$(prompt_text "  Secret Access Key" "")
            AWS_BUCKET=$(prompt_text "  Bucket name" "")
            AWS_DEFAULT_REGION=$(prompt_text "  Region" "us-east-1")
            ;;
        volume)
            echo ""
            VOLUME_STORAGE_PATH=$(prompt_text "Volume storage path" "/app/storage/app/files")
            ;;
    esac
    echo ""
    USE_BOOST=$(prompt_yesno "Install Laravel Boost MCP?" "y")
    # --- Summary ---
    print_summary_collected
    local confirm
    confirm=$(prompt_yesno "Proceed with setup?" "y")
    if [ "$confirm" != "yes" ]; then
        echo "Setup cancelled."
        exit 0
    fi
}
print_summary_collected() {
    echo ""
    echo "${BOLD}${CYAN}═══════════════════════════════════════════${RESET}"
    echo "${BOLD}  Summary${RESET}"
    echo "${BOLD}${CYAN}═══════════════════════════════════════════${RESET}"
    echo "  Project:      ${BOLD}$PROJECT_NAME${RESET} ($PROJECT_SLUG)"
    [ -n "$PROJECT_DESCRIPTION" ] && echo "  Description:  $PROJECT_DESCRIPTION"
    echo "  Database:     $DB_DATABASE (password: $DB_PASSWORD)"
    echo "  Redis:        $USE_REDIS"
    echo "  App port:     $APP_PORT"
    echo "  Storage:      $FILESYSTEM_DISK"
    echo "  Boost MCP:    $USE_BOOST"
    echo "${BOLD}${CYAN}═══════════════════════════════════════════${RESET}"
    echo ""
}
# -----------------------------------------------------------------------------
# 3. Transformations
# -----------------------------------------------------------------------------
generate_env() {
    print_step "Generating .env..."
    cp "$PROJECT_DIR/.env.example" "$PROJECT_DIR/.env"
    local env="$PROJECT_DIR/.env"
    # APP_NAME (quote it)
    sed -i '' "s|^APP_NAME=.*|APP_NAME=\"$PROJECT_NAME\"|" "$env"
    # Database — switch to mysql and uncomment
    sed -i '' "s|^DB_CONNECTION=.*|DB_CONNECTION=mysql|" "$env"
    sed -i '' "s|^# DB_HOST=.*|DB_HOST=mysql|" "$env"
    sed -i '' "s|^# DB_PORT=.*|DB_PORT=3306|" "$env"
    sed -i '' "s|^# DB_DATABASE=.*|DB_DATABASE=$DB_DATABASE|" "$env"
    sed -i '' "s|^# DB_USERNAME=.*|DB_USERNAME=root|" "$env"
    sed -i '' "s|^# DB_PASSWORD=.*|DB_PASSWORD=$DB_PASSWORD|" "$env"
    # Redis handling
    if [ "$USE_REDIS" = "no" ]; then
        sed -i '' "s|^SESSION_DRIVER=.*|SESSION_DRIVER=database|" "$env"
        sed -i '' "s|^CACHE_STORE=.*|CACHE_STORE=file|" "$env"
        sed -i '' "s|^QUEUE_CONNECTION=.*|QUEUE_CONNECTION=database|" "$env"
        # Comment out Redis lines
        sed -i '' "s|^REDIS_CLIENT=|# REDIS_CLIENT=|" "$env"
        sed -i '' "s|^REDIS_HOST=|# REDIS_HOST=|" "$env"
        sed -i '' "s|^REDIS_PASSWORD=|# REDIS_PASSWORD=|" "$env"
        sed -i '' "s|^REDIS_PORT=|# REDIS_PORT=|" "$env"
    fi
    # Filesystem
    sed -i '' "s|^FILESYSTEM_DISK=.*|FILESYSTEM_DISK=$FILESYSTEM_DISK|" "$env"
    case "$FILESYSTEM_DISK" in
        azure)
            sed -i '' "s|^# AZURE_STORAGE_CONNECTION_STRING=.*|AZURE_STORAGE_CONNECTION_STRING=$AZURE_STORAGE_CONNECTION_STRING|" "$env"
            sed -i '' "s|^# AZURE_STORAGE_CONTAINER=.*|AZURE_STORAGE_CONTAINER=$AZURE_STORAGE_CONTAINER|" "$env"
            if [ -n "$AZURE_STORAGE_URL" ]; then
                sed -i '' "s|^# AZURE_STORAGE_URL=.*|AZURE_STORAGE_URL=$AZURE_STORAGE_URL|" "$env"
            fi
            ;;
        s3)
            sed -i '' "s|^AWS_ACCESS_KEY_ID=.*|AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID|" "$env"
            sed -i '' "s|^AWS_SECRET_ACCESS_KEY=.*|AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY|" "$env"
            sed -i '' "s|^AWS_DEFAULT_REGION=.*|AWS_DEFAULT_REGION=$AWS_DEFAULT_REGION|" "$env"
            sed -i '' "s|^AWS_BUCKET=.*|AWS_BUCKET=$AWS_BUCKET|" "$env"
            ;;
        volume)
            sed -i '' "s|^# VOLUME_STORAGE_PATH=.*|VOLUME_STORAGE_PATH=$VOLUME_STORAGE_PATH|" "$env"
            ;;
    esac
    # App port
    sed -i '' "s|^APP_PORT=.*|APP_PORT=$APP_PORT|" "$env"
    # VITE_APP_NAME
    sed -i '' "s|^VITE_APP_NAME=.*|VITE_APP_NAME=\"\${APP_NAME}\"|" "$env"
    print_success ".env generated."
}
update_docker_compose() {
    print_step "Updating docker-compose.yml..."
    local dc="$PROJECT_DIR/docker-compose.yml"
    if [ "$USE_REDIS" = "no" ]; then
        # Remove the redis service block (starts with "    redis:" under services,
        # ends when we hit a line with same or less indentation)
        awk '
        /^    redis:$/ && !found_redis {
            found_redis = 1
            in_redis = 1
            next
        }
        in_redis && /^    [a-zA-Z]/ {
            in_redis = 0
        }
        in_redis && /^[a-zA-Z]/ {
            in_redis = 0
        }
        in_redis { next }
        { print }
        ' "$dc" > "$dc.tmp" && mv "$dc.tmp" "$dc"
        # Remove redis from depends_on (the "            redis:" + "                condition:" lines)
        awk '
        /^            redis:$/ {
            getline next_line
            if (next_line ~ /condition: service_healthy/) {
                next
            } else {
                print
                print next_line
            }
            next
        }
        { print }
        ' "$dc" > "$dc.tmp" && mv "$dc.tmp" "$dc"
        # Remove sail-redis from volumes
        sed -i '' '/^    sail-redis:/d' "$dc"
    fi
    if [ "$FILESYSTEM_DISK" = "volume" ]; then
        sed -i '' 's|^            # - storage-volume:|            - storage-volume:|' "$dc"
    else
        sed -i '' 's|^            - storage-volume:|            # - storage-volume:|' "$dc"
    fi
    print_success "docker-compose.yml updated."
}
update_dockerfile() {
    print_step "Updating docker/Dockerfile..."
    local dockerfile="$PROJECT_DIR/docker/Dockerfile"
    if [ "$FILESYSTEM_DISK" = "volume" ]; then
        local volume_path_escaped
        volume_path_escaped=$(printf '%s' "$VOLUME_STORAGE_PATH" | sed 's/[&|]/\\&/g')
        if grep -q '^# VOLUME ' "$dockerfile"; then
            sed -i '' "s|^# VOLUME .*|VOLUME $volume_path_escaped|" "$dockerfile"
        elif grep -q '^VOLUME ' "$dockerfile"; then
            sed -i '' "s|^VOLUME .*|VOLUME $volume_path_escaped|" "$dockerfile"
        fi
    else
        if grep -q '^VOLUME ' "$dockerfile"; then
            sed -i '' "s|^VOLUME |# VOLUME |" "$dockerfile"
        fi
    fi
    print_success "docker/Dockerfile updated."
}
generate_readme() {
    print_step "Generating README.md..."
    local redis_info=""
    if [ "$USE_REDIS" = "yes" ]; then
        redis_info="- **Cache/Session/Queue:** Redis"
    else
        redis_info="- **Cache:** File | **Session/Queue:** Database"
    fi
    cat > "$PROJECT_DIR/README.md" << HEREDOC
# $PROJECT_NAME
$PROJECT_DESCRIPTION
## Stack
- PHP 8.4+ / Laravel 12 / Inertia 2 / React 19 / TypeScript / Tailwind 4
- MySQL 8.4
$redis_info
- Storage: $FILESYSTEM_DISK
## Getting Started
### Prerequisites
- Docker & Docker Compose v2
### Setup
If you haven't run the setup script yet:
\`\`\`bash
./scripts/setup.sh
\`\`\`
### Development
\`\`\`bash
# Start containers + frontend dev server (recommended)
./vendor/bin/sail up -d && ./vendor/bin/sail npm run dev

# Or step by step:
./vendor/bin/sail up -d          # Start all containers in background
./vendor/bin/sail npm run dev    # Vite HMR (keep terminal open)

# Run tests
./vendor/bin/sail composer test  # Backend (Pest)
./vendor/bin/sail npm run test   # Frontend (Vitest)

# Lint & format
./vendor/bin/sail vendor/bin/pint  # PHP formatting
./vendor/bin/sail npx eslint .     # JS linting
./vendor/bin/sail npm run types    # TypeScript check
\`\`\`
### Useful Commands
\`\`\`bash
# Artisan
./vendor/bin/sail artisan migrate
./vendor/bin/sail artisan tinker

# Logs
./vendor/bin/sail logs -f
\`\`\`
## Architecture
See [CLAUDE.md](CLAUDE.md) for architecture details and coding conventions.
HEREDOC
    print_success "README.md generated."
}
update_claude_md() {
    print_step "Updating CLAUDE.md..."
    local claude="$PROJECT_DIR/CLAUDE.md"
    # Replace title
    sed -i '' "s|^# ARK Core|# $PROJECT_NAME|" "$claude"
    # Add description after title if provided
    if [ -n "$PROJECT_DESCRIPTION" ]; then
        sed -i '' "s|^# $PROJECT_NAME.*|# $PROJECT_NAME — Guia para Agentes AI\n\n> $PROJECT_DESCRIPTION|" "$claude"
    fi
    print_success "CLAUDE.md updated."
}
update_agents_md() {
    print_step "Updating AGENTS.md..."
    local agents="$PROJECT_DIR/AGENTS.md"
    local temp_file
    temp_file=$(mktemp)
    cat > "$temp_file" << HEREDOC
# Projeto: $PROJECT_NAME
> $PROJECT_DESCRIPTION
- **Slug:** $PROJECT_SLUG
- **Storage:** $FILESYSTEM_DISK
- **Redis:** $USE_REDIS
---
HEREDOC

    if [ "$USE_REDIS" = "yes" ]; then
        cat >> "$temp_file" << 'HEREDOC'
## Cache Redis — Padrão para Listagens

Toda requisição GET de listagem padrão (action `index`) **deve usar cache Redis por padrão**. Aplique no Repository ou Service:

```php
// Exemplo no Repository
public function paginate(int $page = 1, string $search = ''): LengthAwarePaginator
{
    $key = "users.index.page_{$page}.search_" . md5($search);

    return Cache::remember($key, now()->addSeconds(60), fn () =>
        User::query()
            ->when($search, fn ($q) => $q->where('name', 'like', "%{$search}%"))
            ->paginate(15, page: $page)
    );
}
```

**Regras:**
- Chave de cache deve incluir todos os parâmetros dinâmicos (página, filtros, busca, ordenação)
- TTL padrão: **60 segundos** — ajuste por domínio conforme criticidade
- Invalide o cache nos métodos `store()`, `update()` e `destroy()` do Service:
  ```php
  Cache::tags(['users'])->flush(); // requer Redis com suporte a tags
  // ou Cache::forget($key) para chaves específicas
  ```
- Prefira `Cache::tags(['dominio'])` para facilitar invalidação em massa
- Não aplique cache em listagens com dados sensíveis ou de tempo real

---
HEREDOC
    fi

    cat "$agents" >> "$temp_file"
    mv "$temp_file" "$agents"
    print_success "AGENTS.md updated."
}
# -----------------------------------------------------------------------------
# 4. Execution
# -----------------------------------------------------------------------------
run_composer_install() {
    print_step "Installing PHP dependencies..."
    cd "$PROJECT_DIR"
    if command -v composer &>/dev/null; then
        composer install --no-interaction --prefer-dist
    else
        print_error "Composer not found locally. Please install Composer first."
        exit 1
    fi
    print_success "PHP dependencies installed."
}
run_docker_setup() {
    print_step "Building and starting containers..."
    cd "$PROJECT_DIR"
    # Tear down existing containers and volumes to ensure clean state
    # (MySQL won't pick up a new password if the volume already exists)
    if docker compose ps -q 2>/dev/null | grep -q .; then
        print_step "Stopping existing containers and removing volumes..."
        docker compose down -v
    elif docker compose ps -a -q 2>/dev/null | grep -q .; then
        docker compose down -v
    fi
    docker compose up -d --build
    # Wait for health checks (max 60s)
    print_step "Waiting for services to be healthy..."
    local elapsed=0
    local max_wait=60
    while [ $elapsed -lt $max_wait ]; do
        local healthy
        healthy=$(docker compose ps --format json 2>/dev/null | grep -c '"healthy"' || true)
        local expected=1  # at least mysql
        if [ "$USE_REDIS" = "yes" ]; then
            expected=2
        fi
        if [ "$healthy" -ge "$expected" ]; then
            break
        fi
        sleep 2
        elapsed=$((elapsed + 2))
        printf "."
    done
    echo ""
    if [ $elapsed -ge $max_wait ]; then
        print_warning "Health check timeout — continuing anyway. Check 'docker compose ps' for status."
    else
        print_success "Services are healthy."
    fi
    print_step "Running artisan commands..."
    docker compose exec app php artisan key:generate
    docker compose exec app php artisan migrate --force
    docker compose exec app php artisan storage:link || true
    print_step "Installing frontend dependencies..."
    if [ -d "$PROJECT_DIR/node_modules" ] && [ -f "$PROJECT_DIR/node_modules/.package-lock.json" ]; then
        print_success "node_modules already exists, skipping npm install."
    else
        npm install --legacy-peer-deps
    fi
    npm run build
    print_success "Docker setup complete."
}
install_boost() {
    if [ "$USE_BOOST" = "yes" ]; then
        print_step "Installing Laravel Boost MCP..."
        docker compose exec app composer require laravel/boost --dev
        docker compose exec app php artisan boost:install
        # Add Boost section to CLAUDE.md
        local claude="$PROJECT_DIR/CLAUDE.md"
        cat >> "$claude" << 'HEREDOC'
## Laravel Boost MCP
O projeto tem o Laravel Boost MCP instalado. Configure a integração MCP no seu editor (Claude Code, Cursor, etc.) para habilitar a comunicação bidirecional com o Laravel.
```bash
# O servidor MCP roda automaticamente via artisan
php artisan boost:serve
HEREDOC
        print_success "Laravel Boost MCP installed."
        print_warning "Configure the MCP integration in your editor (Claude Code, Cursor, etc.)"
    fi
}
# -----------------------------------------------------------------------------
# 5. Cleanup
# -----------------------------------------------------------------------------
cleanup_project() {
    print_step "Cleaning up..."
    cd "$PROJECT_DIR"
    # Remove .git and reinitialize
    rm -rf .git
    git init
    # Remove this setup script
    rm -f "$PROJECT_DIR/scripts/setup.sh"
    # Remove scripts/ if empty
    rmdir "$PROJECT_DIR/scripts" 2>/dev/null || true
    # Remove checkpoint file — setup completed successfully
    rm -f "$CHECKPOINT_FILE"
    # Remove start:template script from package.json if it exists
    if grep -q '"start:template"' "$PROJECT_DIR/package.json" 2>/dev/null; then
        sed -i '' '/"start:template"/d' "$PROJECT_DIR/package.json"
    fi
    # Initial commit
    git add -A
    git commit -m "chore: initial project setup"
    print_success "Git history cleaned. Initial commit created."
}
# -----------------------------------------------------------------------------
# 6. Final Summary
# -----------------------------------------------------------------------------
print_summary() {
    local boost_status="not installed"
    if [ "$USE_BOOST" = "yes" ]; then
        boost_status="installed (configure MCP in your editor)"
    fi
    local redis_status="active"
    if [ "$USE_REDIS" = "no" ]; then
        redis_status="inactive (using database/file drivers)"
    fi
    echo ""
    echo "${BOLD}${GREEN}╔══════════════════════════════════════════╗${RESET}"
    echo "${BOLD}${GREEN}║         Setup Complete!                  ║${RESET}"
    echo "${BOLD}${GREEN}╚══════════════════════════════════════════╝${RESET}"
    echo ""
    echo "  ${BOLD}App URL:${RESET}        http://localhost:${APP_PORT}"
    echo "  ${BOLD}Database:${RESET}       $DB_DATABASE (password: $DB_PASSWORD)"
    echo "  ${BOLD}Redis:${RESET}          $redis_status"
    echo "  ${BOLD}Storage:${RESET}        $FILESYSTEM_DISK"
    echo "  ${BOLD}Boost MCP:${RESET}      $boost_status"
    echo ""
    echo "  ${BOLD}Start dev server:${RESET}"
    echo "    ./vendor/bin/sail up -d && ./vendor/bin/sail npm run dev"
    echo ""
    echo "  ${BOLD}Next steps:${RESET}"
    echo "    1. Open http://localhost:${APP_PORT} in your browser"
    echo "    2. Start coding!"
    if [ "$USE_BOOST" = "yes" ]; then
        echo "    3. Configure Boost MCP in your editor for AI-assisted development"
    fi
    echo ""
}
# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------
main() {
    cd "$PROJECT_DIR"

    # Initialize all config variables (required before first save_checkpoint call)
    PROJECT_NAME="" PROJECT_SLUG="" PROJECT_DESCRIPTION=""
    DB_DATABASE="" DB_PASSWORD="" USE_REDIS=""
    APP_PORT="" FILESYSTEM_DISK=""
    AZURE_STORAGE_CONNECTION_STRING="" AZURE_STORAGE_CONTAINER="" AZURE_STORAGE_URL=""
    AWS_ACCESS_KEY_ID="" AWS_SECRET_ACCESS_KEY="" AWS_BUCKET="" AWS_DEFAULT_REGION=""
    VOLUME_STORAGE_PATH="" USE_BOOST=""
    COMPLETED_STEPS=""

    print_header

    # Check for existing checkpoint and offer to resume
    if [ -f "$CHECKPOINT_FILE" ]; then
        print_warning "Found an existing setup checkpoint."
        local resume
        resume=$(prompt_yesno "Resume from where it left off?" "y")
        if [ "$resume" = "yes" ]; then
            load_checkpoint
            print_success "Checkpoint loaded. Resuming setup..."
            echo ""
            print_summary_collected
        else
            rm -f "$CHECKPOINT_FILE"
            COMPLETED_STEPS=""
        fi
    fi

    check_prerequisites
    echo ""

    # Collect project information (skipped when resuming)
    if ! is_step_done "collect_info"; then
        collect_info
        mark_step_done "collect_info"
    fi
    echo ""

    # Apply transformations (each step is idempotent — safe to re-run)
    is_step_done "generate_env"           || { generate_env;           mark_step_done "generate_env"; }
    is_step_done "update_docker_compose"  || { update_docker_compose;  mark_step_done "update_docker_compose"; }
    is_step_done "update_dockerfile"      || { update_dockerfile;      mark_step_done "update_dockerfile"; }
    is_step_done "generate_readme"        || { generate_readme;        mark_step_done "generate_readme"; }
    is_step_done "update_claude_md"       || { update_claude_md;       mark_step_done "update_claude_md"; }
    is_step_done "update_agents_md"       || { update_agents_md;       mark_step_done "update_agents_md"; }
    echo ""

    # Install PHP dependencies
    is_step_done "run_composer_install" || { run_composer_install; mark_step_done "run_composer_install"; }

    # Build images, start containers, run migrations, build frontend
    is_step_done "run_docker_setup" || { run_docker_setup; mark_step_done "run_docker_setup"; }

    # Optional: Laravel Boost MCP
    is_step_done "install_boost" || { install_boost; mark_step_done "install_boost"; }
    echo ""

    # Cleanup (removes checkpoint on success)
    cleanup_project

    # Final summary
    print_summary
}
main "$@"
