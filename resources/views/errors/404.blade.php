<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>Page not found — Chichipolies</title>
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&family=Plus+Jakarta+Sans:wght@400..600&display=swap" rel="stylesheet">
    <style>
        :root { color-scheme: light dark; }
        * { margin: 0; box-sizing: border-box; }
        body {
            min-height: 100dvh; display: flex; align-items: center; justify-content: center;
            background: hsl(40, 33%, 97%); color: hsl(30, 12%, 12%);
            font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
            padding: 24px; text-align: center;
        }
        @media (prefers-color-scheme: dark) {
            body { background: hsl(30, 10%, 6%); color: hsl(40, 20%, 92%); }
            .code { color: hsl(222, 48%, 66%) !important; }
            a.btn { background: hsl(222, 48%, 66%) !important; color: hsl(30, 10%, 8%) !important; }
        }
        main { max-width: 26rem; }
        .code { font-family: 'Fraunces', Georgia, serif; font-size: 5rem; font-weight: 600; line-height: 1; color: hsl(224, 58%, 30%); opacity: .35; }
        h1 { font-family: 'Fraunces', Georgia, serif; font-size: 1.75rem; font-weight: 600; margin-top: 12px; letter-spacing: -0.01em; }
        p { margin-top: 10px; font-size: .9rem; line-height: 1.6; opacity: .65; }
        a.btn {
            display: inline-block; margin-top: 28px; padding: 10px 22px; border-radius: 999px;
            background: hsl(224, 58%, 30%); color: hsl(40, 33%, 98%); text-decoration: none;
            font-size: .875rem; font-weight: 600; transition: opacity .3s cubic-bezier(.32,.72,0,1);
        }
        a.btn:hover { opacity: .9; }
    </style>
</head>
<body>
    <main>
        <div class="code">404</div>
        <h1>Page not found</h1>
        <p>The story you are looking for may have been removed, or the link is wrong.</p>
        <a class="btn" href="/">Back to the feed</a>
    </main>
</body>
</html>
