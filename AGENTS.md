# Agentes AI — Instruções Específicas

## Antes de Implementar

1. Leia CLAUDE.md para entender a arquitetura
2. Leia `docs/ARCHITECTURE.md` para o fluxo de dados
3. Verifique arquivos similares (siblings) antes de criar novos
4. Proponha um plano curto com arquivos impactados + testes impactados

## Criando uma Nova Entidade

Siga a ordem:
1. Migration (`database/migrations/`)
2. Model (`app/Models/`)
3. Factory (`database/factories/`)
4. Enum se necessário (`app/Enums/`)
5. DTOs (`app/DTOs/{Domain}/`)
6. Repository (`app/Repositories/`)
7. Service (`app/Services/`)
8. FormRequests (`app/Http/Requests/{Domain}/`)
9. Controller (`app/Http/Controllers/`)
10. Rotas (`routes/web.php`)
11. Zod schema (`resources/js/forms/{domain}/schema.ts`)
12. Form hook (`resources/js/forms/{domain}/use-{domain}-form.ts`)
13. Form component (`resources/js/forms/{domain}/{domain}-form.tsx`)
14. Pages (`resources/js/pages/{domain}/`)
15. Partials (`resources/js/partials/{domain}/`)
16. Testes backend (Pest)
17. Testes frontend (Vitest)

## Checklist de Finalização

- [ ] `vendor/bin/pint --dirty` sem erros
- [ ] `vendor/bin/phpstan analyse` sem erros
- [ ] `composer test` passando
- [ ] `npx eslint .` sem erros
- [ ] `npm run types` sem erros
- [ ] `npm run test` passando
- [ ] Commit message segue Conventional Commits
