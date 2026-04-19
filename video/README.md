# Banger Promo Video

60-second promo video for Banger, built with **Remotion**. Deep-fried sticker design, matches the extension's vibe.

- **Output:** `out/banger-promo.mp4` (1920×1080, 30fps, H.264)
- **Bonus:** `out/banger-promo-vertical.mp4` (1080×1920 for TikTok / Reels / X Shorts)
- **Audio:** music + voice-over slots supported, gracefully omitted if not provided
- **Brand:** uses `public/logo.png` (your flaming diamond)

---

## 📋 What you need to drop in before rendering

Everything slot-based lives in `public/`. The video renders with **obvious placeholders** where files are missing, so you'll see exactly which slots still need content.

### 1. Product demo clips

Record three short screen clips (see [`public/clips/README.md`](./public/clips/README.md) for a shot list):

```
public/clips/demo-1.mp4   ← ~9s: open X, click diamond, popover opens
public/clips/demo-2.mp4   ← ~9s: slots loaded, pick a GIF
public/clips/demo-3.mp4   ← ~8s: GIF embedded in posted reply
```

### 2. Background music

Drop a royalty-free upbeat track (punk / hyperpop / lo-fi electronic works) at:

```
public/music.mp3
```

**Free sources:**
- [Uppbeat](https://uppbeat.io) — free with attribution
- [Artlist Free](https://artlist.io/free) — no attribution required on their free plan
- [YouTube Audio Library](https://studio.youtube.com/channel/UC/music) — fully free
- [Pixabay Music](https://pixabay.com/music/) — CC0

### 3. Voice-over *(optional, but recommended)*

Drop a generated or recorded voice-over at:

```
public/voiceover.mp3
```

**Suggested script (~40 words, 18 seconds at normal pace — starts 3s into the video):**

> Your X replies deserve better. Meet Banger — an AI that reads every tweet, picks five GIF reactions tuned to the vibe, and attaches the winner in one click. Free. Open source. Hit the flaming diamond. Make it a banger.

**How to generate a voice-over:**
- [ElevenLabs](https://elevenlabs.io) — pick a punchy voice like "Adam" or "Antoni"; export as MP3
- [OpenAI TTS](https://platform.openai.com/docs/guides/text-to-speech) — use `gpt-4o-mini-tts` with voice `onyx` or `nova`
- Record yourself on a phone / any mic; punch-in works fine at this length

### 4. Logo

The flaming diamond PNG is already copied to `public/logo.png`. Keep it as-is unless you update the brand.

---

## ▶️ Running

```bash
cd video
pnpm install             # or npm install
pnpm dev                 # opens Remotion Studio — interactive preview
```

The Studio lets you scrub through the video frame-by-frame and see live updates as you edit scene files.

---

## 🎬 Rendering

```bash
pnpm render              # 1920×1080 landscape → out/banger-promo.mp4
pnpm render-shorts       # 1080×1920 vertical  → out/banger-promo-vertical.mp4
```

First render takes a couple minutes (Chrome headless spins up). Subsequent renders are faster.

---

## 🎨 Customizing

- **Per-scene durations** — edit `DURATIONS` in [`src/Video.tsx`](./src/Video.tsx)
- **Colors** — all brand tokens in [`src/colors.ts`](./src/colors.ts)
- **Copy** — edit the text strings in each scene under [`src/scenes/`](./src/scenes/)
- **New scene** — drop a `src/scenes/YourScene.tsx`, import it in `Video.tsx`, add a `<Series.Sequence>` with a duration

### Scene layout

| # | Duration | Scene | What's shown |
|---|---|---|---|
| 1 | 3s | Intro | Logo slam + BANGER wordmark |
| 2 | 5s | Problem | "Your replies deserve better." |
| 3 | 9s | ClipSlot #1 | Your demo recording — click the diamond |
| 4 | 6s | FiveVibes | 5 color-coded vibe slot cards |
| 5 | 9s | ClipSlot #2 | Your demo recording — pick + insert |
| 6 | 8s | ClipSlot #3 | Your demo recording — posted reply |
| 7 | 20s | CTA | Logo + "free & open source" + links |

Total: 60 seconds

---

## 🛠️ Tech

- [Remotion](https://remotion.dev) 4.x — React-based video framework
- `@remotion/google-fonts` for Anton + Inter
- TypeScript + React 19

---

## 📜 License

MIT — same as the parent project.
