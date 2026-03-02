<?php

use App\DTOs\Pagination\PaginationInputDTO;
use App\Models\Post;
use App\Repositories\PostRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can create a post', function () {
    $repo = app(PostRepository::class);

    $post = $repo->create([
        'title' => 'Test Post',
        'content' => 'Content',
        'status' => 'draft',
    ]);

    expect($post->title)->toBe('Test Post');
    expect($post->exists)->toBeTrue();
});

it('can find a post by id', function () {
    $post = Post::factory()->create();
    $repo = app(PostRepository::class);

    $found = $repo->findByID($post->id);

    expect($found->id)->toBe($post->id);
});

it('can update a post', function () {
    $post = Post::factory()->create();
    $repo = app(PostRepository::class);

    $repo->update(['title' => 'Updated'], $post->id);

    expect($post->fresh()->title)->toBe('Updated');
});

it('can delete a post', function () {
    $post = Post::factory()->create();
    $repo = app(PostRepository::class);

    $repo->deleteById($post->id);

    expect(Post::find($post->id))->toBeNull();
});

it('can paginate with search', function () {
    Post::factory()->create(['title' => 'Laravel Guide']);
    Post::factory()->create(['title' => 'React Tips']);
    $repo = app(PostRepository::class);

    $pagination = new PaginationInputDTO(search: 'Laravel');
    $result = $repo->paginate($pagination);

    expect($result)->toHaveCount(1);
});
