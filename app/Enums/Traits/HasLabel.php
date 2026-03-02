<?php

namespace App\Enums\Traits;

trait HasLabel
{
    public function label(): string
    {
        return $this->labels()[$this->value] ?? $this->name;
    }

    public static function toArray(): array
    {
        $labels = [];

        foreach (static::cases() as $case) {
            $labels[$case->value] = $case->label();
        }

        return $labels;
    }
}
