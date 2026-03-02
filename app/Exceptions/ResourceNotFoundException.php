<?php

namespace App\Exceptions;

use Exception;

class ResourceNotFoundException extends Exception
{
    public function __construct(string $resource)
    {
        parent::__construct(message: "Recurso {$resource} não encontrado.");
    }
}
