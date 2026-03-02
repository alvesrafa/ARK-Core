<?php

namespace App\DTOs\Pagination;

class PaginationInputDTO
{
    public function __construct(
        public readonly ?string $search = null,
        public readonly int $perPage = 10,
        public readonly ?int $page = null,
    ) {}
}
