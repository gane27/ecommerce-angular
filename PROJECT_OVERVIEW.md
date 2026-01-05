# E-Commerce Angular Application - Project Overview

## 📋 Project Summary

This is a modern e-commerce application built with **Angular 17** and **Angular Material**. It provides a complete shopping experience with product browsing, cart management, user authentication, and checkout functionality.

---

## 🎯 Core Functionality

### 1. **Product Browsing (Home Page)**
- Displays a carousel banner with "Welcome to Ecommerce" message
- Shows 8 products in a responsive grid layout
- Products include: Wireless Headphones, Smart Watch, Laptop Backpack, Wireless Mouse, USB-C Hub, Mechanical Keyboard, Phone Stand, and Power Bank
- Each product card shows image, name, category, description, price, and "Add to Cart" button
- Responsive design: 1 column (mobile), 2 columns (tablet), 3-4 columns (desktop)

### 2. **Shopping Cart**
- Sidebar cart that slides in from the right
- Shows all added products with quantities
- Allows quantity increase/decrease
- Remove items functionality
- Displays cart total
- Auto-opens when product is added
- Dark overlay backdrop when open

### 3. **User Authentication**
- Sign-in page with email and password
- Simple authentication (stores in localStorage)
- Protected checkout route (requires login)
- Shows user welcome message when logged in
- Sign-in button in toolbar when not authenticated

### 4. **Checkout Process**
- Protected route (requires authentication)
- Shipping information form (name, email, address, city, zip, phone)
- Order summary with cart items
- Subtotal, shipping cost, and total calculation
- Success popup after order submission
- Redirects to home after successful order

---

## 📁 Project Structure & File Purposes

### **Root Configuration Files**

#### `package.json`
- Defines project dependencies (Angular 17, Angular Material, RxJS)
- Contains npm scripts for development and building

#### `angular.json`
- Angular CLI configuration
- Build settings, asset paths, and project structure

#### `tsconfig.json` & `tsconfig.app.json`
- TypeScript compiler configuration
- Defines compilation options and paths

---

### **Source Files (`src/`)**

#### **Main Entry Point**
- **`main.ts`**: Bootstrap file that starts the Angular application
- **`index.html`**: Root HTML file with viewport meta tags for responsive design
- **`styles.scss`**: Global styles and Angular Material theme configuration

#### **Global Styles (`styles.scss`)**
- Angular Material theme setup (Indigo primary, Pink accent, Red warn)
- Global responsive rules
- Touch target sizing (44x44px minimum)
- Font size rules to prevent iOS zoom
- Success snackbar styling

---

### **App Component (`src/app/`)**

#### **`app.component.ts`**
- **Purpose**: Root component that wraps the entire application
- **Features**:
  - Top toolbar with company name "Ecommerce"
  - Sign-in button (when not authenticated)
  - User welcome message (when authenticated)
  - Shopping cart icon with badge showing item count
  - Responsive breakpoint detection
- **Key Methods**:
  - `toggleCart()`: Opens/closes cart sidebar
  - `navigateToSignIn()`: Routes to sign-in page
  - `isAuthenticated()`: Checks if user is logged in
  - `getCurrentUser()`: Gets current user email

#### **`app.component.scss`**
- Toolbar styling
- Responsive adjustments for mobile/tablet
- Button and spacing styles

#### **`app.routes.ts`**
- Defines application routes:
  - `/` → HomeComponent (product listing)
  - `/signin` → SignInComponent
  - `/checkout` → CheckoutComponent (protected by authGuard)
  - `**` → Redirects to home (404 handling)

---

### **Components (`src/app/components/`)**

#### **1. Home Component (`home/`)**

**`home.component.ts`**
- **Purpose**: Displays product catalog with carousel banner
- **Features**:
  - Image carousel with 3 slides (auto-plays every 5 seconds)
  - Product grid with responsive columns (1-4 based on screen size)
  - "Add to Cart" functionality
  - Image error handling with placeholder fallback
  - BreakpointObserver for responsive grid layout
- **Key Properties**:
  - `carouselSlides`: Array of carousel images
  - `currentSlide`: Current carousel slide index
  - `products`: Array of 8 products
  - `gridCols`: Number of grid columns (responsive)
- **Key Methods**:
  - `addToCart(product)`: Adds product to cart
  - `nextSlide()` / `previousSlide()`: Carousel navigation
  - `goToSlide(index)`: Jump to specific slide
  - `onImageError(event)`: Handles broken image URLs

**`home.component.scss`**
- Carousel styling (slides, navigation buttons, indicators)
- Product card styling
- Responsive grid layout
- Image display rules
- Mobile/tablet/desktop breakpoints

---

#### **2. Cart Sidebar Component (`cart-sidebar/`)**

**`cart-sidebar.component.ts`**
- **Purpose**: Shopping cart sidebar that displays cart items
- **Features**:
  - Displays all cart items with images
  - Quantity controls (increase/decrease)
  - Remove item functionality
  - Cart total calculation
  - Empty cart state
  - Checkout button (navigates to checkout)
  - Continue shopping button (when empty)
- **Key Methods**:
  - `increaseQuantity()` / `decreaseQuantity()`: Update item quantity
  - `removeItem()`: Remove product from cart
  - `getTotal()`: Calculate cart total
  - `goToCheckout()`: Navigate to checkout page
  - `closeCart()`: Close the sidebar

**`cart-sidebar.component.scss`**
- Sidebar drawer styling (slides from right)
- Dark overlay backdrop
- Cart item layout
- Responsive width (100% on mobile, 400px on desktop)
- Footer with total and checkout button

---

#### **3. Sign-In Component (`sign-in/`)**

**`sign-in.component.ts`**
- **Purpose**: User authentication page
- **Features**:
  - Email and password form
  - Form validation (required fields)
  - Error messages
  - Redirects to checkout after successful login (if coming from checkout)
  - Redirects to home if already authenticated
- **Key Methods**:
  - `onSubmit()`: Handles form submission
  - `signIn()`: Calls AuthService to authenticate

**`sign-in.component.scss`**
- Centered form layout
- Responsive form sizing
- Material form field styling

---

#### **4. Checkout Component (`checkout/`)**

**`checkout.component.ts`**
- **Purpose**: Order checkout and shipping information
- **Features**:
  - Protected route (requires authentication)
  - Shipping form (name, email, address, city, zip, phone)
  - Order summary with cart items
  - Subtotal, shipping ($10), and total calculation
  - Form validation
  - Success popup after order submission
  - "Back to Products" button
- **Key Properties**:
  - `shippingCost`: Fixed shipping cost ($10.00)
- **Key Methods**:
  - `onSubmit()`: Processes order and shows success message
  - `getSubtotal()`: Calculates cart subtotal
  - `getTotal()`: Calculates total with shipping
  - `goBack()`: Returns to home page

**`checkout.component.scss`**
- Two-column layout (form + summary)
- Responsive grid (stacks on mobile/tablet)
- Form field styling
- Order summary card

---

### **Services (`src/app/services/`)**

#### **1. Cart Service (`cart.service.ts`)**
- **Purpose**: Manages shopping cart state using Angular Signals
- **Features**:
  - Add products to cart
  - Remove products from cart
  - Update quantities
  - Calculate cart total
  - Track cart item count
  - Control cart sidebar open/close state
- **Key Signals**:
  - `cartItems$`: Readonly signal of cart items
  - `cartOpen`: Readonly signal for cart sidebar state
  - `cartItemCount`: Signal for badge count
- **Key Methods**:
  - `addToCart(product)`: Adds or increments product
  - `removeFromCart(productId)`: Removes product
  - `updateQuantity(productId, quantity)`: Updates item quantity
  - `getTotal()`: Calculates cart total
  - `clearCart()`: Empties cart
  - `toggleCart()`: Opens/closes cart

#### **2. Auth Service (`auth.service.ts`)**
- **Purpose**: Manages user authentication state
- **Features**:
  - Sign in with email/password
  - Sign out functionality
  - Persistent login (localStorage)
  - Current user tracking
- **Key Signals**:
  - `isAuthenticatedState`: Authentication status
  - `currentUser`: Current user email
- **Key Methods**:
  - `signIn(email, password)`: Authenticates user
  - `signOut()`: Logs out user
  - `isAuthenticated()`: Checks auth status
  - `getCurrentUser()`: Gets current user email

---

### **Guards (`src/app/guards/`)**

#### **Auth Guard (`auth.guard.ts`)**
- **Purpose**: Protects routes that require authentication
- **Functionality**:
  - Checks if user is authenticated
  - Allows access if authenticated
  - Redirects to sign-in if not authenticated
  - Preserves return URL for redirect after login
- **Used on**: `/checkout` route

---

### **Models (`src/app/models/`)**

#### **1. Product Model (`product.model.ts`)**
```typescript
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}
```

#### **2. Cart Item Model (`cart-item.model.ts`)**
```typescript
interface CartItem {
  product: Product;
  quantity: number;
}
```

---

## 🎨 Design Approach

### **UI Framework: Angular Material**
- Uses Material Design components for consistent UI
- Material theme: Indigo primary, Pink accent, Red warn
- Material components used:
  - `mat-toolbar`: Top navigation bar
  - `mat-card`: Product cards and form sections
  - `mat-button`: Action buttons
  - `mat-icon`: Icons throughout
  - `mat-badge`: Cart item count badge
  - `mat-form-field`: Form inputs
  - `mat-grid-list`: Product grid layout
  - `mat-snack-bar`: Success notifications

### **Responsive Design Strategy**
1. **Mobile-First Approach**: Default styles for mobile, enhanced for larger screens
2. **Breakpoints**:
   - Mobile: < 600px (1 column grid, smaller text)
   - Tablet: 600px - 959px (2 columns, medium text)
   - Desktop: ≥ 960px (3-4 columns, full features)
3. **BreakpointObserver**: Used in components to dynamically adjust layouts
4. **CSS Media Queries**: Component-specific responsive styles

### **Styling Architecture**
- **Global Styles** (`styles.scss`): Theme, typography, global rules
- **Component Styles**: Each component has its own `.scss` file
- **Material Theming**: Uses Material's theming system with custom palettes
- **No Inline Styles**: All styles in SCSS files (as requested)

### **Color Scheme**
- **Primary**: Indigo (#3F51B5) - Main actions, buttons
- **Accent**: Pink (#E91E63) - Secondary actions, badges
- **Warn**: Red (#F44336) - Delete actions
- **Background**: White with subtle grays
- **Text**: Dark gray/black on light backgrounds, white on dark

---

## 🔄 Data Flow & State Management

### **State Management: Angular Signals**
- Modern reactive state management (Angular 17 feature)
- Used in:
  - `CartService`: Cart items, cart open state, item count
  - `AuthService`: Authentication state, current user

### **Data Flow**:
1. **User adds product** → `HomeComponent.addToCart()` → `CartService.addToCart()` → Updates signals → Cart sidebar updates
2. **User signs in** → `SignInComponent.onSubmit()` → `AuthService.signIn()` → Updates auth signals → Toolbar updates
3. **User checks out** → `CheckoutComponent.onSubmit()` → `CartService.clearCart()` → Success message → Redirect to home

---

## 🚀 Key Features

1. **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
2. **Image Carousel**: Auto-playing banner with navigation controls
3. **Shopping Cart**: Sidebar with real-time updates
4. **Authentication**: Simple login system with route protection
5. **Form Validation**: Reactive forms with Material validation
6. **Error Handling**: Image fallbacks, form validation errors
7. **Accessibility**: ARIA labels, keyboard navigation, touch targets
8. **Performance**: Lazy loading images, efficient state management

---

## 📱 User Flow

1. **Landing**: User sees carousel and product grid
2. **Browse**: User views products in responsive grid
3. **Add to Cart**: Click "Add to Cart" → Cart sidebar opens
4. **Manage Cart**: Adjust quantities, remove items
5. **Checkout**: Click "Checkout" → Redirected to sign-in if not logged in
6. **Sign In**: Enter credentials → Redirected to checkout
7. **Complete Order**: Fill shipping form → Submit → Success popup → Redirect to home

---

## 🛠️ Technologies Used

- **Angular 17**: Framework (standalone components)
- **Angular Material**: UI component library
- **TypeScript**: Programming language
- **RxJS**: Reactive programming (for breakpoint observation)
- **SCSS**: Styling with Material theming
- **Angular Signals**: State management
- **Angular Router**: Navigation and route guards

---

## 📝 Notes

- All images use Unsplash URLs (external)
- Authentication is simplified (no backend)
- Cart and auth state persist in memory (not persisted to backend)
- Form validation uses Angular Reactive Forms
- All components are standalone (Angular 17 feature)
- No inline styles - all in SCSS files
- Fully responsive with mobile-first approach
