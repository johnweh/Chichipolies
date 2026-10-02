<?php

use App\Models\Post;
use App\Models\User;
use App\Services\PhotoStore;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * Build a real JPEG and splice an EXIF APP1 segment in after the SOI marker,
 * the way a phone camera would. Minimal but valid: a TIFF header and an
 * empty IFD. We only need something `Exif` to look for afterwards.
 */
function jpegWithExif(int $width = 400, int $height = 300): UploadedFile
{
    $image = imagecreatetruecolor($width, $height);
    imagefill($image, 0, 0, imagecolorallocate($image, 30, 90, 160));
    ob_start();
    imagejpeg($image, null, 90);
    $jpeg = ob_get_clean();
    imagedestroy($image);

    $tiff = "II*\x00".pack('V', 8).pack('v', 0);
    $payload = "Exif\x00\x00".$tiff;
    $app1 = "\xFF\xE1".pack('n', strlen($payload) + 2).$payload;

    $bytes = substr($jpeg, 0, 2).$app1.substr($jpeg, 2);

    $path = tempnam(sys_get_temp_dir(), 'exif').'.jpg';
    file_put_contents($path, $bytes);

    return new UploadedFile($path, 'phone-photo.jpg', 'image/jpeg', null, true);
}

function postPayload(array $overrides = []): array
{
    return [
        'title' => 'Flooding on Tubman Boulevard',
        'body' => 'Water has covered the road near the junction since this morning.',
        'category' => 'Other',
        'county' => 'Montserrado',
        ...$overrides,
    ];
}

beforeEach(fn () => Storage::fake('public'));

it('strips EXIF metadata from uploaded photos', function () {
    $upload = jpegWithExif();
    expect(str_contains(file_get_contents($upload->getRealPath()), "Exif\x00\x00"))->toBeTrue();

    $this->actingAs(User::factory()->create())
        ->post(route('posts.store'), postPayload(['photo' => $upload]))
        ->assertRedirect();

    $post = Post::query()->latest('id')->firstOrFail();
    $stored = Storage::disk('public')->get($post->photo_path);

    expect($stored)->not->toContain("Exif\x00\x00")
        ->and($post->photo_path)->toStartWith('posts/')
        ->and($post->photo_path)->toEndWith('.jpg');
});

it('scales large photos down and re-encodes everything as jpeg', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('posts.store'), postPayload(['photo' => UploadedFile::fake()->image('huge.png', 3200, 2000)]))
        ->assertRedirect();

    $post = Post::query()->latest('id')->firstOrFail();
    [$width, $height, $type] = getimagesizefromstring(Storage::disk('public')->get($post->photo_path));

    expect($width)->toBe(1600)
        ->and($height)->toBe(1000)
        ->and($type)->toBe(IMAGETYPE_JPEG);
});

it('leaves small photos at their own size', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('posts.store'), postPayload(['photo' => UploadedFile::fake()->image('small.jpg', 640, 480)]))
        ->assertRedirect();

    $post = Post::query()->latest('id')->firstOrFail();
    [$width, $height] = getimagesizefromstring(Storage::disk('public')->get($post->photo_path));

    expect([$width, $height])->toBe([640, 480]);
});

it('removes the photo file when an admin deletes the story', function () {
    $post = Post::factory()->create(['photo_path' => 'posts/2026/10/gone.jpg']);
    Storage::disk('public')->put($post->photo_path, 'bytes');

    $this->actingAs(User::factory()->admin()->create())
        ->delete(route('admin.posts.destroy', $post))
        ->assertRedirect();

    Storage::disk('public')->assertMissing('posts/2026/10/gone.jpg');
    expect(Post::query()->find($post->id))->toBeNull();
});

it('removes every photo when a member deletes their account', function () {
    $user = User::factory()->create(['password' => bcrypt('password')]);
    $posts = Post::factory()->count(2)->for($user)->sequence(
        ['photo_path' => 'posts/a.jpg'],
        ['photo_path' => 'posts/b.jpg'],
    )->create();
    $posts->each(fn (Post $post) => Storage::disk('public')->put($post->photo_path, 'bytes'));

    $this->actingAs($user)
        ->delete(route('profile.destroy'), ['password' => 'password'])
        ->assertRedirect('/');

    Storage::disk('public')->assertMissing('posts/a.jpg');
    Storage::disk('public')->assertMissing('posts/b.jpg');
    expect(Post::query()->where('user_id', $user->id)->count())->toBe(0);
});

it('builds photo urls from the configured disk', function () {
    config(['filesystems.photos' => 'public']);
    $post = Post::factory()->create(['photo_path' => 'posts/x.jpg']);

    expect($post->photo_url)->toEndWith('/storage/posts/x.jpg')
        ->and(Post::factory()->create(['photo_path' => null])->photo_url)->toBeNull()
        ->and(app(PhotoStore::class)->diskName())->toBe('public');
});
