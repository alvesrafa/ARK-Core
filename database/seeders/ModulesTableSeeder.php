<?php

namespace Database\Seeders;

use App\Models\Module;
use Illuminate\Database\Seeder;

class ModulesTableSeeder extends Seeder
{
    public function run(): void
    {
        Module::query()->delete();

        Module::create([
            'name' => 'Dashboard',
            'slug' => 'dashboard',
            'path' => '/',
            'icon' => 'layout-dashboard',
            'item_order' => 1,
        ]);

        Module::create([
            'name' => 'Perfis',
            'slug' => 'profiles',
            'path' => '/profiles',
            'icon' => 'shield',
            'item_order' => 2,
        ]);
    }
}
