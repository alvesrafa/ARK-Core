<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Services\AclService;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    /**
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'app' => [
                'name' => config('app.name'),
            ],
            'auth' => [
                'user' => function () use ($request) {
                    $user = $request->user();

                    if (! $user) {
                        return null;
                    }

                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'document' => $user->document,
                        'role' => $user->role?->value,
                        'profile_id' => $user->profile_id,
                    ];
                },
            ],
            'menus' => function () use ($request) {
                $user = $request->user();

                if (! $user) {
                    return [];
                }

                return app(AclService::class)->getMenus($user);
            },
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ]);
    }
}
