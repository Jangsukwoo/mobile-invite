const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const os = require("os");

const imagesDir = path.join(__dirname, "../public/images");
const MAX_WIDTH = 1400;
const JPEG_QUALITY = 78;

function getImageFiles() {
  if (!fs.existsSync(imagesDir)) {
    console.log("No public/images directory found.");
    return [];
  }
  return fs.readdirSync(imagesDir).filter((file) => {
    const fullPath = path.join(imagesDir, file);
    return /\.(jpg|jpeg|png)$/i.test(file) && fs.statSync(fullPath).isFile();
  });
}

async function optimizeImage(filename) {
  const inputPath = path.join(imagesDir, filename);
  const ext = path.extname(filename).toLowerCase();
  const isPng = ext === ".png";

  try {
    const stats = fs.statSync(inputPath);
    const originalSize = stats.size;

    let pipeline = sharp(inputPath);
    const meta = await pipeline.metadata();
    const width = meta.width || 0;
    const needResize = width > MAX_WIDTH;

    if (needResize) {
      pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
    }

    const tempPath = path.join(os.tmpdir(), `opt-${Date.now()}-${path.basename(filename)}`);

    if (isPng) {
      await pipeline.png({ compressionLevel: 9, progressive: true }).toFile(tempPath);
    } else {
      await pipeline
        .jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true })
        .toFile(tempPath);
    }

    const newStats = fs.statSync(tempPath);
    const newSize = newStats.size;
    const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);

    fs.copyFileSync(tempPath, inputPath);
    fs.unlinkSync(tempPath);

    console.log(
      `✓ ${filename}: ${(originalSize / 1024).toFixed(1)}KB → ${(newSize / 1024).toFixed(1)}KB (${reduction}% 감소)${needResize ? " [resized]" : ""}`
    );

    return { filename, originalSize, newSize, reduction };
  } catch (error) {
    console.error(`✗ Error optimizing ${filename}:`, error.message);
    return null;
  }
}

async function optimizeAll() {
  const imageFiles = getImageFiles();
  if (imageFiles.length === 0) {
    console.log("No images to optimize.");
    return;
  }

  console.log(`Found ${imageFiles.length} images (max width: ${MAX_WIDTH}px, JPEG quality: ${JPEG_QUALITY})...\n`);

  const results = await Promise.all(imageFiles.map((file) => optimizeImage(file)));

  const successful = results.filter((r) => r !== null);
  const totalOriginal = successful.reduce((sum, r) => sum + r.originalSize, 0);
  const totalNew = successful.reduce((sum, r) => sum + r.newSize, 0);
  const totalReduction =
    totalOriginal > 0 ? ((totalOriginal - totalNew) / totalOriginal * 100).toFixed(1) : "0";

  console.log(`\n=== Optimization Complete ===`);
  console.log(`Optimized: ${successful.length}/${imageFiles.length} images`);
  console.log(
    `Total: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB → ${(totalNew / 1024 / 1024).toFixed(2)}MB (${totalReduction}% reduction)`
  );
}

optimizeAll().catch(console.error);
