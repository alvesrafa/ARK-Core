<?php

use App\Enums\PostStatusEnum;

it('has correct values', function () {
    expect(PostStatusEnum::Draft->value)->toBe('draft');
    expect(PostStatusEnum::Published->value)->toBe('published');
    expect(PostStatusEnum::Archived->value)->toBe('archived');
});

it('has labels', function () {
    expect(PostStatusEnum::Draft->label())->toBe('Rascunho');
    expect(PostStatusEnum::Published->label())->toBe('Publicado');
    expect(PostStatusEnum::Archived->label())->toBe('Arquivado');
});

it('can convert to array', function () {
    $array = PostStatusEnum::toArray();

    expect($array)->toBeArray();
    expect($array)->toHaveCount(3);
    expect($array['draft'])->toBe('Rascunho');
});
