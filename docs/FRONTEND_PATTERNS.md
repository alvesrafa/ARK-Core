# Padrões Frontend

## Form Module Pattern

Cada domínio tem 3 arquivos em `forms/{domain}/`:

1. **schema.ts** — Zod schema + tipo inferido
2. **use-{domain}-form.ts** — Hook com `useFormWithZod` + ações específicas
3. **{domain}-form.tsx** — Componente de formulário

## useFormWithZod

Ponte entre Zod e Inertia `useForm`. Valida client-side antes de enviar.

```tsx
const form = useFormWithZod({ schema: postSchema, initialValues: {...} });
form.submitWithValidation('post', '/posts');
```

## Componentes UI

Baseados em Radix UI (shadcn-style). Usam `cva` para variantes e `cn()` para merge de classes.

## Tipagem

- `IBaseModel` — id + timestamps
- `IPaginate<T>` — resposta paginada do Laravel
- `IPageProps` — props base de página
- `IPaginatedPageProps<T>` — props com paginação

## Páginas e Partials

- **Pages** (`pages/`) recebem props do Inertia
- **Partials** (`partials/`) são fragmentos reutilizáveis dentro de pages
- Use `AppLayout` como wrapper

## Toast

Use `useToast()` do `ToastProvider`:

```tsx
const { notifySuccess } = useToast();
notifySuccess('Post criado!');
```
