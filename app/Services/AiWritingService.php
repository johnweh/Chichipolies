<?php

namespace App\Services;

use App\Models\Post;
use Illuminate\Support\Facades\Http;

class AiWritingService
{
    private const MODEL = 'claude-haiku-4-5-20251001';

    /** @return array{title: string, body: string} */
    public function improvePost(string $title, string $body): array
    {
        $prompt = <<<PROMPT
        You edit community news stories for Chichipolies, Liberia's community news platform.
        Improve the clarity, grammar and structure of this draft story. Keep every fact exactly
        as written — never invent details. Keep the author's voice. Use UK English.

        Title: {$title}

        Story: {$body}

        Respond with ONLY a JSON object: {"title": "...", "body": "..."}
        PROMPT;

        $text = $this->complete($prompt);
        $decoded = json_decode($text, true);

        if (! is_array($decoded) || ! isset($decoded['title'], $decoded['body'])) {
            return ['title' => $title, 'body' => $body];
        }

        return ['title' => (string) $decoded['title'], 'body' => (string) $decoded['body']];
    }

    public function suggestComment(Post $post): string
    {
        $prompt = <<<PROMPT
        Suggest one short, constructive comment (under 40 words) a reader could post on this
        community news story from Liberia. Be supportive or ask a useful follow-up question.
        Use UK English. Respond with the comment text only.

        Title: {$post->title}

        Story: {$post->body}
        PROMPT;

        return trim($this->complete($prompt));
    }

    private function complete(string $prompt): string
    {
        $response = Http::withHeaders([
            'x-api-key' => config('services.anthropic.key'),
            'anthropic-version' => '2023-06-01',
        ])
            ->timeout(15)
            ->post('https://api.anthropic.com/v1/messages', [
                'model' => self::MODEL,
                'max_tokens' => 1024,
                'messages' => [['role' => 'user', 'content' => $prompt]],
            ])
            ->throw();

        return (string) $response->json('content.0.text');
    }
}
