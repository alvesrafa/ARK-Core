<?php

namespace App\Http\Middleware;

use App\Services\AclService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureModuleAccess
{
    public function __construct(
        private AclService $aclService
    ) {}

    /**
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $module): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(401);
        }

        if (! $this->aclService->hasAccess($user, $module)) {
            abort(403);
        }

        return $next($request);
    }
}
