import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // AI Service Configuration
  // Options: 'mock' | 'huggingface' | 'openai' | 'openai-proxy'
  private readonly AI_SERVICE: 'mock' | 'huggingface' | 'openai' | 'openai-proxy' = 'huggingface';
  
  // Hugging Face API (FREE - No API key needed for public models)
  private readonly HUGGINGFACE_API = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';
  
  // OpenAI API (requires API key)
  private readonly OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
  
  // OpenAI Proxy (use serverless function - see AI_INTEGRATION_GUIDE.md)
  private readonly OPENAI_PROXY_URL = 'https://your-proxy.vercel.app/api/chat'; // Replace with your proxy URL

  constructor(private http: HttpClient) {}

  /**
   * Get AI response for user message
   * @param message User's message
   * @param context System context/prompt
   * @returns Observable with AI response
   */
  getAIResponse(message: string, context: string): Observable<string> {
    switch (this.AI_SERVICE) {
      case 'mock':
        return of(this.getMockResponse(message)).pipe(
          map(response => response)
        );
      
      case 'huggingface':
        return this.callHuggingFace(message, context).pipe(
          catchError(error => {
            console.error('Hugging Face API Error:', error);
            // Fallback to mock response
            return of(this.getMockResponse(message));
          })
        );
      
      case 'openai':
        return this.callOpenAI(message, context).pipe(
          catchError(error => {
            console.error('OpenAI API Error:', error);
            return of(this.getMockResponse(message));
          })
        );
      
      case 'openai-proxy':
        return this.callOpenAIProxy(message, context).pipe(
          catchError(error => {
            console.error('OpenAI Proxy Error:', error);
            return of(this.getMockResponse(message));
          })
        );
      
      default:
        return of(this.getMockResponse(message));
    }
  }

  /**
   * Call Hugging Face Inference API (FREE - Works on GitHub Pages)
   * No API key needed for public models
   */
  private callHuggingFace(message: string, context: string): Observable<string> {
    // Using a conversational model that works well for chat
    const apiUrl = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';
    
    const body = {
      inputs: {
        past_user_inputs: [],
        generated_responses: [],
        text: message
      },
      parameters: {
        max_length: 200,
        temperature: 0.7,
        top_p: 0.9
      }
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(apiUrl, body, { headers }).pipe(
      map(response => {
        if (response.error) {
          // Model might be loading, return a helpful message
          if (response.error.includes('loading')) {
            return 'The AI model is loading. Please try again in a few seconds.';
          }
          throw new Error(response.error);
        }
        
        // Extract the generated text
        const generatedText = response.generated_text || response[0]?.generated_text;
        if (generatedText) {
          return generatedText.trim();
        }
        
        // Fallback: try to get any text from response
        const text = response.text || response[0]?.text;
        return text ? text.trim() : this.getContextualResponse(message, context);
      }),
      catchError(error => {
        // If Hugging Face fails, use contextual response
        return of(this.getContextualResponse(message, context));
      })
    );
  }

  /**
   * Call OpenAI API directly (requires API key - NOT recommended for GitHub Pages)
   * WARNING: Never expose API keys in frontend code!
   */
  private callOpenAI(message: string, context: string): Observable<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      console.warn('OpenAI API key not found. Using mock response.');
      return of(this.getMockResponse(message));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    });

    const body = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: context },
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.7
    };

    return this.http.post<any>(this.OPENAI_API_URL, body, { headers }).pipe(
      map(response => response.choices[0]?.message?.content || 'Sorry, I could not generate a response.')
    );
  }

  /**
   * Call OpenAI via proxy (Recommended for GitHub Pages)
   * Set up a serverless function (Vercel/Netlify) to proxy requests
   */
  private callOpenAIProxy(message: string, context: string): Observable<string> {
    const body = {
      message: message,
      context: context
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.OPENAI_PROXY_URL, body, { headers }).pipe(
      map(response => response.message || response.text || 'Sorry, I could not generate a response.')
    );
  }

  /**
   * Get API key from environment (you'll need to set this up)
   * WARNING: Never commit API keys to git!
   */
  private getApiKey(): string {
    // Option 1: Use environment variable (recommended)
    // Create src/environments/environment.ts and environment.prod.ts
    // return environment.openaiApiKey;
    
    // Option 2: Get from localStorage (for testing only)
    // return localStorage.getItem('openai_api_key') || '';
    
    // Option 3: Hardcode (NOT RECOMMENDED - only for testing)
    return ''; // Add your API key here for testing (remove before committing!)
  }

  /**
   * Generate contextual response when AI service is unavailable
   */
  private getContextualResponse(message: string, context: string): string {
    // Try to provide a smart response based on context
    const lowerMessage = message.toLowerCase();
    
    // Check if it's a product-related question
    if (lowerMessage.includes('product') || lowerMessage.includes('item') || lowerMessage.includes('buy')) {
      return this.getMockResponse(message); // Use mock response for product questions
    }
    
    // Generic helpful response
    return `I understand you're asking about "${message}". 

I'm your AI shopping assistant. I can help you with:
- Product information and recommendations
- How to use the shopping features  
- Checkout and ordering process
- General questions about the store

Could you rephrase your question, or would you like to know about our products, checkout process, or features?`;
  }

  /**
   * Mock AI responses for demonstration
   * Replace with real API when ready
   */
  private getMockResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    // Product questions
    if (lowerMessage.includes('product') || lowerMessage.includes('what do you have')) {
      return `We have 8 amazing products available:
      
1. **Wireless Headphones** - $99.99 (Electronics) - Premium quality with noise cancellation
2. **Smart Watch** - $199.99 (Electronics) - Feature-rich with fitness tracking  
3. **Laptop Backpack** - $49.99 (Accessories) - Durable with multiple compartments
4. **Wireless Mouse** - $29.99 (Electronics) - Ergonomic with long battery life
5. **USB-C Hub** - $39.99 (Accessories) - Multi-port for laptops and tablets
6. **Mechanical Keyboard** - $89.99 (Electronics) - RGB with customizable keys
7. **Phone Stand** - $19.99 (Accessories) - Adjustable for desk and car
8. **Power Bank** - $34.99 (Accessories) - High capacity with fast charging

Browse our products on the home page and add them to your cart!`;
    }

    // Checkout questions
    if (lowerMessage.includes('checkout') || lowerMessage.includes('order') || lowerMessage.includes('buy')) {
      return `Here's how checkout works:

1. **Add to Cart**: Click "Add to Cart" on any product
2. **View Cart**: The cart sidebar opens automatically
3. **Checkout**: Click the "Checkout" button in the cart
4. **Sign In**: If you're not logged in, you'll be redirected to sign in
5. **Fill Form**: Enter your shipping information (name, email, address, etc.)
6. **Place Order**: Submit the form to complete your purchase
7. **Confirmation**: You'll see a success message!

The checkout process is secure and user-friendly. Need help with anything specific?`;
    }

    // Recommendation questions
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
      return `Our AI recommendation system is smart! Here's how it works:

**For New Users:**
- Shows top-rated products based on ratings and reviews

**For Returning Customers:**
- Analyzes your order history
- Identifies your favorite product category
- Suggests similar products you haven't tried yet
- Excludes items you've already purchased

**Example:** If you've ordered Electronics items, we'll recommend other Electronics products that match your interests!

The recommendations appear below the main product grid once you're signed in. Try placing an order to see personalized suggestions!`;
    }

    // Feature questions
    if (lowerMessage.includes('feature') || lowerMessage.includes('what can') || lowerMessage.includes('capabilities')) {
      return `This e-commerce app has many great features:

✨ **Product Browsing**
- Beautiful carousel banner
- Responsive product grid
- Product ratings and reviews
- Detailed product information

🛒 **Shopping Cart**
- Sidebar cart that slides in
- Real-time quantity updates
- Easy item management

🔐 **User Authentication**
- Secure sign-in system
- Protected checkout route
- User session management

💳 **Checkout Process**
- Form validation
- Order summary
- Success confirmation

🤖 **AI Recommendations**
- Personalized product suggestions
- Based on your order history
- Smart category analysis

📱 **Responsive Design**
- Works on mobile, tablet, and desktop
- Optimized for all screen sizes

Want to know more about any specific feature?`;
    }

    // Technology questions
    if (lowerMessage.includes('technology') || lowerMessage.includes('tech stack') || lowerMessage.includes('built with')) {
      return `This application is built with modern technologies:

**Frontend:**
- Angular 17 (latest version)
- TypeScript
- Angular Material (UI components)
- RxJS (reactive programming)
- SCSS (styling)

**Key Features:**
- Standalone components
- Angular Signals (state management)
- Reactive forms
- Route guards
- Lazy loading

**Architecture:**
- Component-based design
- Service-oriented architecture
- Modular structure
- Responsive and accessible

The codebase is clean, maintainable, and follows Angular best practices!`;
    }

    // General help
    if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      return `I'm here to help! I can assist you with:

• Finding and learning about products
• Understanding how checkout works
• Explaining features and capabilities
• Answering questions about the website
• Product recommendations

Just ask me anything about the store, and I'll do my best to help you! 😊`;
    }

    // Default response
    return `I understand you're asking about "${message}". 

I'm an AI shopping assistant for this e-commerce website. I can help you with:
- Product information and recommendations
- How to use the shopping features
- Checkout and ordering process
- General questions about the store

Could you rephrase your question, or would you like to know about our products, checkout process, or features?`;
  }
}
