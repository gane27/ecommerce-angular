import { Component, OnInit, Input, effect, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { Product } from '../../models/product.model';
import { RecommendationService } from '../../services/recommendation.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule
  ],
  styleUrls: ['./recommendations.component.scss'],
  template: `
    <div class="recommendations-container" *ngIf="recommendedProducts.length > 0">
      <h2 class="section-title">Recommended For You</h2>
      <mat-grid-list [cols]="gridCols" [rowHeight]="rowHeight" [gutterSize]="gutterSize">
        <mat-grid-tile *ngFor="let product of recommendedProducts">
          <mat-card class="product-card">
            <img 
              mat-card-image 
              [src]="product.image" 
              [alt]="product.name"
              loading="lazy"
              (error)="onImageError($event)">
            <mat-card-content class="product-card-content">
              <mat-card-title>{{ product.name }}</mat-card-title>
              <mat-card-subtitle>{{ product.category }}</mat-card-subtitle>
              <p class="description">{{ product.description }}</p>
              <div class="rating-container" *ngIf="product.rating">
                <div class="stars">
                  <mat-icon *ngFor="let star of getStars(product.rating)" 
                    [class.filled]="star === 1" 
                    [class.half]="star === 0.5"
                    [class.empty]="star === 0">star</mat-icon>
                </div>
                <span class="rating-text">{{ product.rating }}</span>
                <span class="review-count" *ngIf="product.reviewCount">({{ product.reviewCount }})</span>
              </div>
              <div class="price-button-container">
                <p class="price">{{ product.price | currency:'USD':'symbol':'1.2-2' }}</p>
                <button mat-raised-button color="primary" (click)="addToCart(product)" class="add-to-cart-btn">
                  <mat-icon>add_shopping_cart</mat-icon>
                  <span class="btn-text">Add to Cart</span>
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>
    </div>
  `
})
export class RecommendationsComponent implements OnInit, OnChanges {
  @Input() allProducts: Product[] = [];
  recommendedProducts: Product[] = [];
  gridCols = 4;
  rowHeight = '360px';
  gutterSize = '20px';

  constructor(
    private recommendationService: RecommendationService,
    private cartService: CartService,
    private authService: AuthService
  ) {
    // Update recommendations when authentication state changes
    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.loadRecommendations();
      }
    });
  }

  ngOnInit() {
    this.setGridColumns(window.innerWidth);
    this.loadRecommendations();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['allProducts'] && !changes['allProducts'].firstChange) {
      this.loadRecommendations();
    }
  }

  loadRecommendations() {
    if (this.allProducts.length > 0) {
      this.recommendedProducts = this.recommendationService.getRecommendations(this.allProducts, 5);
    }
  }

  setGridColumns(width: number): void {
    if (width < 600) {
      this.gridCols = 1;
      this.rowHeight = '420px';
      this.gutterSize = '12px';
    } else if (width >= 600 && width < 960) {
      this.gridCols = 2;
      this.rowHeight = '400px';
      this.gutterSize = '16px';
    } else if (width >= 960 && width < 1280) {
      this.gridCols = 3;
      this.rowHeight = '380px';
      this.gutterSize = '20px';
    } else {
      this.gridCols = 4;
      this.rowHeight = '360px';
      this.gutterSize = '20px';
    }
  }

  getStars(rating: number): number[] {
    const stars: number[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(1);
    }
    
    if (hasHalfStar && stars.length < 5) {
      stars.push(0.5);
    }
    
    while (stars.length < 5) {
      stars.push(0);
    }
    
    return stars;
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/placeholder.jpg';
  }
}
