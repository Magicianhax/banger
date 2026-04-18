# Banger

AI-powered meme reply suggestions for X. A Chrome extension that turns your reply box into a reaction-meme machine.

## How it works

1. You open a reply box on x.com.
2. Click the button that appears in the composer toolbar.
3. Five suggested reactions load — one per vibe (agree, mock, shocked, wholesome, savage).
4. Drag the slider to tune intensity.
5. Click one → it inserts into your reply.

## BYOK (Bring Your Own Key)

Banger uses your own LLM provider key. Supported: Anthropic (Claude), OpenAI (GPT), Google (Gemini). Your key stays on your device in `chrome.storage.local` and never hits our servers.

## Structure

- `packages/shared` — Zod schemas + types shared between extension and backend
- `packages/backend` — Next.js app proxying GIPHY + Tenor search (host: banger.magician.wtf)
- `packages/extension` — MV3 Chrome extension

## Local development

```bash
pnpm install
pnpm --filter @banger/extension dev      # builds extension to packages/extension/dist (rebuild on change)
pnpm --filter @banger/backend dev        # runs Next.js at http://localhost:3000
```

Load the extension in Chrome:
1. Open `chrome://extensions`
2. Enable Developer mode
3. Click "Load unpacked" → select `packages/extension/dist`

Set your LLM key in the extension popup (click the Banger icon in Chrome's extensions toolbar).

## Environment variables (backend)

Create `packages/backend/.env.local`:

```
GIPHY_API_KEY=your_giphy_key_from_developers.giphy.com
TENOR_API_KEY=your_tenor_key_from_console.cloud.google.com
```

## Testing

```bash
pnpm test
```

## License

MIT — see LICENSE.
