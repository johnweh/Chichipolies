<?php

namespace App\Services;

use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\Drivers\Imagick\Driver as ImagickDriver;
use Intervention\Image\ImageManager;

/**
 * Every story photo passes through here before it is kept.
 *
 * The upload is decoded and re-encoded, which drops EXIF, GPS and any other
 * metadata a reporter's phone wrote into the file. It is rotated upright
 * first (phones record orientation as a tag, which would otherwise be lost)
 * and scaled down so a 12 MP original becomes something that loads on 3G.
 *
 * Files live on the disk named by `filesystems.photos`: `public` on a single
 * server (needs `php artisan storage:link`), or an S3-compatible bucket such
 * as Cloudflare R2 so the web node holds no user content.
 */
class PhotoStore
{
    public const DIRECTORY = 'posts';

    public function __construct(private readonly ImageManager $images) {}

    public static function make(): self
    {
        $driver = config('photos.driver', 'gd') === 'imagick' && extension_loaded('imagick')
            ? new ImagickDriver
            : new GdDriver;

        return new self(new ImageManager($driver));
    }

    public function disk(): Filesystem
    {
        return Storage::disk($this->diskName());
    }

    public function diskName(): string
    {
        return (string) config('filesystems.photos', 'public');
    }

    /**
     * Clean, shrink and store an upload. Returns the stored path.
     */
    public function store(UploadedFile $upload): string
    {
        $image = $this->images->read($upload->getRealPath())
            ->scaleDown(width: (int) config('photos.max_width', 1600), height: (int) config('photos.max_height', 1600));

        $encoded = $image->toJpeg(quality: (int) config('photos.quality', 82));

        $path = self::DIRECTORY.'/'.now()->format('Y/m').'/'.Str::uuid().'.jpg';

        $this->disk()->put($path, (string) $encoded, ['visibility' => 'public']);

        return $path;
    }

    public function delete(?string $path): void
    {
        if ($path !== null && $path !== '') {
            $this->disk()->delete($path);
        }
    }

    public function url(?string $path): ?string
    {
        return $path ? $this->disk()->url($path) : null;
    }
}
