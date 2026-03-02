<?php

use App\DTOs\Pagination\PaginationInputDTO;
use App\DTOs\Post\CreatePostDTO;
use App\Enums\PostStatusEnum;
use App\Exceptions\ResourceNotFoundException;
use App\Models\Post;
use App\Services\PostService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can paginate posts', function () {
    Post::factory()->count(5)->create();

    $service = app(PostService::class);
    $pagination = new PaginationInputDTO(perPage: 3);

    $result = $service->paginate($pagination);

    expect($result)->toHaveCount(3);
});

it('can create a post', function () {
    $service = app(PostService::class);

    $dto = new CreatePostDTO(
        title: 'New Post',
        content: 'New content',
        status: PostStatusEnum::Draft,
    );

    $result = $service->create($dto);

    expect($result->title)->toBe('New Post');
    expect($result->status)->toBe(PostStatusEnum::Draft);
});

it('sets published_at when creating published post', function () {
    $service = app(PostService::class);

    $dto = new CreatePostDTO(
        title: 'Published Post',
        content: 'Content',
        status: PostStatusEnum::Published,
    );

    $result = $service->create($dto);

    expect($result->published_at)->not->toBeNull();
});

it('can find a post by id', function () {
    $post = Post::factory()->create();
    $service = app(PostService::class);

    $result = $service->findById($post->id);

    expect($result->id)->toBe($post->id);
});

it('throws exception when post not found', function () {
    $service = app(PostService::class);

    $service->findById(999);
})->throws(ResourceNotFoundException::class);

it('can update a post', function () {
    $post = Post::factory()->create();
    $service = app(PostService::class);

    $result = $service->update(['title' => 'Updated'], $post->id);

    expect($result->title)->toBe('Updated');
});

it('can delete a post', function () {
    $post = Post::factory()->create();
    $service = app(PostService::class);

    $service->delete($post->id);

    expect(Post::find($post->id))->toBeNull();
});
