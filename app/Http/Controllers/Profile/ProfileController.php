<?php

namespace App\Http\Controllers\Profile;

use App\DTOs\Profile\ProfileStoreInputDTO;
use App\DTOs\Profile\ProfileUpdateInputDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\ProfileStoreRequest;
use App\Http\Requests\Profile\ProfileUpdateRequest;
use App\Services\ModuleService;
use App\Services\ProfileService;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function __construct(
        private ProfileService $profileService,
        private ModuleService $moduleService,
    ) {}

    public function index()
    {
        $profiles = $this->profileService->getAll();

        return Inertia::render('profiles/index', [
            'profiles' => $profiles,
        ]);
    }

    public function create()
    {
        return Inertia::render('profiles/create', [
            'modules' => $this->moduleService->getForMenu(),
        ]);
    }

    public function store(ProfileStoreRequest $request)
    {
        $data = $request->validated();

        $this->profileService->create(new ProfileStoreInputDTO(
            name: $data['name'],
            modules: array_map('intval', $data['modules'] ?? []),
        ));

        return redirect()
            ->route('profiles.index')
            ->with('success', 'Perfil criado com sucesso!');
    }

    public function edit(int $id)
    {
        $profile = $this->profileService->findWithModules($id);

        return Inertia::render('profiles/edit', [
            'profile' => $profile,
            'modules' => $this->moduleService->getForMenu(),
        ]);
    }

    public function update(ProfileUpdateRequest $request, int $id)
    {
        $data = $request->validated();

        $this->profileService->update($id, new ProfileUpdateInputDTO(
            name: $data['name'],
            modules: array_map('intval', $data['modules'] ?? []),
        ));

        return redirect()
            ->route('profiles.index')
            ->with('success', 'Perfil atualizado com sucesso!');
    }

    public function destroy(int $id)
    {
        $this->profileService->delete($id);

        return redirect()
            ->route('profiles.index')
            ->with('success', 'Perfil removido com sucesso!');
    }
}
