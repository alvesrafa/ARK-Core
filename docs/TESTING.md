# Testes

## Backend (Pest PHP)

```bash
# Rodar todos os testes
composer test

# Rodar um arquivo específico
vendor/bin/pest tests/Feature/Http/Controllers/PostControllerTest.php

# Filtrar por nome
vendor/bin/pest --filter="can create"
```

### Estrutura

- `tests/Feature/` — Testes de integração (HTTP, banco)
- `tests/Unit/` — Testes unitários (DTOs, Enums, Services, Repositories)
- `tests/Pest.php` — Configuração base (TestCase, RefreshDatabase)

### Convenções

- Use `it('can ...', fn() => ...)` syntax
- Feature tests usam `RefreshDatabase` (via Pest.php)
- Unit tests que precisam de banco declaram `uses(RefreshDatabase::class)`
- Use factories para criar modelos

## Frontend (Vitest)

```bash
# Rodar todos os testes
npm run test

# Watch mode
npm run test:watch

# Com cobertura
npm run test:coverage
```

### Estrutura

- `tests/js/setup.ts` — Setup (jest-dom matchers)
- `tests/js/components/` — Testes de componentes UI
- `tests/js/forms/` — Testes de schemas Zod
- `tests/js/pages/` — Testes de páginas

### Convenções

- Mock `@inertiajs/react` para testes de página
- Use `@testing-library/react` e `@testing-library/user-event`
- Teste comportamento, não implementação
