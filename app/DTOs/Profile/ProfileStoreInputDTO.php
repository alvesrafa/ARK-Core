<?php

namespace App\DTOs\Profile;

use App\DTOs\Traits\ConvertibleToArray;

class ProfileStoreInputDTO
{
    use ConvertibleToArray;

    /**
     * @param  array<int>  $modules
     */
    public function __construct(
        public readonly string $name,
        public readonly array $modules = [],
    ) {}
}
