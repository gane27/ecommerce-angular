import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule
  ],
  styleUrls: ['./footer.component.scss'],
  template: `
    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Ecommerce</h3>
          <p>Your trusted online shopping destination for quality products at great prices.</p>
        </div>
        
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a routerLink="/">Home</a></li>           
            <li><a routerLink="/signin">Sign In</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Contact</h4>
          <ul>
            <li>
              <mat-icon>person</mat-icon>
              <span>Ganesh</span>
            </li>
            <li>
              <mat-icon>phone</mat-icon>
              <span>91 99-400-277-39</span>
            </li>
            <li>
              <mat-icon>email</mat-icon>
              <span>support&#64;ecommerce.com</span>
            </li>
            <li>
              <mat-icon>location_on</mat-icon>
              <span>123 Shopping St, City, State 12345</span>
            </li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Follow Us</h4>
          <div class="social-links">
            <a href="#" aria-label="Facebook">
              <mat-icon>facebook</mat-icon>
            </a>
            <a href="#" aria-label="Twitter">
              <mat-icon>alternate_email</mat-icon>
            </a>
            <a href="#" aria-label="Instagram">
              <mat-icon>camera_alt</mat-icon>
            </a>
            <a href="#" aria-label="LinkedIn">
              <mat-icon>work</mat-icon>
            </a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Ecommerce. All rights reserved.</p>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
