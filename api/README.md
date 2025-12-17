# Backend API Routes

This directory contains serverless functions that keep your API keys secure on the server side.

## Setup

### For Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. The `/api` folder is automatically detected by Vercel

3. Set environment variable in Vercel dashboard:
   - Go to your project settings
   - Add `GEMINI_API_KEY` in Environment Variables

4. Deploy:
   ```bash
   vercel
   ```

### For Netlify

1. Move `api/gemini.ts` to `netlify/functions/gemini.ts`

2. Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

3. Set environment variable in Netlify dashboard

4. Deploy:
   ```bash
   netlify deploy --prod
   ```

### For Cloudflare Workers

1. Move `api/gemini.ts` to `functions/gemini.ts`

2. Update `wrangler.toml` with environment variables

3. Deploy:
   ```bash
   npx wrangler deploy
   ```

## Frontend Integration

Update your frontend code to call the API route instead of directly calling Gemini:

```typescript
// Before (INSECURE - exposes API key):
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const response = await ai.models.generateContent({ ... });

// After (SECURE - API key stays on server):
const response = await fetch('/api/gemini', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Your prompt here',
    model: 'gemini-2.5-flash',
    tools: [{ googleSearch: {} }],
    temperature: 0.2,
  }),
});
const { data } = await response.json();
```

## Security Benefits

✅ API key never exposed to client  
✅ API key never in JavaScript bundle  
✅ Can add rate limiting  
✅ Can add authentication  
✅ Can monitor and log usage  

