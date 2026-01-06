# Ecommerce Angular Application

A modern e-commerce application built with Angular 17 and Angular Material.

## Features

- **Home Page**: Display products with banner and product grid
- **Shopping Cart**: Sidebar cart that opens when products are added
- **Sign In**: User authentication page
- **Checkout**: Order placement with form validation
- **Order Confirmation**: Success popup after order submission
- **Product Recommendations**: AI-powered recommendations based on order history

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:4200`

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── home/              # Main product page
│   │   ├── sign-in/           # Authentication page
│   │   ├── checkout/          # Checkout page
│   │   ├── cart-sidebar/      # Shopping cart sidebar
│   │   ├── recommendations/   # Product recommendations component
│   │   └── footer/            # Footer component
│   ├── services/
│   │   ├── cart.service.ts       # Cart management
│   │   ├── auth.service.ts       # Authentication
│   │   ├── order.service.ts      # Order management
│   │   └── recommendation.service.ts  # Recommendation logic
│   ├── guards/
│   │   └── auth.guard.ts      # Route protection
│   └── models/                # TypeScript interfaces
│       ├── product.model.ts
│       ├── cart-item.model.ts
│       └── order.model.ts
├── assets/
│   └── images/                # Product and carousel images
├── styles.scss                # Global styles
└── main.ts                    # Application entry point
```

## Usage

1. **Browse Products**: View products on the home page
2. **Add to Cart**: Click "Add to Cart" on any product
3. **View Cart**: Cart sidebar opens automatically on the right side
4. **Checkout**: Click "Checkout" button in the cart
5. **Sign In**: If not authenticated, you'll be redirected to sign in
6. **Place Order**: Fill out the checkout form and submit
7. **Confirmation**: Success message appears after order submission

## Product Recommendation System

The application includes an intelligent recommendation system that suggests products based on user's order history.

### Recommendation Logic

**Step 1: Fetch User Orders**
- Retrieves all orders placed by the authenticated user

**Step 2: Fallback for New Users**
- If user has no order history: Returns top-rated products (sorted by rating and review count)

**Step 3: Category Analysis**
- Counts occurrences of each category in order history
- Weights by quantity (e.g., 3 Electronics items = count of 3)

**Step 4: Find Top Category**
- Identifies the most frequently ordered category
- Example: If user ordered 5 Electronics and 2 Accessories → Top category = "Electronics"

**Step 5: Generate Recommendations**
- Finds products in the top category
- Excludes products already ordered by the user
- Limits to 5 recommendations

**Step 6: Fill Remaining Slots**
- If fewer than 5 products found in top category:
  - Adds top-rated products from other categories
  - Excludes already ordered products
  - Excludes already recommended products
  - Fills up to 5 total recommendations

### Example Flow

**User Order History:**
- 2x Wireless Headphones (Electronics)
- 1x Smart Watch (Electronics)
- 1x Laptop Backpack (Accessories)

**Result:**
1. Category counts: Electronics = 3, Accessories = 1
2. Top category: Electronics
3. Recommendations: Other Electronics products (Wireless Mouse, Mechanical Keyboard, etc.) that haven't been ordered
4. If fewer than 5: Fills with top-rated products from other categories

This ensures users see products aligned with their preferences while discovering new items.

## Technologies Used

- Angular 17
- Angular Material
- TypeScript
- RxJS
- SCSS

## Development

Run `ng serve` for a dev server. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
