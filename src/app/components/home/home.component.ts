import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    MatIconModule
  ],
  styleUrls: ['./home.component.scss'],
  template: `
    <div class="carousel-container">
      <div class="carousel-wrapper">
        <div class="carousel-slides" [style.transform]="'translateX(-' + currentSlide * 100 + '%)'">
          <div class="carousel-slide" *ngFor="let slide of carouselSlides; let i = index">
            <img [src]="slide.image" [alt]="slide.alt" class="carousel-image">
            <div class="carousel-overlay">
              <div class="carousel-content">
                <h1 class="banner-title">Welcome to Ecommerce</h1>
                <p class="banner-subtitle">Discover amazing products at great prices</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Navigation Buttons -->
        <button mat-icon-button class="carousel-nav carousel-prev" (click)="previousSlide()" aria-label="Previous slide">
          <mat-icon>chevron_left</mat-icon>
        </button>
        <button mat-icon-button class="carousel-nav carousel-next" (click)="nextSlide()" aria-label="Next slide">
          <mat-icon>chevron_right</mat-icon>
        </button>
        
        <!-- Indicators -->
        <div class="carousel-indicators">
          <button 
            *ngFor="let slide of carouselSlides; let i = index"
            class="indicator"
            [class.active]="i === currentSlide"
            (click)="goToSlide(i)"
            [attr.aria-label]="'Go to slide ' + (i + 1)">
          </button>
        </div>
      </div>
    </div>

    <div class="container">
      <h2 class="section-title">Our Products</h2>
      <mat-grid-list [cols]="gridCols" [rowHeight]="rowHeight" [gutterSize]="gutterSize">
        <mat-grid-tile *ngFor="let product of products">
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
export class HomeComponent implements OnInit, OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);
  private destroy$ = new Subject<void>();
  private autoPlayInterval?: any;
  
  // Mobile-first default values
  gridCols = 1;
  rowHeight = '450px';
  gutterSize = '12px';
  
  // Carousel properties
  currentSlide = 0;
  carouselSlides = [
    {
      image: 'assets/images/carousel-1.jpg',
      alt: 'Shopping experience'
    },
    {
      image: 'assets/images/carousel-2.jpg',
      alt: 'Modern products'
    },
    {
      image: 'assets/images/carousel-3.jpg',
      alt: 'Quality products'
    }
  ];
  products: Product[] = [
    {
      id: 1,
      name: 'Wireless Headphones',
      description: 'Premium wireless headphones with noise cancellation',
      price: 99.99,
      image: 'assets/images/wireless-headphones.jpg',
      category: 'Electronics',
      rating: 4.5,
      reviewCount: 128
    },
    {
      id: 2,
      name: 'Smart Watch',
      description: 'Feature-rich smartwatch with fitness tracking',
      price: 199.99,
      image: 'assets/images/smart-watch.jpg',
      category: 'Electronics',
      rating: 4.8,
      reviewCount: 256
    },
    {
      id: 3,
      name: 'Laptop Backpack',
      description: 'Durable laptop backpack with multiple compartments',
      price: 49.99,
      image: 'assets/images/laptop-backpack.jpg',
      category: 'Accessories',
      rating: 4.3,
      reviewCount: 89
    },
    {
      id: 4,
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse with long battery life',
      price: 29.99,
      image: 'assets/images/wireless-mouse.jpg',
      category: 'Electronics',
      rating: 4.6,
      reviewCount: 203
    },
    {
      id: 5,
      name: 'USB-C Hub',
      description: 'Multi-port USB-C hub for laptops and tablets',
      price: 39.99,
      image: 'assets/images/usb-c-hub.jpg',
      category: 'Accessories',
      rating: 4.4,
      reviewCount: 167
    },
    {
      id: 6,
      name: 'Mechanical Keyboard',
      description: 'RGB mechanical keyboard with customizable keys',
      price: 89.99,
      image: 'assets/images/mechanical-keyboard.jpg',
      category: 'Electronics',
      rating: 4.7,
      reviewCount: 312
    },
    {
      id: 7,
      name: 'Phone Stand',
      description: 'Adjustable phone stand for desk and car',
      price: 19.99,
      image: 'assets/images/phone-stand.jpg',
      category: 'Accessories',
      rating: 4.2,
      reviewCount: 94
    },
    {
      id: 8,
      name: 'Power Bank',
      description: 'High capacity power bank with fast charging',
      price: 34.99,
      image: 'assets/images/power-bank.jpg',
      category: 'Accessories',
      rating: 4.5,
      reviewCount: 178
    }
  ];

  constructor(private cartService: CartService) {}

  ngOnInit() {
    // Set initial values based on current screen size (prevents flash of wrong layout)
    this.setGridColumns(window.innerWidth);

    // Observe for changes
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.gridCols = 1;
          this.rowHeight = '420px';
          this.gutterSize = '12px';
        } else if (result.breakpoints[Breakpoints.Small]) {
          this.gridCols = 2;
          this.rowHeight = '450px';
          this.gutterSize = '16px';
        } else if (result.breakpoints[Breakpoints.Medium]) {
          this.gridCols = 3;
          this.rowHeight = '380px';
          this.gutterSize = '20px';
        } else {
          this.gridCols = 4;
          this.rowHeight = '360px';
          this.gutterSize = '20px';
        }
      });
    
    // Auto-play carousel
    this.startAutoPlay();
  }

  private setGridColumns(width: number): void {
    if (width < 600) {
      // Mobile - use larger height to ensure cards are fully visible
      this.gridCols = 1;
      this.rowHeight = '420px';
      this.gutterSize = '12px';
    } else if (width >= 600 && width < 960) {
      // Tablet
      this.gridCols = 2;
      this.rowHeight = '450px';
      this.gutterSize = '16px';
    } else if (width >= 960 && width < 1280) {
      // Medium desktop
      this.gridCols = 3;
      this.rowHeight = '380px';
      this.gutterSize = '20px';
    } else {
      // Large desktop
      this.gridCols = 4;
      this.rowHeight = '360px';
      this.gutterSize = '20px';
    }
  }

  ngOnDestroy() {
    this.stopAutoPlay();
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // Carousel methods
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.carouselSlides.length;
    this.resetAutoPlay();
  }
  
  previousSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.carouselSlides.length) % this.carouselSlides.length;
    this.resetAutoPlay();
  }
  
  goToSlide(index: number) {
    this.currentSlide = index;
    this.resetAutoPlay();
  }
  
  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }
  
  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = undefined;
    }
  }
  
  resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
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

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    // Use local placeholder image instead of external URL
    img.src = 'assets/images/placeholder.jpg';
  }
}
