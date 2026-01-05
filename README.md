# Ecommerce Angular Application

A modern e-commerce application built with Angular 17 and Angular Material.

## Features

- **Home Page**: Display products with banner and product grid
- **Shopping Cart**: Sidebar cart that opens when products are added
- **Sign In**: User authentication page
- **Checkout**: Order placement with form validation
- **Order Confirmation**: Success popup after order submission

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
│   │   ├── home/           # Main product page
│   │   ├── sign-in/        # Authentication page
│   │   ├── checkout/       # Checkout page
│   │   └── cart-sidebar/   # Shopping cart sidebar
│   ├── services/
│   │   ├── cart.service.ts    # Cart management
│   │   └── auth.service.ts    # Authentication
│   ├── guards/
│   │   └── auth.guard.ts      # Route protection
│   └── models/                # TypeScript interfaces
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
