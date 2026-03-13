<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\Profile;
use Illuminate\Database\Seeder;

class ProfileModuleSeeder extends Seeder
{
    public function run(): void
    {
        $profile = Profile::query()->where('name', 'Admin')->first();

        if (! $profile) {
            return;
        }

        $moduleIds = Module::query()->pluck('id')->all();
        $profile->modules()->sync($moduleIds);
    }
}
