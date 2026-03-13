<?php

namespace Database\Seeders;

use App\Models\Profile;
use Illuminate\Database\Seeder;

class ProfilesTableSeeder extends Seeder
{
    public function run(): void
    {
        Profile::query()->delete();

        Profile::create([
            'name' => 'Admin',
        ]);
    }
}
