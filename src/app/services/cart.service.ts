import { Injectable, signal } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);
  private cartOpenState = signal<boolean>(false);

  cartOpen = this.cartOpenState.asReadonly();
  cartItems$ = this.cartItems.asReadonly();

  cartItemCount = signal(0);

  constructor() {
    this.updateCartItemCount();
  }

  addToCart(product: Product) {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      this.cartItems.set([...currentItems]);
    } else {
      this.cartItems.set([...currentItems, { product, quantity: 1 }]);
    }

    this.updateCartItemCount();
    this.cartOpenState.set(true);
  }

  removeFromCart(productId: number) {
    const currentItems = this.cartItems();
    const updatedItems = currentItems.filter(item => item.product.id !== productId);
    this.cartItems.set(updatedItems);
    this.updateCartItemCount();
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItems();
    const updatedItems = currentItems.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    this.cartItems.set(updatedItems);
    this.updateCartItemCount();
  }

  getTotal(): number {
    return this.cartItems().reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  clearCart() {
    this.cartItems.set([]);
    this.updateCartItemCount();
  }

  toggleCart() {
    this.cartOpenState.set(!this.cartOpenState());
  }

  closeCart() {
    this.cartOpenState.set(false);
  }

  private updateCartItemCount() {
    const count = this.cartItems().reduce((sum, item) => sum + item.quantity, 0);
    this.cartItemCount.set(count);
  }
}
