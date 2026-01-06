# Product Images

Place your product images in this folder.

## Image Naming Convention
- Use descriptive names: `wireless-headphones.jpg`, `smart-watch.png`, etc.
- Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`

## Usage in Code
After adding images here, reference them in the product data like this:
```typescript
image: 'assets/images/wireless-headphones.jpg'
```

## Image Compression

To optimize images for fast download, run the compression script:

```bash
npm run compress-images
```

This script will:
- ✅ Resize images to optimal dimensions (500x500px for products, 1920x1080px for carousel)
- ✅ Compress images while maintaining quality (80% quality)
- ✅ Create backups of original images in `backup/` folder
- ✅ Reduce file sizes significantly for faster page loads

**Recommended workflow:**
1. Add your images to this folder
2. Run `npm run compress-images` to optimize them
3. Original images are automatically backed up

## Example Images
You can download product images from:
- Unsplash: https://unsplash.com (search for "headphones", "watch", etc.)
- Pexels: https://www.pexels.com
- Pixabay: https://pixabay.com

**Note:** After downloading images, always run the compression script to ensure fast loading times!
