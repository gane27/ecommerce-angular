const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../src/assets/images');
const supportedFormats = ['.jpg', '.jpeg', '.png', '.webp'];

// Compression settings
const compressionOptions = {
  jpeg: {
    quality: 80,
    mozjpeg: true
  },
  png: {
    quality: 80,
    compressionLevel: 9
  },
  webp: {
    quality: 80
  }
};

// Target dimensions for optimization
const maxDimensions = {
  product: { width: 500, height: 500 }, // Product images
  carousel: { width: 1920, height: 1080 } // Carousel images
};

async function compressImage(filePath, outputPath) {
  try {
    const stats = await fs.promises.stat(filePath);
    const originalSize = stats.size;
    const ext = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath, ext);
    
    // Determine if it's a carousel or product image
    const isCarousel = fileName.includes('carousel');
    const dimensions = isCarousel ? maxDimensions.carousel : maxDimensions.product;
    
    let sharpInstance = sharp(filePath)
      .resize(dimensions.width, dimensions.height, {
        fit: 'inside',
        withoutEnlargement: true
      });
    
    // Apply format-specific compression
    if (ext === '.jpg' || ext === '.jpeg') {
      await sharpInstance
        .jpeg(compressionOptions.jpeg)
        .toFile(outputPath);
    } else if (ext === '.png') {
      await sharpInstance
        .png(compressionOptions.png)
        .toFile(outputPath);
    } else if (ext === '.webp') {
      await sharpInstance
        .webp(compressionOptions.webp)
        .toFile(outputPath);
    } else {
      // For other formats, just resize
      await sharpInstance.toFile(outputPath);
    }
    
    const newStats = await fs.promises.stat(outputPath);
    const newSize = newStats.size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(2);
    
    console.log(`✓ ${path.basename(filePath)}: ${(originalSize / 1024).toFixed(2)}KB → ${(newSize / 1024).toFixed(2)}KB (${savings}% reduction)`);
    
    return { originalSize, newSize, savings };
  } catch (error) {
    console.error(`✗ Error compressing ${filePath}:`, error.message);
    return null;
  }
}

async function compressAllImages() {
  console.log('🖼️  Starting image compression...\n');
  
  if (!fs.existsSync(imagesDir)) {
    console.error(`Error: Images directory not found at ${imagesDir}`);
    process.exit(1);
  }
  
  const files = fs.readdirSync(imagesDir);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return supportedFormats.includes(ext);
  });
  
  if (imageFiles.length === 0) {
    console.log('No images found to compress.');
    return;
  }
  
  console.log(`Found ${imageFiles.length} image(s) to compress:\n`);
  
  let totalOriginalSize = 0;
  let totalNewSize = 0;
  
  // Create backup directory
  const backupDir = path.join(imagesDir, 'backup');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  for (const file of imageFiles) {
    const filePath = path.join(imagesDir, file);
    const backupPath = path.join(backupDir, file);
    const tempPath = path.join(imagesDir, `temp_${file}`);
    
    // Backup original
    await fs.promises.copyFile(filePath, backupPath);
    
    // Compress to temp file
    const result = await compressImage(filePath, tempPath);
    
    if (result) {
      totalOriginalSize += result.originalSize;
      totalNewSize += result.newSize;
      
      // Replace original with compressed version
      await fs.promises.rename(tempPath, filePath);
    } else {
      // Remove temp file if compression failed
      if (fs.existsSync(tempPath)) {
        await fs.promises.unlink(tempPath);
      }
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`Total: ${(totalOriginalSize / 1024).toFixed(2)}KB → ${(totalNewSize / 1024).toFixed(2)}KB`);
  console.log(`Overall reduction: ${((totalOriginalSize - totalNewSize) / totalOriginalSize * 100).toFixed(2)}%`);
  console.log(`\n✅ Compression complete! Original images backed up to: ${backupDir}`);
  console.log('='.repeat(50));
}

// Run compression
compressAllImages().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
