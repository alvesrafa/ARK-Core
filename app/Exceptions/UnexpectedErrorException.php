<?php

namespace App\Exceptions;

use Exception;

class UnexpectedErrorException extends Exception
{
    public function __construct(string $message, int $code = 0)
    {
        parent::__construct("Erro inesperado: {$message}", $code);
    }
}
