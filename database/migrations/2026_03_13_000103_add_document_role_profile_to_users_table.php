<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('document')->nullable()->unique()->after('name');
            $table->string('role')->default('ADMIN')->after('password');
            $table->foreignId('profile_id')->nullable()->after('role')->constrained('profiles')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['profile_id']);
            $table->dropColumn(['document', 'role', 'profile_id']);
        });
    }
};
