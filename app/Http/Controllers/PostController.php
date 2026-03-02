<?php

namespace App\Http\Controllers;

use App\DTOs\Pagination\PaginationInputDTO;
use App\DTOs\Post\CreatePostDTO;
use App\Enums\PostStatusEnum;
use App\Http\Requests\Post\StorePostRequest;
use App\Http\Requests\Post\UpdatePostRequest;
use App\Services\PostService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function __construct(
        private PostService $service,
    ) {}

    public function index(Request $request): Response
    {
        $pagination = new PaginationInputDTO(
            search: $request->query('search'),
            perPage: (int) $request->query('per_page', '10'),
            page: $request->query('page') ? (int) $request->query('page') : null,
        );

        $posts = $this->service->paginate($pagination);

        return Inertia::render('posts/index', [
            'posts' => $posts,
            'filters' => [
                'search' => $pagination->search,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('posts/create', [
            'statuses' => PostStatusEnum::toArray(),
        ]);
    }

    public function store(StorePostRequest $request): RedirectResponse
    {
        $dto = new CreatePostDTO(
            title: $request->validated('title'),
            content: $request->validated('content'),
            status: PostStatusEnum::from($request->validated('status')),
        );

        $this->service->create($dto);

        return redirect()
            ->route('posts.index')
            ->with('success', 'Post criado com sucesso.');
    }

    public function show(int $id): Response
    {
        $post = $this->service->findById($id);

        return Inertia::render('posts/show', [
            'post' => $post->toArray(),
        ]);
    }

    public function edit(int $id): Response
    {
        $post = $this->service->findById($id);

        return Inertia::render('posts/edit', [
            'post' => $post->toArray(),
            'statuses' => PostStatusEnum::toArray(),
        ]);
    }

    public function update(UpdatePostRequest $request, int $id): RedirectResponse
    {
        $this->service->update($request->validated(), $id);

        return redirect()
            ->route('posts.index')
            ->with('success', 'Post atualizado com sucesso.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $this->service->delete($id);

        return redirect()
            ->route('posts.index')
            ->with('success', 'Post excluído com sucesso.');
    }
}
