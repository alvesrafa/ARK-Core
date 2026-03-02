<?php

use App\Models\Post;

it('can list posts', function () {
    Post::factory()->count(3)->create();

    $response = $this->get('/posts');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('posts/index')
        ->has('posts.data', 3)
    );
});

it('can show create form', function () {
    $response = $this->get('/posts/create');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('posts/create')
        ->has('statuses')
    );
});

it('can store a post', function () {
    $response = $this->post('/posts', [
        'title' => 'Test Post',
        'content' => 'Test content',
        'status' => 'draft',
    ]);

    $response->assertRedirect('/posts');
    $this->assertDatabaseHas('posts', ['title' => 'Test Post']);
});

it('validates required fields on store', function () {
    $response = $this->post('/posts', []);

    $response->assertSessionHasErrors(['title', 'content', 'status']);
});

it('can show a post', function () {
    $post = Post::factory()->create();

    $response = $this->get("/posts/{$post->id}");

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('posts/show')
        ->has('post')
    );
});

it('can show edit form', function () {
    $post = Post::factory()->create();

    $response = $this->get("/posts/{$post->id}/edit");

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('posts/edit')
        ->has('post')
        ->has('statuses')
    );
});

it('can update a post', function () {
    $post = Post::factory()->create();

    $response = $this->put("/posts/{$post->id}", [
        'title' => 'Updated Title',
        'content' => 'Updated content',
        'status' => 'published',
    ]);

    $response->assertRedirect('/posts');
    $this->assertDatabaseHas('posts', ['id' => $post->id, 'title' => 'Updated Title']);
});

it('can delete a post', function () {
    $post = Post::factory()->create();

    $response = $this->delete("/posts/{$post->id}");

    $response->assertRedirect('/posts');
    $this->assertDatabaseMissing('posts', ['id' => $post->id]);
});

it('can search posts', function () {
    Post::factory()->create(['title' => 'Laravel Guide']);
    Post::factory()->create(['title' => 'React Tips']);

    $response = $this->get('/posts?search=Laravel');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('posts/index')
        ->has('posts.data', 1)
    );
});
