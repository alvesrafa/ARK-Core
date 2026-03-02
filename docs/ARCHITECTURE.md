# Arquitetura

## Stack

- **Backend**: PHP 8.4+ / Laravel 12 / Inertia 2
- **Frontend**: React 19 / TypeScript / Tailwind 4
- **Banco**: MySQL 8.4

## Fluxo de Dados

```
Request → Controller → Service → Repository → Model → DB
                ↓
         FormRequest (validação)
                ↓
         DTO (input/output)
                ↓
         Inertia::render() → React Page
```

## Camadas Backend

| Camada      | Responsabilidade                                            |
| ----------- | ----------------------------------------------------------- |
| Controller  | Recebe request, delega ao Service, retorna Inertia response |
| Service     | Lógica de negócio, orquestra Repository e DTOs              |
| Repository  | Acesso a dados, queries Eloquent                            |
| DTO         | Transferência de dados tipada entre camadas                 |
| FormRequest | Validação de input HTTP                                     |
| Enum        | Valores constantes com labels                               |

## Estrutura Frontend

| Pasta             | Responsabilidade                       |
| ----------------- | -------------------------------------- |
| `pages/`          | Componentes de página (Inertia)        |
| `partials/`       | Fragmentos reutilizáveis por domínio   |
| `components/ui/`  | Componentes base (shadcn-style)        |
| `forms/{domain}/` | Schema Zod + hook + componente de form |
| `hooks/`          | Hooks reutilizáveis                    |
| `contexts/`       | Providers React (Toast, Appearance)    |
| `layouts/`        | Layouts de página                      |
| `lib/`            | Utilidades (cn, formatters)            |
| `types/`          | TypeScript type definitions            |
