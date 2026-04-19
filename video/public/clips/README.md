# Drop your screen recordings here

Replace or add these three files:

| File | What to record | Duration |
|---|---|---|
| `demo-1.mp4` | Open x.com, click Reply on a tweet, show the flaming diamond badge appearing at your avatar's top-right corner and clicking it → popover appears | ~9 seconds |
| `demo-2.mp4` | Popover is open, the 5 vibe slots are filled with GIFs; drag the slider; click one slot | ~9 seconds |
| `demo-3.mp4` | The picked GIF is attached in the composer and the reply is posted, showing the GIF embedded natively in the tweet card | ~8 seconds |

**Recommended specs**
- 1920×1080 (16:9) — matches the main video dimensions
- 30fps
- Short and punchy — overs-hooting looks fine since the Video.tsx trims to the scene's duration

**Capture tips**
- Use macOS screen-record (Cmd+Shift+5), Windows Xbox Game Bar (Win+G), or OBS
- Keep the mouse cursor visible; Banger's badge animation reads better with a visible pointer
- Don't worry about audio — clip audio is muted in Video.tsx (`volume={0}`)

If any file is missing, the video will show a clearly-marked "DROP CLIP HERE" placeholder in that slot so you know which one to add.
