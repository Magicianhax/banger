#!/usr/bin/env node
// Generate icon sizes for the Chrome extension + Next.js favicon.
// Uses sharp (already hoisted into the monorepo via Next.js).

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SOURCE = 'E:/tools/four.meme/52be2b83-457f-411f-bef8-989cfc37935d.png';

if (!fs.existsSync(SOURCE)) {
  console.error(`Source not found: ${SOURCE}`);
  process.exit(1);
}

// Paths relative to the monorepo root, one level up from this script.
const targets = [
  // Chrome extension manifest icons
  { out: '../extension/public/icon-16.png',  size: 16  },
  { out: '../extension/public/icon-32.png',  size: 32  },
  { out: '../extension/public/icon-48.png',  size: 48  },
  { out: '../extension/public/icon-128.png', size: 128 },

  // Next.js app favicon + apple icon
  // App Router picks up `icon.png` at app/ root automatically.
  { out: 'app/icon.png',                     size: 256 },
  { out: 'app/apple-icon.png',               size: 180 },
];

for (const { out, size } of targets) {
  const dir = path.dirname(out);
  fs.mkdirSync(dir, { recursive: true });
  await sharp(SOURCE)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(out);
  const bytes = fs.statSync(out).size;
  console.log(`✓ ${out}  ${size}×${size}  ${bytes.toLocaleString()} bytes`);
}
