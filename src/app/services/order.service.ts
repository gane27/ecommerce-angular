import { Injectable, signal } from '@angular/core';
import { Order } from '../models/order.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders = signal<Order[]>([]);
  private readonly STORAGE_KEY = 'ecommerce_orders';

  orders$ = this.orders.asReadonly();

  constructor(private authService: AuthService) {
    this.loadOrdersFromStorage();
  }

  // Get all orders for the current user
  getUserOrders(): Order[] {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return [];
    }
    return this.orders().filter(order => order.userId === currentUser);
  }

  // Add a new order
  addOrder(order: Order): void {
    const currentOrders = this.orders();
    this.orders.set([...currentOrders, order]);
    this.saveOrdersToStorage();
  }

  // Get all orders (for admin purposes or recommendations)
  getAllOrders(): Order[] {
    return this.orders();
  }

  private loadOrdersFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const orders = JSON.parse(stored);
        // Convert date strings back to Date objects
        const parsedOrders = orders.map((order: any) => ({
          ...order,
          date: new Date(order.date)
        }));
        this.orders.set(parsedOrders);
      }
    } catch (error) {
      console.error('Error loading orders from storage:', error);
      this.orders.set([]);
    }
  }

  private saveOrdersToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.orders()));
    } catch (error) {
      console.error('Error saving orders to storage:', error);
    }
  }
}
