# AI Integration Guide for GitHub Pages

This guide explains how to integrate real AI services with your chatbot that works on GitHub Pages.

## ⚠️ Important: GitHub Pages Limitations

GitHub Pages only serves **static files** (HTML, CSS, JS). It cannot:
- Run backend servers
- Store API keys securely
- Make direct API calls that require server-side authentication

## ✅ Solution Options

### Option 1: Hugging Face Inference API (FREE & Recommended)

**✅ Works on GitHub Pages**  
**✅ No API key needed**  
**✅ Free tier available**

#### Setup:
1. The service is already integrated in `chat.service.ts`
2. Set `AI_SERVICE: 'huggingface'` in `chat.service.ts`
3. Deploy to GitHub Pages - it will work immediately!

#### How it works:
- Uses public Hugging Face models
- No authentication required
- Works directly from the browser
- Free tier is generous

#### Current Configuration:
```typescript
private readonly AI_SERVICE: 'mock' | 'huggingface' | 'openai' | 'openai-proxy' = 'huggingface';
```

### Option 2: OpenAI via Serverless Proxy (Recommended for Production)

**✅ Works on GitHub Pages**  
**✅ Secure (API key hidden)**  
**❌ Requires separate hosting for proxy**

#### Setup Steps:

1. **Create a Vercel Serverless Function** (Free tier available)

   Create `api/chat.js` in your project root:
   ```javascript
   export default async function handler(req, res) {
     if (req.method !== 'POST') {
       return res.status(405).json({ error: 'Method not allowed' });
     }

     const { message, context } = req.body;

     try {
       const response = await fetch('https://api.openai.com/v1/chat/completions', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
         },
         body: JSON.stringify({
           model: 'gpt-3.5-turbo',
           messages: [
             { role: 'system', content: context },
             { role: 'user', content: message }
           ],
           max_tokens: 500,
           temperature: 0.7
         })
       });

       const data = await response.json();
       res.status(200).json({ message: data.choices[0].message.content });
     } catch (error) {
       res.status(500).json({ error: 'Failed to get AI response' });
     }
   }
   ```

2. **Deploy to Vercel** (Free):
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Set Environment Variable**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add `OPENAI_API_KEY` with your OpenAI API key

4. **Update chat.service.ts**:
   ```typescript
   private readonly AI_SERVICE = 'openai-proxy';
   private readonly OPENAI_PROXY_URL = 'https://your-project.vercel.app/api/chat';
   ```

### Option 3: Netlify Functions (Alternative to Vercel)

Similar to Vercel, create a Netlify function to proxy OpenAI requests.

### Option 4: OpenAI Direct (NOT Recommended for GitHub Pages)

**❌ Does NOT work on GitHub Pages**  
**❌ Exposes API key in frontend code**  
**⚠️ Security risk**

Only use for local development. Never commit API keys to git!

## 🚀 Quick Start: Enable Hugging Face (Recommended)

1. Open `src/app/services/chat.service.ts`
2. Find this line:
   ```typescript
   private readonly AI_SERVICE: 'mock' | 'huggingface' | 'openai' | 'openai-proxy' = 'huggingface';
   ```
3. It's already set to `'huggingface'` - you're good to go!
4. Deploy to GitHub Pages - it will work!

## 🔧 Switching Between Services

In `src/app/services/chat.service.ts`, change the `AI_SERVICE` value:

```typescript
// Use mock responses (default)
private readonly AI_SERVICE = 'mock';

// Use Hugging Face (FREE, works on GitHub Pages)
private readonly AI_SERVICE = 'huggingface';

// Use OpenAI directly (requires API key, NOT for GitHub Pages)
private readonly AI_SERVICE = 'openai';

// Use OpenAI via proxy (requires serverless function)
private readonly AI_SERVICE = 'openai-proxy';
```

## 📝 Environment Variables

### For Local Development (OpenAI):
Create `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  openaiApiKey: 'your-api-key-here' // Only for local testing!
};
```

**⚠️ Never commit this file to git!** Add to `.gitignore`:
```
src/environments/environment.ts
```

## 🎯 Recommended Setup for GitHub Pages

**Best Option: Hugging Face**
- ✅ Free
- ✅ No setup needed
- ✅ Works immediately
- ✅ No API keys required
- ✅ Works on GitHub Pages

**For Production: OpenAI via Proxy**
- ✅ More accurate responses
- ✅ Better conversation quality
- ✅ Secure (API key hidden)
- ❌ Requires Vercel/Netlify account
- ❌ Needs OpenAI API key (paid)

## 🧪 Testing

1. **Test Hugging Face**:
   ```bash
   npm start
   # Open chat and ask: "What products do you have?"
   ```

2. **Test OpenAI Proxy** (if set up):
   - Make sure proxy is deployed
   - Update `OPENAI_PROXY_URL` in `chat.service.ts`
   - Set `AI_SERVICE = 'openai-proxy'`

## 🔒 Security Best Practices

1. **Never commit API keys** to git
2. **Use environment variables** for sensitive data
3. **Use serverless proxies** for production
4. **Enable CORS** properly on proxy endpoints
5. **Rate limit** your API calls

## 📚 Additional Resources

- [Hugging Face Inference API](https://huggingface.co/docs/api-inference/index)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)

## 🐛 Troubleshooting

### Hugging Face: "Model is loading"
- Wait 10-20 seconds and try again
- The model loads on first request
- Consider using a different model

### OpenAI Proxy: CORS errors
- Make sure your proxy allows CORS
- Add CORS headers in your serverless function

### Rate Limiting
- Hugging Face: Free tier has rate limits
- OpenAI: Check your usage dashboard
- Implement request throttling if needed

## ✅ Current Status

Your chatbot is currently configured to use **Hugging Face** which works perfectly on GitHub Pages!
