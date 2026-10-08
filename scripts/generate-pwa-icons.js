const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateIcons() {
  const publicDir = path.join(__dirname, '..', 'public');
  const iconsDir = path.join(publicDir, 'icons');
  const logoPath = path.join(publicDir, 'logo.png');

  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  console.log('Generating PWA icons from:', logoPath);

  // 1. Standard 192x192 icon
  await sharp(logoPath)
    .resize(192, 192, { fit: 'contain', background: { r: 10, g: 22, b: 40, alpha: 0 } })
    .png()
    .toFile(path.join(iconsDir, 'icon-192x192.png'));
  console.log('✓ Generated icon-192x192.png');

  // 2. Standard 512x512 icon
  await sharp(logoPath)
    .resize(512, 512, { fit: 'contain', background: { r: 10, g: 22, b: 40, alpha: 0 } })
    .png()
    .toFile(path.join(iconsDir, 'icon-512x512.png'));
  console.log('✓ Generated icon-512x512.png');

  // 3. Maskable 512x512 icon with safe area padding (80% icon size, centered on brand background #0A1628)
  const innerSize = Math.round(512 * 0.76); // Safe zone is inner 80% circle
  const innerBuffer = await sharp(logoPath)
    .resize(innerSize, innerSize, { fit: 'contain', background: { r: 10, g: 22, b: 40, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 10, g: 22, b: 40, alpha: 1 }, // #0A1628 brand navy
    },
  })
    .composite([
      {
        input: innerBuffer,
        gravity: 'centre',
      },
    ])
    .png()
    .toFile(path.join(iconsDir, 'maskable-icon-512x512.png'));
  console.log('✓ Generated maskable-icon-512x512.png');

  // 4. Apple Touch Icon 180x180
  await sharp(logoPath)
    .resize(180, 180, { fit: 'contain', background: { r: 10, g: 22, b: 40, alpha: 1 } })
    .png()
    .toFile(path.join(iconsDir, 'apple-touch-icon.png'));
  console.log('✓ Generated apple-touch-icon.png');

  // Also copy apple-touch-icon to public root for default Safari lookup
  fs.copyFileSync(path.join(iconsDir, 'apple-touch-icon.png'), path.join(publicDir, 'apple-touch-icon.png'));

  // 5. Favicons
  await sharp(logoPath)
    .resize(32, 32, { fit: 'contain', background: { r: 10, g: 22, b: 40, alpha: 0 } })
    .png()
    .toFile(path.join(iconsDir, 'favicon-32x32.png'));

  await sharp(logoPath)
    .resize(16, 16, { fit: 'contain', background: { r: 10, g: 22, b: 40, alpha: 0 } })
    .png()
    .toFile(path.join(iconsDir, 'favicon-16x16.png'));
  console.log('✓ Generated favicons');

  // 6. Shortcut icons (Doctor, Test, Appointments, Vault, Emergency)
  const shortcuts = [
    { name: 'shortcut-doctor.png', color: { r: 8, g: 145, b: 178, alpha: 1 } },
    { name: 'shortcut-test.png', color: { r: 16, g: 185, b: 129, alpha: 1 } },
    { name: 'shortcut-appointments.png', color: { r: 37, g: 99, b: 235, alpha: 1 } },
    { name: 'shortcut-vault.png', color: { r: 139, g: 92, b: 246, alpha: 1 } },
    { name: 'shortcut-emergency.png', color: { r: 225, g: 29, b: 72, alpha: 1 } },
  ];

  for (const s of shortcuts) {
    const sInner = await sharp(logoPath)
      .resize(128, 128, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .toBuffer();
    await sharp({
      create: {
        width: 192,
        height: 192,
        channels: 4,
        background: s.color,
      },
    })
      .composite([{ input: sInner, gravity: 'centre' }])
      .png()
      .toFile(path.join(iconsDir, s.name));
  }
  console.log('✓ Generated shortcut icons');

  console.log('All PWA icons generated successfully!');
}

generateIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
