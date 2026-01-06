import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { OrderService } from './order.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  /**
   * Get product recommendations based on user's order history
   * @param allProducts - All available products
   * @param limit - Maximum number of recommendations (default: 5)
   * @returns Array of recommended products
   */
  getRecommendations(allProducts: Product[], limit: number = 5): Product[] {
    // Fetch all orders for the user
    const userOrders = this.orderService.getUserOrders();

    // If no orders: return top-rated products (fallback)
    if (userOrders.length === 0) {
      return this.getTopRatedProducts(allProducts, limit);
    }

    // Count categories: count occurrences of each category in order history
    const categoryCounts = this.countCategories(userOrders);

    // Find top category: select the most frequently ordered category
    const topCategory = this.findTopCategory(categoryCounts);

    // Generate recommendations:
    // Find products in the top category
    // Exclude products already ordered
    const orderedProductIds = this.getOrderedProductIds(userOrders);
    const categoryProducts = allProducts.filter(
      product => product.category === topCategory && !orderedProductIds.has(product.id)
    );

    // Limit to 5
    let recommendations = categoryProducts.slice(0, limit);

    // Fill remaining slots: if fewer than 5, add top-rated products not already recommended
    if (recommendations.length < limit) {
      const recommendedIds = new Set(recommendations.map(p => p.id));
      const topRated = this.getTopRatedProducts(allProducts, limit * 2)
        .filter(product => 
          !orderedProductIds.has(product.id) && 
          !recommendedIds.has(product.id)
        );
      
      const remaining = limit - recommendations.length;
      recommendations = [...recommendations, ...topRated.slice(0, remaining)];
    }

    return recommendations.slice(0, limit);
  }

  /**
   * Count occurrences of each category in order history
   */
  private countCategories(orders: any[]): Map<string, number> {
    const categoryCounts = new Map<string, number>();

    orders.forEach(order => {
      order.items.forEach((item: any) => {
        const category = item.product.category;
        categoryCounts.set(category, (categoryCounts.get(category) || 0) + item.quantity);
      });
    });

    return categoryCounts;
  }

  /**
   * Find the most frequently ordered category
   */
  private findTopCategory(categoryCounts: Map<string, number>): string {
    let topCategory = '';
    let maxCount = 0;

    categoryCounts.forEach((count, category) => {
      if (count > maxCount) {
        maxCount = count;
        topCategory = category;
      }
    });

    return topCategory;
  }

  /**
   * Get all product IDs that have been ordered by the user
   */
  private getOrderedProductIds(orders: any[]): Set<number> {
    const productIds = new Set<number>();
    
    orders.forEach(order => {
      order.items.forEach((item: any) => {
        productIds.add(item.product.id);
      });
    });

    return productIds;
  }

  /**
   * Get top-rated products (fallback when no orders exist)
   */
  private getTopRatedProducts(products: Product[], limit: number): Product[] {
    return products
      .filter(product => product.rating !== undefined)
      .sort((a, b) => {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        // Sort by rating descending, then by review count
        if (ratingB !== ratingA) {
          return ratingB - ratingA;
        }
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      })
      .slice(0, limit);
  }
}
