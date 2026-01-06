const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../src/assets/images');

// Ensure images directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Image URLs to download
const imagesToDownload = {
  // Product images
  'wireless-headphones.jpg': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
  'smart-watch.jpg': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
  'laptop-backpack.jpg': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
  'wireless-mouse.jpg': 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&q=80',
  'usb-c-hub.jpg': 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=500&fit=crop&auto=format&q=80',
  'mechanical-keyboard.jpg': 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&q=80',
  'phone-stand.jpg': 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&q=80',
  'power-bank.jpg': 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=500&fit=crop&auto=format&q=80',
  
  // Carousel images
  'carousel-1.jpg': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80',
  'carousel-2.jpg': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80',
  'carousel-3.jpg': 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1920&q=80',
  
  // Placeholder image (simple SVG converted to data URL, but we'll create a simple placeholder)
  'placeholder.jpg': 'https://images.unsplash.com/photo-1557683316-973673baf926?w=500&h=300&fit=crop&q=80'
};

function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location, filePath)
          .then(resolve)
          .catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      const fileStream = fs.createWriteStream(filePath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        const stats = fs.statSync(filePath);
        console.log(`✓ Downloaded: ${path.basename(filePath)} (${(stats.size / 1024).toFixed(2)}KB)`);
        resolve();
      });
      
      fileStream.on('error', (err) => {
        fs.unlink(filePath, () => {}); // Delete the file on error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function downloadAllImages() {
  console.log('📥 Starting image download...\n');
  console.log(`Target directory: ${imagesDir}\n`);
  
  const entries = Object.entries(imagesToDownload);
  let successCount = 0;
  let failCount = 0;
  
  for (const [filename, url] of entries) {
    const filePath = path.join(imagesDir, filename);
    
    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`⊘ Skipped (already exists): ${filename}`);
      continue;
    }
    
    try {
      await downloadImage(url, filePath);
      successCount++;
    } catch (error) {
      console.error(`✗ Failed to download ${filename}:`, error.message);
      failCount++;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Download complete!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Failed: ${failCount}`);
  console.log(`   Skipped: ${entries.length - successCount - failCount}`);
  console.log('='.repeat(50));
  console.log('\n💡 Next step: Run "npm run compress-images" to optimize the downloaded images.');
}

// Run download
downloadAllImages().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
