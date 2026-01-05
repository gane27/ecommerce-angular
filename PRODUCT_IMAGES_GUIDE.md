# Product Images Guide

## Current Setup
The application currently uses **Unsplash** URLs for product images. These are working and will display automatically.

## Option 1: Keep Using Online Images (Current - Easiest)

The current setup uses Unsplash URLs which work immediately. You can:
- **Keep as is** - Images are already working
- **Replace URLs** - Find new images and update the URLs in `src/app/components/home/home.component.ts`

### Finding Images on Unsplash:
1. Go to https://unsplash.com
2. Search for your product (e.g., "wireless headphones", "smart watch")
3. Click on an image you like
4. Click "Download" or copy the image URL
5. Replace the URL in the product data

## Option 2: Use Local Images (Better for Production)

### Step 1: Download Images
1. Download product images from:
   - **Unsplash**: https://unsplash.com
   - **Pexels**: https://www.pexels.com
   - **Pixabay**: https://pixabay.com

2. Save them to: `src/assets/images/`
   - Example: `src/assets/images/wireless-headphones.jpg`

### Step 2: Update Product Data
Open `src/app/components/home/home.component.ts` and change the image URLs:

**Before:**
```typescript
image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
```

**After:**
```typescript
image: 'assets/images/wireless-headphones.jpg'
```

## Quick Image Sources

### Free Stock Photo Sites:
- **Unsplash**: https://unsplash.com (High quality, free)
- **Pexels**: https://www.pexels.com (Free stock photos)
- **Pixabay**: https://pixabay.com (Free images)
- **Burst (by Shopify)**: https://burst.shopify.com (E-commerce focused)

### Product-Specific Search Terms:
- Headphones: "wireless headphones", "headphones", "earbuds"
- Watch: "smart watch", "watch", "fitness tracker"
- Backpack: "laptop backpack", "backpack", "bag"
- Mouse: "computer mouse", "wireless mouse"
- Keyboard: "mechanical keyboard", "keyboard"
- Phone accessories: "phone stand", "phone case"
- Power bank: "power bank", "portable charger"

## Recommended Image Specifications:
- **Format**: JPG or PNG
- **Size**: 400x400px to 800x800px (square works best)
- **File size**: Under 500KB for faster loading
- **Aspect ratio**: 1:1 (square) recommended for product cards

## Example: Adding a New Product Image

1. Download image: `product-image.jpg`
2. Save to: `src/assets/images/product-image.jpg`
3. Update product in `home.component.ts`:
```typescript
{
  id: 9,
  name: 'New Product',
  description: 'Product description',
  price: 49.99,
  image: 'assets/images/product-image.jpg',  // Local image
  category: 'Electronics'
}
```

## Current Product Images (Unsplash URLs)

The app currently uses these Unsplash images:
- Wireless Headphones: Photo by Unsplash
- Smart Watch: Photo by Unsplash
- Laptop Backpack: Photo by Unsplash
- Wireless Mouse: Photo by Unsplash
- USB-C Hub: Photo by Unsplash
- Mechanical Keyboard: Photo by Unsplash
- Phone Stand: Photo by Unsplash
- Power Bank: Photo by Unsplash

All images are working and will display automatically when you run the app!
