<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Keep the earliest report from each person on each story, drop the rest.
        $keep = DB::table('reports')
            ->selectRaw('MIN(id) as id')
            ->groupBy('post_id', 'user_id')
            ->pluck('id');

        DB::table('reports')->whereNotIn('id', $keep)->delete();

        Schema::table('reports', function (Blueprint $table) {
            $table->unique(['post_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropUnique(['post_id', 'user_id']);
        });
    }
};
