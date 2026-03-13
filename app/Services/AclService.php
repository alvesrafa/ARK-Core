<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Collection;

class AclService
{
    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function getMenus(User $user): Collection
    {
        $user->loadMissing('profile.modules');

        if (! $user->profile) {
            return collect();
        }

        return $user->profile->modules
            ->sortBy('item_order')
            ->map(function ($module) {
                return [
                    'id' => $module->id,
                    'name' => $module->name,
                    'slug' => $module->slug,
                    'path' => $module->path,
                    'icon' => $module->icon,
                    'item_order' => $module->item_order,
                ];
            })
            ->values();
    }

    public function hasAccess(User $user, string $moduleSlug): bool
    {
        $user->loadMissing('profile.modules');

        if (! $user->profile) {
            return false;
        }

        return $user->profile->modules->contains('slug', $moduleSlug);
    }
}
