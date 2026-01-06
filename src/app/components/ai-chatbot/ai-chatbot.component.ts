import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChatService } from '../../services/chat.service';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-ai-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ],
  styleUrls: ['./ai-chatbot.component.scss'],
  template: `
    <div class="chatbot-wrapper">
      <!-- Chat Toggle Button -->
      <button 
        class="chat-toggle-btn" 
        (click)="toggleChat()"
        [class.open]="isOpen"
        [attr.aria-label]="isOpen ? 'Close chat' : 'Open chat'">
        <mat-icon *ngIf="!isOpen">chat</mat-icon>
        <mat-icon *ngIf="isOpen">close</mat-icon>
        <span class="badge" *ngIf="unreadCount > 0 && !isOpen">{{ unreadCount }}</span>
      </button>

      <!-- Chat Window -->
      <div class="chat-window" [class.open]="isOpen" *ngIf="isOpen">
        <div class="chat-header">
          <div class="header-content">
            <mat-icon class="header-icon">smart_toy</mat-icon>
            <div>
              <h3>AI Shopping Assistant</h3>
              <span class="status" [class.online]="isOnline">Online</span>
            </div>
          </div>
          <button 
            mat-icon-button 
            class="minimize-btn" 
            (click)="toggleChat()"
            aria-label="Minimize chat">
            <mat-icon>minimize</mat-icon>
          </button>
        </div>

        <div class="chat-messages" #messagesContainer>
          <div *ngIf="messages.length === 0" class="welcome-message">
            <mat-icon>waving_hand</mat-icon>
            <p>Hi! I'm your AI shopping assistant. I can help you with:</p>
            <ul>
              <li>Finding products</li>
              <li>Answering questions about the store</li>
              <li>Order assistance</li>
              <li>Product recommendations</li>
            </ul>
            <p>How can I help you today?</p>
          </div>

          <div 
            *ngFor="let message of messages" 
            class="message"
            [class.user]="message.role === 'user'"
            [class.assistant]="message.role === 'assistant'">
            <div class="message-content">
              <div class="message-text">{{ message.content }}</div>
              <div class="message-time">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>

          <div *ngIf="isLoading" class="message assistant thinking">
            <div class="message-content">
              <div class="thinking-container">
                <span class="thinking-text">Thinking</span>
                <div class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-input-container">
          <div class="quick-actions" *ngIf="messages.length === 0">
            <button 
              mat-stroked-button 
              *ngFor="let action of quickActions"
              (click)="sendQuickMessage(action)"
              class="quick-action-btn">
              {{ action }}
            </button>
          </div>
          <div class="input-wrapper">
            <input 
              type="text"
              [(ngModel)]="userMessage" 
              (keyup.enter)="sendMessage()"
              (keyup.escape)="toggleChat()"
              placeholder="Type your message..."
              [disabled]="isLoading"
              class="chat-input"
              #messageInput>
            <button 
              mat-icon-button 
              (click)="sendMessage()"
              [disabled]="!userMessage.trim() || isLoading"
              class="send-btn"
              aria-label="Send message">
              <mat-icon>send</mat-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AiChatbotComponent implements OnInit, OnDestroy {
  isOpen = false;
  messages: ChatMessage[] = [];
  userMessage = '';
  isLoading = false;
  isOnline = true;
  unreadCount = 0;
  private destroy$ = new Subject<void>();

  quickActions = [
    'What products do you have?',
    'How does checkout work?',
    'Tell me about recommendations',
    'Show me features'
  ];

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    // Load chat history from localStorage
    this.loadChatHistory();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.unreadCount = 0;
      this.scrollToBottom();
      // Focus input after animation
      setTimeout(() => {
        const input = document.querySelector('.chat-input') as HTMLInputElement;
        if (input) input.focus();
      }, 300);
    }
  }

  sendMessage() {
    if (!this.userMessage.trim() || this.isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: this.userMessage.trim(),
      timestamp: new Date()
    };

    this.messages.push(userMsg);
    this.saveChatHistory();
    const question = this.userMessage;
    this.userMessage = '';
    this.isLoading = true;
    this.scrollToBottom();

    // Get AI response with a small delay to show thinking indicator
    setTimeout(() => {
      this.chatService.getAIResponse(question, this.getContext())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            const aiMsg: ChatMessage = {
              role: 'assistant',
              content: response,
              timestamp: new Date()
            };
            this.messages.push(aiMsg);
            this.saveChatHistory();
            this.scrollToBottom();
          },
          error: (error) => {
            console.error('Chat error:', error);
            this.isLoading = false;
            const errorMsg: ChatMessage = {
              role: 'assistant',
              content: 'Sorry, I encountered an error. Please try again later or check your internet connection.',
              timestamp: new Date()
            };
            this.messages.push(errorMsg);
            this.scrollToBottom();
          }
        });
    }, 300); // Small delay to show thinking indicator
  }

  sendQuickMessage(message: string) {
    this.userMessage = message;
    this.sendMessage();
  }

  private getContext(): string {
    return `You are a helpful AI shopping assistant for an e-commerce website.
    
Website Features:
- Product browsing with carousel banner
- Shopping cart with sidebar
- User authentication
- Checkout process with form validation
- AI-powered product recommendations based on order history
- Responsive design for mobile, tablet, and desktop

Available Products:
1. Wireless Headphones - $99.99 (Electronics) - Premium quality with noise cancellation
2. Smart Watch - $199.99 (Electronics) - Feature-rich with fitness tracking
3. Laptop Backpack - $49.99 (Accessories) - Durable with multiple compartments
4. Wireless Mouse - $29.99 (Electronics) - Ergonomic with long battery life
5. USB-C Hub - $39.99 (Accessories) - Multi-port for laptops and tablets
6. Mechanical Keyboard - $89.99 (Electronics) - RGB with customizable keys
7. Phone Stand - $19.99 (Accessories) - Adjustable for desk and car
8. Power Bank - $34.99 (Accessories) - High capacity with fast charging

Technologies Used: Angular 17, TypeScript, Angular Material, RxJS, SCSS

Be friendly, helpful, and concise. Answer questions about products, features, and how to use the website.`;
  }

  private scrollToBottom() {
    setTimeout(() => {
      const container = document.querySelector('.chat-messages');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }

  private saveChatHistory() {
    try {
      localStorage.setItem('chat_history', JSON.stringify(this.messages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }

  private loadChatHistory() {
    try {
      const stored = localStorage.getItem('chat_history');
      if (stored) {
        const history = JSON.parse(stored);
        this.messages = history.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        // Keep only last 50 messages
        if (this.messages.length > 50) {
          this.messages = this.messages.slice(-50);
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }

  clearChat() {
    this.messages = [];
    localStorage.removeItem('chat_history');
  }
}
