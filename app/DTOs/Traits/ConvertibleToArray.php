<?php

namespace App\DTOs\Traits;

use ReflectionClass;

trait ConvertibleToArray
{
    /**
     * Convert DTO to array recursively.
     */
    public function toArray(): array
    {
        $class = new ReflectionClass($this);
        $array = [];

        foreach ($class->getProperties() as $property) {
            $property->setAccessible(true);
            $value = $property->getValue($this);

            if ($value instanceof \BackedEnum) {
                $array[$property->getName()] = $value->value;
            } elseif (is_object($value) && method_exists($value, 'toArray')) {
                $array[$property->getName()] = $value->toArray();
            } elseif (is_array($value)) {
                $array[$property->getName()] = array_map(function ($item) {
                    if ($item instanceof \BackedEnum) {
                        return $item->value;
                    }

                    return is_object($item) && method_exists($item, 'toArray') ? $item->toArray() : $item;
                }, $value);
            } else {
                $array[$property->getName()] = $value;
            }
        }

        return $array;
    }
}
