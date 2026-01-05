import { Component, Input, effect } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatBadgeModule
  ],
  styleUrls: ['./cart-sidebar.component.scss'],
  template: `
    <div class="cart-overlay" *ngIf="isOpen" (click)="closeCart()"></div>
    <div class="cart-drawer" [class.open]="isOpen" (click)="$event.stopPropagation()">
        <div class="cart-header">
          <h2>Shopping Cart</h2>
          <button mat-icon-button (click)="closeCart()">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <mat-divider></mat-divider>

        <div class="cart-content">
          <div *ngIf="cartItems.length === 0" class="empty-cart">
            <mat-icon class="empty-icon">shopping_cart</mat-icon>
            <p>Your cart is empty</p>
            <button mat-raised-button color="primary" (click)="goHome()">Continue Shopping</button>
          </div>

          <div *ngIf="cartItems.length > 0" class="cart-items">
            <div class="cart-item" *ngFor="let item of cartItems">
              <img [src]="item.product.image" [alt]="item.product.name" class="cart-item-image">
              <div class="cart-item-details">
                <div class="cart-item-title">{{ item.product.name }}</div>
                <div class="cart-item-price">{{ item.product.price | currency:'USD':'symbol':'1.2-2' }}</div>
                <div class="quantity-controls">
                  <button mat-icon-button (click)="decreaseQuantity(item.product.id)" [disabled]="item.quantity <= 1">
                    <mat-icon>remove</mat-icon>
                  </button>
                  <span class="quantity">{{ item.quantity }}</span>
                  <button mat-icon-button (click)="increaseQuantity(item.product.id)">
                    <mat-icon>add</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="removeItem(item.product.id)" class="remove-button">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="cartItems.length > 0" class="cart-footer">
          <mat-divider></mat-divider>
          <div class="cart-total">
            <div class="total-row">
              <span>Total:</span>
              <span class="total-amount">{{ getTotal() | currency:'USD':'symbol':'1.2-2' }}</span>
            </div>
          </div>
          <button mat-raised-button color="primary" class="checkout-button" (click)="goToCheckout()">
            Checkout
          </button>
        </div>
    </div>
  `
})
export class CartSidebarComponent {
  @Input() isOpen = false;
  cartItems: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private router: Router
  ) {
    // Subscribe to cart items changes
    effect(() => {
      this.cartItems = this.cartService.cartItems$();
    });
  }

  closeCart() {
    this.cartService.closeCart();
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  increaseQuantity(productId: number) {
    const item = this.cartItems.find(i => i.product.id === productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity + 1);
    }
  }

  decreaseQuantity(productId: number) {
    const item = this.cartItems.find(i => i.product.id === productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity - 1);
    }
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  goToCheckout() {
    this.closeCart();
    this.router.navigate(['/checkout']);
  }

  goHome() {
    this.closeCart();
    this.router.navigate(['/']);
  }
}
