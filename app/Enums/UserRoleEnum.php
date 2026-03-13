<?php

namespace App\Enums;

use App\Enums\Traits\HasLabel;

enum UserRoleEnum: string
{
    use HasLabel;

    case Admin = 'ADMIN';

    public function labels(): array
    {
        return [
            self::Admin->value => 'Administrador',
        ];
    }
}
