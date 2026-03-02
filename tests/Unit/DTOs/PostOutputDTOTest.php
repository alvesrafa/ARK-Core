<?php

use App\DTOs\Post\PostOutputDTO;
use App\Enums\PostStatusEnum;
use App\Models\Post;

it('can create from model', function () {
    $post = Post::factory()->make([
        'id' => 1,
        'title' => 'Test',
        'content' => 'Content',
        'status' => PostStatusEnum::Draft,
        'published_at' => null,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $dto = PostOutputDTO::fromModel($post);

    expect($dto->id)->toBe(1);
    expect($dto->title)->toBe('Test');
    expect($dto->status)->toBe(PostStatusEnum::Draft);
    expect($dto->published_at)->toBeNull();
});

it('can convert to array', function () {
    $post = Post::factory()->make([
        'id' => 1,
        'title' => 'Test',
        'content' => 'Content',
        'status' => PostStatusEnum::Published,
        'published_at' => now(),
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $dto = PostOutputDTO::fromModel($post);
    $array = $dto->toArray();

    expect($array)->toBeArray();
    expect($array['title'])->toBe('Test');
    expect($array['status'])->toBe('published');
});
