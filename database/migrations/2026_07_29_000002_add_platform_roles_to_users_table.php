<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_owner')->default(false)->after('is_admin');
            $table->boolean('is_employee')->default(false)->after('is_owner');
        });

        $ownerEmail = config('platform.owner_email');

        if ($ownerEmail) {
            User::query()->where('email', $ownerEmail)->update(['is_owner' => true]);
        } else {
            User::query()->where('is_admin', true)->orderBy('id')->limit(1)->update(['is_owner' => true]);
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['is_owner', 'is_employee']);
        });
    }
};
