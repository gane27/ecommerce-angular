import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatSnackBarModule,
    MatIconModule
  ],
  styleUrls: ['./checkout.component.scss'],
  template: `
    <div class="checkout-container">
      <div class="checkout-content">
        <div class="page-header">
          <button mat-button (click)="goBack()" class="back-button" aria-label="Back to products">
            <mat-icon>arrow_back</mat-icon>
            <span>Back to Products</span>
          </button>
          <h1 class="page-title">Checkout</h1>
        </div>

        <div class="checkout-grid">
          <div class="checkout-form-section">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Shipping Information</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()">
                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Full Name</mat-label>
                      <input matInput formControlName="fullName" required>
                      <mat-error *ngIf="checkoutForm.get('fullName')?.hasError('required')">
                        Name is required
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Email</mat-label>
                      <input matInput type="email" formControlName="email" required>
                      <mat-error *ngIf="checkoutForm.get('email')?.hasError('required')">
                        Email is required
                      </mat-error>
                      <mat-error *ngIf="checkoutForm.get('email')?.hasError('email')">
                        Please enter a valid email
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Address</mat-label>
                      <input matInput formControlName="address" required>
                      <mat-error *ngIf="checkoutForm.get('address')?.hasError('required')">
                        Address is required
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>City</mat-label>
                      <input matInput formControlName="city" required>
                      <mat-error *ngIf="checkoutForm.get('city')?.hasError('required')">
                        City is required
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>Zip Code</mat-label>
                      <input matInput formControlName="zipCode" required>
                      <mat-error *ngIf="checkoutForm.get('zipCode')?.hasError('required')">
                        Zip code is required
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Phone Number</mat-label>
                      <input matInput formControlName="phone" required>
                      <mat-error *ngIf="checkoutForm.get('phone')?.hasError('required')">
                        Phone number is required
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <button mat-raised-button color="primary" type="submit" class="submit-button" [disabled]="checkoutForm.invalid || cartItems.length === 0">
                    Place Order
                  </button>
                </form>
              </mat-card-content>
            </mat-card>
          </div>

          <div class="order-summary-section">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Order Summary</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div *ngIf="cartItems.length === 0" class="empty-cart">
                  <p>Your cart is empty</p>
                  <button mat-raised-button color="primary" (click)="goHome()">Continue Shopping</button>
                </div>

                <div *ngIf="cartItems.length > 0">
                  <div class="order-item" *ngFor="let item of cartItems">
                    <div class="item-info">
                      <h4>{{ item.product.name }}</h4>
                      <p>Quantity: {{ item.quantity }}</p>
                      <p class="item-price">{{ item.product.price * item.quantity | currency:'USD':'symbol':'1.2-2' }}</p>
                    </div>
                  </div>

                  <mat-divider></mat-divider>

                  <div class="order-total">
                    <div class="total-row">
                      <span>Subtotal:</span>
                      <span>{{ getSubtotal() | currency:'USD':'symbol':'1.2-2' }}</span>
                    </div>
                    <div class="total-row">
                      <span>Shipping:</span>
                      <span>{{ shippingCost | currency:'USD':'symbol':'1.2-2' }}</span>
                    </div>
                    <div class="total-row final-total">
                      <span>Total:</span>
                      <span>{{ getTotal() | currency:'USD':'symbol':'1.2-2' }}</span>
                    </div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CheckoutComponent {
  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  shippingCost: number = 10.0;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.checkoutForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      phone: ['', [Validators.required]]
    });

    // Keep cart items in sync with the cart signal
    effect(() => {
      this.cartItems = this.cartService.cartItems$();
    });
  }

  getSubtotal(): number {
    return this.cartService.getTotal();
  }

  getTotal(): number {
    return this.getSubtotal() + this.shippingCost;
  }

  onSubmit() {
    if (this.checkoutForm.valid && this.cartItems.length > 0) {
      // Simulate order submission
      this.cartService.clearCart();
      
      // Show success popup
      this.snackBar.open('Successfully order submitted!', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']
      });

      // Redirect to home after a delay
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
