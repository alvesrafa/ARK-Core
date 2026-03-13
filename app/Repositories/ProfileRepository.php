<?php

namespace App\Repositories;

use App\Models\Profile;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Pagination\AbstractPaginator as Paginator;

class ProfileRepository extends AbstractRepository
{
    protected string $modelClass = Profile::class;

    /**
     * @return Paginator
     */
    public function paginateWithModules(int $perPage = 10): Paginator
    {
        return $this->newQuery()
            ->withCount('modules')
            ->orderBy('name')
            ->paginate($perPage);
    }

    /**
     * @return EloquentCollection<int, Profile>
     */
    public function getAllWithModules(): EloquentCollection
    {
        return $this->newQuery()
            ->with('modules')
            ->orderBy('name')
            ->get();
    }

    public function findWithModules(int $id): Profile
    {
        return $this->newQuery()->with('modules')->findOrFail($id);
    }

    /**
     * @param  array<int>  $moduleIds
     */
    public function syncModules(int $profileId, array $moduleIds): void
    {
        /** @var Profile $profile */
        $profile = $this->newQuery()->findOrFail($profileId);
        $profile->modules()->sync($moduleIds);
    }
}
