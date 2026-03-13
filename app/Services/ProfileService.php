<?php

namespace App\Services;

use App\DTOs\Profile\ProfileStoreInputDTO;
use App\DTOs\Profile\ProfileUpdateInputDTO;
use App\Models\Profile;
use App\Repositories\ProfileRepository;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Pagination\AbstractPaginator as Paginator;

class ProfileService
{
    public function __construct(
        private ProfileRepository $profileRepository
    ) {}

    /**
     * @return Paginator
     */
    public function paginate(int $perPage = 10): Paginator
    {
        return $this->profileRepository->paginateWithModules($perPage);
    }

    /**
     * @return EloquentCollection<int, Profile>
     */
    public function getAll(): EloquentCollection
    {
        return $this->profileRepository->getAllWithModules();
    }

    public function findWithModules(int $id): Profile
    {
        return $this->profileRepository->findWithModules($id);
    }

    public function create(ProfileStoreInputDTO $input): Profile
    {
        /** @var Profile $profile */
        $profile = $this->profileRepository->create($input->toArray());

        $this->profileRepository->syncModules($profile->id, $input->modules);

        return $profile;
    }

    public function update(int $id, ProfileUpdateInputDTO $input): Profile
    {
        /** @var Profile $profile */
        $profile = $this->profileRepository->update($input->toArray(), $id);

        $this->profileRepository->syncModules($profile->id, $input->modules);

        return $profile;
    }

    public function delete(int $id): bool
    {
        return $this->profileRepository->deleteById($id);
    }
}
