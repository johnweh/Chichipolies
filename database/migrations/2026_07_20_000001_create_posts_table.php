<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('body');
            $table->string('category');
            $table->string('county');
            $table->string('photo_path')->nullable();
            $table->string('video_url')->nullable();
            $table->unsignedInteger('true_votes')->default(0);
            $table->unsignedInteger('false_votes')->default(0);
            $table->timestamps();

            $table->index(['category', 'created_at']);
            $table->index(['county', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
