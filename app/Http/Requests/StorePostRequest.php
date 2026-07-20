<?php

namespace App\Http\Requests;

use App\Enums\Category;
use App\Enums\County;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:150'],
            'body' => ['required', 'string', 'min:20', 'max:10000'],
            'category' => ['required', Rule::enum(Category::class)],
            'county' => ['required', Rule::enum(County::class)],
            'photo' => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:5120'],
            'video_url' => [
                'nullable', 'url', 'max:500',
                'regex:#^https?://(www\.)?(youtube\.com|youtu\.be|tiktok\.com|facebook\.com|fb\.watch)/#i',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'video_url.regex' => 'Video links must be from YouTube, TikTok or Facebook.',
        ];
    }
}
