<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MakeAdmin extends Command
{
    protected $signature = 'chichipolies:make-admin
        {email : The person\'s email address}
        {--name= : Name to use if the account has to be created}
        {--owner : Also make this person the platform owner}';

    protected $description = 'Give an account admin rights, creating it if it does not exist. Use this to bootstrap a fresh install.';

    public function handle(): int
    {
        $email = Str::lower(trim((string) $this->argument('email')));

        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error("{$email} is not a valid email address.");

            return self::FAILURE;
        }

        $user = User::query()->where('email', $email)->first();

        if ($user === null) {
            $password = Str::password(20);

            $user = User::create([
                'name' => $this->option('name') ?: Str::before($email, '@'),
                'email' => $email,
                'password' => Hash::make($password),
            ]);

            $user->forceFill(['email_verified_at' => now()])->save();

            $this->info("Created {$email}.");
            $this->line("Temporary password: {$password}");
            $this->line('Ask them to sign in and change it straight away.');
        }

        $user->forceFill([
            'is_admin' => true,
            'is_owner' => $this->option('owner') ? true : $user->is_owner,
            'banned_at' => null,
        ])->save();

        $this->info($user->is_owner
            ? "{$user->email} is now an admin and the platform owner."
            : "{$user->email} is now an admin.");

        return self::SUCCESS;
    }
}
