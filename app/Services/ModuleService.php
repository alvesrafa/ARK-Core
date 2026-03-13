<?php

namespace App\Services;

use App\Repositories\ModuleRepository;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

class ModuleService
{
    public function __construct(
        private ModuleRepository $moduleRepository
    ) {}

    /**
     * @return EloquentCollection<int, \App\Models\Module>
     */
    public function getForMenu(): EloquentCollection
    {
        return $this->moduleRepository->getForMenu();
    }
}
