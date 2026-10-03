# Deploying Chichipolies

The server runbook (layout, first install, workflow, mail) is `deploy/README.md`.
This file holds the application-level rules a production install must follow.

## Story photos

Every upload goes through `App\Services\PhotoStore`: decoded, rotated upright,
scaled to fit 1600 px, re-encoded as JPEG. Re-encoding drops EXIF and GPS data,
so a reporter's location never leaves the server. Needs the PHP **GD** extension
(or Imagick with `PHOTOS_IMAGE_DRIVER=imagick`).

Where files live is `PHOTOS_DISK`:

- `public` (default): `storage/app/public`, served from `/storage`. Run
  `php artisan storage:link` once per install or the photo URLs 404. `APP_URL`
  must be the real https origin because URLs are built from it.
- `r2` or `s3`: an S3-compatible bucket. Set `R2_ACCESS_KEY_ID`,
  `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_ENDPOINT` and `R2_PUBLIC_URL` (the
  public hostname of the bucket). The app server then holds no user content and
  can be rebuilt freely.

Deleting a story through Eloquent deletes its file. Deleting an account deletes
the member's stories one by one so their files go too.

## First admin

A fresh database has no admin. Create or promote one:

    php artisan chichipolies:make-admin you@example.com --owner

New accounts get a random password printed once; ask the person to change it.
