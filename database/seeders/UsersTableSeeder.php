<?php

namespace Database\Seeders;

use App\Enums\UserRoleEnum;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    public function run(): void
    {
        $profile = Profile::query()->where('name', 'Admin')->first();

        User::query()->updateOrCreate(
            ['email' => 'admin@ark.local'],
            [
                'name' => 'Administrador',
                'document' => '00000000000',
                'password' => Hash::make('password'),
                'role' => UserRoleEnum::Admin,
                'profile_id' => $profile?->id,
            ]
        );
    }
}
