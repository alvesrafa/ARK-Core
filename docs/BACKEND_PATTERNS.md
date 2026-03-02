# Padrões Backend

## Controller → Service → Repository

Sempre seguir esta cadeia. Controllers nunca acessam Models diretamente.

```php
// Controller
public function store(StorePostRequest $request): RedirectResponse
{
    $dto = new CreatePostDTO(...$request->validated());
    $this->service->create($dto);
    return redirect()->route('posts.index')->with('success', 'Criado.');
}
```

## DTOs

- Use `ConvertibleToArray` trait para serialização
- Constructor promotion com `readonly`
- `fromModel()` estático para converter Model → DTO

## Enums

- Use `HasLabel` trait para labels traduzidos
- `toArray()` retorna `[value => label]`

## Repository

- Extenda `AbstractRepository`
- Defina `protected string $modelClass`
- Métodos herdados: `create()`, `update()`, `findByID()`, `deleteById()`, `getAll()`, `getByParams()`

## FormRequests

- Um por ação (Store, Update)
- Mensagens em português
- Use `Rule::enum()` para validar enums

## Exceptions

- `ResourceNotFoundException` para 404
- `UnexpectedErrorException` para erros inesperados
