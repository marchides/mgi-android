# Monty's GLM Interface (MGI)

A polished mobile-first PWA chat client for **GLM models via OpenRouter**, using your own API key.

## Features

- Chat with `z-ai/glm-5.2` (default), `glm-5.2:floor`, `glm-5.1`, `glm-4.6`, or any custom OpenRouter model ID.
- Routing modes: **Balanced**, **Cheapest** (`sort: price`, price caps), **Fastest** (`sort: throughput`).
- Full model parameter control: temperature, top_p, top_k, frequency/presence/repetition penalty, reasoning effort (high / x-high), include-reasoning toggle.
- Dynamic max-output-token calculation up to the 1,048,576-token context window (Short / Normal / Long / Huge / Extreme / **Max Possible**).
- Conversation history, rename, delete, search, clear, copy, regenerate, edit-and-resubmit, stop generation.
- Streaming responses, markdown + code blocks with copy button.
- History modes: full / recent N / auto-trim.
- Optional system prompt.
- Light & dark themes + 7 accent colors, system-mode auto-switch.
- API key stored **locally on device only** (localStorage). Never logged, never sent anywhere except OpenRouter.
- Installable PWA: works offline shell, "Add to Home Screen" on Android/iOS.

## Run

```bash
bun install
bun run dev
```

Open in a mobile browser or use device emulation.

## Add your API key

1. Get a key at https://openrouter.ai/keys
2. Open **Settings** in MGI
3. Paste the key, tap **Verify**, then **Save**

## Ship to Android

Two supported paths:

### 1. Trusted Web Activity (Play Store)

Publish the PWA, then wrap with [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap):

```bash
npm i -g @bubblewrap/cli
bubblewrap init --manifest https://<your-domain>/manifest.webmanifest
bubblewrap build
```

Upload the resulting `.aab` to Play Console.

### 2. Capacitor (native shell)

```bash
bun add @capacitor/core @capacitor/cli @capacitor/android
bunx cap init "MGI" "com.monty.mgi" --web-dir=dist
bun run build
bunx cap add android
bunx cap sync android
bunx cap open android
```

Then build a signed APK/AAB from Android Studio.

## Security

- The OpenRouter API key lives only in `localStorage` under `mgi:settings:v1`.
- The key is included only in `Authorization: Bearer …` headers to `openrouter.ai`.
- No analytics, no backend, no telemetry.
- Do not commit `.env` files — none are required.
