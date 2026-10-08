const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  console.log('Generating Diagnostic Care brand assets...');

  const inputPath = path.join(__dirname, '../logo.png');
  const meta = await sharp(inputPath).metadata();
  const w = meta.width;
  const h = meta.height;

  // Load raw RGB data
  const { data: rawRgb } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });

  // Helper to test if a pixel is near-white background
  const isWhite = (x, y) => {
    const idx = (y * w + x) * 3;
    return rawRgb[idx] > 240 && rawRgb[idx + 1] > 240 && rawRgb[idx + 2] > 240;
  };

  // Perform flood fill from perimeter to identify ONLY exterior background pixels
  const exteriorMask = new Uint8Array(w * h);
  const queue = [];

  // Seed with top and bottom edges
  for (let x = 0; x < w; x++) {
    if (isWhite(x, 0)) { exteriorMask[0 * w + x] = 1; queue.push(x, 0); }
    if (isWhite(x, h - 1)) { exteriorMask[(h - 1) * w + x] = 1; queue.push(x, h - 1); }
  }
  // Seed with left and right edges
  for (let y = 0; y < h; y++) {
    if (isWhite(0, y) && !exteriorMask[y * w + 0]) { exteriorMask[y * w + 0] = 1; queue.push(0, y); }
    if (isWhite(w - 1, y) && !exteriorMask[y * w + (w - 1)]) { exteriorMask[y * w + (w - 1)] = 1; queue.push(w - 1, y); }
  }

  let head = 0;
  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];

    const neighbors = [
      cx + 1, cy,
      cx - 1, cy,
      cx, cy + 1,
      cx, cy - 1,
    ];

    for (let i = 0; i < neighbors.length; i += 2) {
      const nx = neighbors[i];
      const ny = neighbors[i + 1];
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
        const nidx = ny * w + nx;
        if (exteriorMask[nidx] === 0 && isWhite(nx, ny)) {
          exteriorMask[nidx] = 1;
          queue.push(nx, ny);
        }
      }
    }
  }

  console.log('Exterior background flood fill complete.');

  // Create full RGBA buffer with transparent exterior and intact interior white cross!
  const rgbaBuffer = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const r = rawRgb[i * 3];
    const g = rawRgb[i * 3 + 1];
    const b = rawRgb[i * 3 + 2];

    const isExt = exteriorMask[i] === 1;
    let alpha = isExt ? 0 : 255;

    // Edge anti-aliasing for smooth outlines
    if (isExt) {
      // Check if neighboring non-exterior pixels exist for subtle feather
      alpha = 0;
    } else {
      // If close to white but inside, keep it solid (like cross)
      alpha = 255;
    }

    rgbaBuffer[i * 4] = r;
    rgbaBuffer[i * 4 + 1] = g;
    rgbaBuffer[i * 4 + 2] = b;
    rgbaBuffer[i * 4 + 3] = alpha;
  }

  const baseTransparent = sharp(rgbaBuffer, { raw: { width: w, height: h, channels: 4 } });

  // 1. Symbol Crop (BBox: minX: 297, maxX: 1010, minY: 240, maxY: 795 -> width: 714, height: 556)
  // Give comfortable 20px padding around symbol
  const symLeft = 285;
  const symTop = 230;
  const symWidth = 735;
  const symHeight = 575;

  const symbolBuffer = await baseTransparent
    .clone()
    .extract({ left: symLeft, top: symTop, width: symWidth, height: symHeight })
    .png()
    .toBuffer();

  // Save symbol-only variants
  await sharp(symbolBuffer).toFile('public/brand/logo-symbol-transparent.png');
  await sharp(symbolBuffer)
    .flatten({ background: '#FFFFFF' })
    .toFile('public/brand/logo-symbol.png');
  console.log('Saved logo-symbol variants');

  // 2. Wordmark Crop (BBox: minX: 101, maxX: 1160, minY: 845, maxY: 992 -> width: 1060, height: 148)
  const wmLeft = 90;
  const wmTop = 840;
  const wmWidth = 1080;
  const wmHeight = 155;

  const wordmarkBuffer = await baseTransparent
    .clone()
    .extract({ left: wmLeft, top: wmTop, width: wmWidth, height: wmHeight })
    .png()
    .toBuffer();

  // 3. Tagline Crop (BBox: minX: 202, maxX: 1066, minY: 1000, maxY: 1055)
  const tagLeft = 190;
  const tagTop = 998;
  const tagWidth = 885;
  const tagHeight = 60;

  const taglineBuffer = await baseTransparent
    .clone()
    .extract({ left: tagLeft, top: tagTop, width: tagWidth, height: tagHeight })
    .png()
    .toBuffer();

  // 4. Build Full Logo (Symbol + Diagnostic Care + Your Healthcare Marketplace)
  const fullLeft = 85;
  const fullTop = 220;
  const fullWidth = 1090;
  const fullHeight = 850;

  const fullLogoBuffer = await baseTransparent
    .clone()
    .extract({ left: fullLeft, top: fullTop, width: fullWidth, height: fullHeight })
    .png()
    .toBuffer();

  await sharp(fullLogoBuffer).toFile('public/brand/logo-full-transparent.png');
  await sharp(fullLogoBuffer)
    .flatten({ background: '#FFFFFF' })
    .toFile('public/brand/logo-full.png');
  // Copy to public/logo.png for default backward compatibility
  await sharp(fullLogoBuffer)
    .flatten({ background: '#FFFFFF' })
    .toFile('public/logo.png');
  console.log('Saved logo-full variants');

  // 5. Build Horizontal Logo (Symbol on left + Diagnostic Care wordmark on right, NO tagline)
  // Symbol height scaled to match wordmark nicely: wordmark is ~155px tall, symbol scaled to ~155px or slightly taller (~180px)
  const targetH = 160;
  const scaledSymbol = await sharp(symbolBuffer)
    .resize({ height: targetH, fit: 'inside' })
    .toBuffer();
  const scaledSymbolMeta = await sharp(scaledSymbol).metadata();

  const scaledWordmark = await sharp(wordmarkBuffer)
    .resize({ height: Math.round(targetH * 0.72), fit: 'inside' })
    .toBuffer();
  const scaledWordmarkMeta = await sharp(scaledWordmark).metadata();

  const gap = 36;
  const paddingH = 30;
  const paddingV = 24;
  const totalH = targetH + paddingV * 2;
  const totalW = scaledSymbolMeta.width + gap + scaledWordmarkMeta.width + paddingH * 2;

  // Composite horizontal logo on transparent background
  const horizontalCanvas = sharp({
    create: {
      width: totalW,
      height: totalH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  });

  const horizontalTransparentBuffer = await horizontalCanvas
    .composite([
      {
        input: scaledSymbol,
        top: paddingV,
        left: paddingH,
      },
      {
        input: scaledWordmark,
        top: paddingV + Math.round((targetH - scaledWordmarkMeta.height) / 2),
        left: paddingH + scaledSymbolMeta.width + gap,
      },
    ])
    .png()
    .toBuffer();

  await sharp(horizontalTransparentBuffer).toFile('public/brand/logo-horizontal-transparent.png');
  await sharp(horizontalTransparentBuffer)
    .flatten({ background: '#FFFFFF' })
    .toFile('public/brand/logo-horizontal.png');
  console.log('Saved logo-horizontal variants');

  // 6. Build Monochrome Logos (Black & White)
  // For monochrome black: turn all non-white/non-transparent pixels to pure black #000000
  // For monochrome white: turn all non-white/non-transparent pixels to pure white #FFFFFF
  const { data: symData, info: symInfo } = await sharp(symbolBuffer).raw().toBuffer({ resolveWithObject: true });
  
  // Symbol monochrome black
  const symMonoBlack = Buffer.alloc(symInfo.width * symInfo.height * 4);
  for (let i = 0; i < symInfo.width * symInfo.height; i++) {
    const a = symData[i * 4 + 3];
    const r = symData[i * 4];
    const g = symData[i * 4 + 1];
    const b = symData[i * 4 + 2];
    symMonoBlack[i * 4] = 0;
    symMonoBlack[i * 4 + 1] = 0;
    symMonoBlack[i * 4 + 2] = 0;
    // Cross inside is white (r > 230, g > 230, b > 230) -> keep cross transparent so black symbol has cross cut out!
    if (r > 230 && g > 230 && b > 230) {
      symMonoBlack[i * 4 + 3] = 0;
    } else {
      symMonoBlack[i * 4 + 3] = a;
    }
  }
  await sharp(symMonoBlack, { raw: { width: symInfo.width, height: symInfo.height, channels: 4 } })
    .png()
    .toFile('public/brand/symbol-monochrome-black.png');

  // Symbol monochrome white
  const symMonoWhite = Buffer.alloc(symInfo.width * symInfo.height * 4);
  for (let i = 0; i < symInfo.width * symInfo.height; i++) {
    const a = symData[i * 4 + 3];
    const r = symData[i * 4];
    const g = symData[i * 4 + 1];
    const b = symData[i * 4 + 2];
    symMonoWhite[i * 4] = 255;
    symMonoWhite[i * 4 + 1] = 255;
    symMonoWhite[i * 4 + 2] = 255;
    if (r > 230 && g > 230 && b > 230) {
      symMonoWhite[i * 4 + 3] = 0;
    } else {
      symMonoWhite[i * 4 + 3] = a;
    }
  }
  await sharp(symMonoWhite, { raw: { width: symInfo.width, height: symInfo.height, channels: 4 } })
    .png()
    .toFile('public/brand/symbol-monochrome-white.png');

  // Horizontal monochrome black
  const { data: hzData, info: hzInfo } = await sharp(horizontalTransparentBuffer).raw().toBuffer({ resolveWithObject: true });
  const hzMonoBlack = Buffer.alloc(hzInfo.width * hzInfo.height * 4);
  const hzMonoWhite = Buffer.alloc(hzInfo.width * hzInfo.height * 4);

  for (let i = 0; i < hzInfo.width * hzInfo.height; i++) {
    const a = hzData[i * 4 + 3];
    const r = hzData[i * 4];
    const g = hzData[i * 4 + 1];
    const b = hzData[i * 4 + 2];

    // Black version
    hzMonoBlack[i * 4] = 0;
    hzMonoBlack[i * 4 + 1] = 0;
    hzMonoBlack[i * 4 + 2] = 0;
    if (r > 230 && g > 230 && b > 230 && a > 100) {
      // interior white cross is cutout
      hzMonoBlack[i * 4 + 3] = 0;
    } else {
      hzMonoBlack[i * 4 + 3] = a;
    }

    // White version
    hzMonoWhite[i * 4] = 255;
    hzMonoWhite[i * 4 + 1] = 255;
    hzMonoWhite[i * 4 + 2] = 255;
    if (r > 230 && g > 230 && b > 230 && a > 100) {
      hzMonoWhite[i * 4 + 3] = 0;
    } else {
      hzMonoWhite[i * 4 + 3] = a;
    }
  }

  await sharp(hzMonoBlack, { raw: { width: hzInfo.width, height: hzInfo.height, channels: 4 } })
    .png()
    .toFile('public/brand/logo-monochrome-black.png');
  await sharp(hzMonoWhite, { raw: { width: hzInfo.width, height: hzInfo.height, channels: 4 } })
    .png()
    .toFile('public/brand/logo-monochrome-white.png');
  console.log('Saved monochrome variants');

  // 7. Generate Favicon & App Icons
  // Use symbol centered with proper safe area
  const makeIcon = async (size, paddingRatio, bg = '#F8F7F4', filename) => {
    const innerSize = Math.round(size * (1 - paddingRatio * 2));
    const resizedSym = await sharp(symbolBuffer)
      .resize(innerSize, innerSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();

    const canvas = sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: bg === 'transparent' ? { r: 0, g: 0, b: 0, alpha: 0 } : bg,
      },
    });

    const offset = Math.round((size - innerSize) / 2);
    await canvas
      .composite([{ input: resizedSym, top: offset, left: offset }])
      .png()
      .toFile(filename);
  };

  // Favicons (transparent for browser tabs)
  await makeIcon(16, 0.04, 'transparent', 'public/icons/favicon-16x16.png');
  await makeIcon(32, 0.05, 'transparent', 'public/icons/favicon-32x32.png');
  await makeIcon(48, 0.06, 'transparent', 'public/icons/favicon-48x48.png');
  await makeIcon(64, 0.06, 'transparent', 'public/icons/favicon-64x64.png');

  // Also write 32x32 as public/favicon.ico
  await makeIcon(32, 0.05, 'transparent', 'public/favicon.ico');

  // Apple Touch Icon (180x180, on Porcelain #F8F7F4 background with 12% safe padding)
  await makeIcon(180, 0.12, '#F8F7F4', 'public/icons/apple-touch-icon.png');
  await makeIcon(180, 0.12, '#F8F7F4', 'public/apple-touch-icon.png');

  // PWA standard icons (192x192 & 512x512 on Porcelain #F8F7F4 background with safe padding)
  await makeIcon(192, 0.12, '#F8F7F4', 'public/icons/icon-192x192.png');
  await makeIcon(512, 0.12, '#F8F7F4', 'public/icons/icon-512x512.png');

  // PWA maskable icon (safe area circle requires ~20% safe margin)
  await makeIcon(512, 0.22, '#F8F7F4', 'public/icons/maskable-icon-512x512.png');

  // PWA shortcuts icons
  await makeIcon(192, 0.15, '#F8F7F4', 'public/icons/shortcut-doctor.png');
  await makeIcon(192, 0.15, '#F8F7F4', 'public/icons/shortcut-test.png');
  await makeIcon(192, 0.15, '#F8F7F4', 'public/icons/shortcut-appointments.png');
  await makeIcon(192, 0.15, '#F8F7F4', 'public/icons/shortcut-vault.png');
  await makeIcon(192, 0.15, '#F8F7F4', 'public/icons/shortcut-emergency.png');
  console.log('Saved all favicon and PWA icons');

  // 8. Generate Open Graph / Social Sharing Card (1200 x 630)
  // Premium Porcelain #F8F7F4 background, Signal Blue #0057FF accent band, full logo centered
  const ogW = 1200;
  const ogH = 630;
  const ogLogoSize = 420;
  const scaledFullLogo = await sharp(fullLogoBuffer)
    .resize(ogLogoSize, ogLogoSize, { fit: 'inside' })
    .toBuffer();
  const ogLogoMeta = await sharp(scaledFullLogo).metadata();

  const ogCanvas = sharp({
    create: {
      width: ogW,
      height: ogH,
      channels: 4,
      background: '#F8F7F4',
    },
  });

  // Create SVG banner overlay for crisp typography and design accents
  const svgOverlay = Buffer.from(`
    <svg width="${ogW}" height="${ogH}" viewBox="0 0 ${ogW} ${ogH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#0057FF"/>
          <stop offset="100%" stop-color="#2563EB"/>
        </linearGradient>
      </defs>
      <!-- Top Signal Blue Brand Line -->
      <rect x="0" y="0" width="${ogW}" height="8" fill="url(#blueGrad)"/>
      <!-- Soft border frame -->
      <rect x="24" y="24" width="${ogW - 48}" height="${ogH - 48}" rx="24" fill="none" stroke="#E5E7EB" stroke-width="2"/>
      <!-- Subtle watermark text in background -->
      <text x="${ogW / 2}" y="580" font-family="Plus Jakarta Sans, sans-serif" font-size="16" font-weight="700" fill="#64748B" text-anchor="middle" letter-spacing="3">
        DIAGNOSTIC CARE • YOUR HEALTHCARE MARKETPLACE
      </text>
    </svg>
  `);

  await ogCanvas
    .composite([
      { input: svgOverlay, top: 0, left: 0 },
      {
        input: scaledFullLogo,
        top: Math.round((ogH - ogLogoMeta.height) / 2) - 20,
        left: Math.round((ogW - ogLogoMeta.width) / 2),
      },
    ])
    .png()
    .toFile('public/brand/og-image.png');
  console.log('Saved public/brand/og-image.png');

  console.log('Brand asset generation finished successfully!');
}

main().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
