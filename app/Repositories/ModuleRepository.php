<?php

namespace App\Repositories;

use App\Models\Module;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

class ModuleRepository extends AbstractRepository
{
    protected string $modelClass = Module::class;

    /**
     * @return EloquentCollection<int, Module>
     */
    public function getForMenu(): EloquentCollection
    {
        return $this->newQuery()->orderBy('item_order')->get();
    }
}
