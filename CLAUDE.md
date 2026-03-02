# ARK Core — Guia para Agentes AI

## Stack

- PHP 8.4+ / Laravel 12 / Inertia 2 / React 19 / TypeScript / Tailwind 4
- Testes: Pest PHP (backend) + Vitest (frontend)
- Lint: Pint + PHPStan nível 6 + ESLint 9 + Prettier

## Arquitetura Backend

Fluxo obrigatório: `Controller → Service → Repository → Model`

- **Controllers**: recebem FormRequest, delegam ao Service, retornam Inertia::render() ou redirect
- **Services**: lógica de negócio, usam DTOs para input/output
- **Repositories**: estendem AbstractRepository, acesso a dados via Eloquent
- **DTOs**: constructor promotion + readonly + ConvertibleToArray trait
- **Enums**: backed enums com HasLabel trait
- **FormRequests**: validação com mensagens em português

## Arquitetura Frontend

- **pages/**: componentes de página Inertia
- **partials/**: fragmentos reutilizáveis por domínio
- **components/ui/**: componentes base Radix/shadcn
- **forms/{domain}/**: schema.ts (Zod) + use-{domain}-form.ts (hook) + {domain}-form.tsx
- **hooks/**: useFormWithZod, useDebounce, useMobile, useAppearance
- **contexts/**: ToastProvider
- **layouts/**: AppLayout
- **types/**: IBaseModel, IPaginate<T>, IPageProps, IPaginatedPageProps<T>

## Comandos

```bash
composer test        # Pest PHP
npm run test         # Vitest
vendor/bin/pint      # Format PHP
npx eslint . --fix   # Fix JS lint
npm run types        # TypeScript check
vendor/bin/phpstan analyse  # Static analysis
```

## Regras

1. Nunca acesse Model direto no Controller — sempre via Service → Repository
2. Sempre crie FormRequest para validação (nunca inline)
3. Use DTOs para transferir dados entre camadas
4. Cada domínio de formulário tem schema + hook + componente em forms/
5. Testes são obrigatórios para qualquer alteração de comportamento
6. Commits seguem Conventional Commits (feat, fix, docs, etc.)
7. Rodar `vendor/bin/pint --dirty` antes de commitar
