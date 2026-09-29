const sharp = require('sharp');
const fs = require('fs');

async function processImage(file) {
  if (!fs.existsSync(file)) return;
  
  const img = sharp(file);
  const metadata = await img.metadata();
  const width = metadata.width;
  const height = metadata.height;
  const size = Math.min(width, height);
  const r = size / 2;

  const circleSvg = `<svg width="${size}" height="${size}"><circle cx="${r}" cy="${r}" r="${r}" /></svg>`;

  const buffer = await img
    .resize(size, size)
    .composite([{
      input: Buffer.from(circleSvg),
      blend: 'dest-in'
    }])
    .png()
    .toBuffer();

  fs.writeFileSync(file, buffer);
  console.log('Made round:', file);
}

async function run() {
  const files = [
    'public/favicon-16x16.png',
    'public/favicon-32x32.png',
    'public/android-chrome-192x192.png',
    'public/android-chrome-512x512.png',
    'public/apple-touch-icon.png'
  ];
  
  for (const f of files) {
    await processImage(f);
  }
  if (fs.existsSync('public/favicon-32x32.png')) {
     fs.copyFileSync('public/favicon-32x32.png', 'public/favicon.ico');
  }
}
run();
