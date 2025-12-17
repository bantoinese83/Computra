# 🔒 API Key Security Guide

## ⚠️ CRITICAL SECURITY WARNING

**Your API key is currently exposed in the client-side JavaScript bundle.** This means anyone can:
- View your API key in the browser's developer tools
- Extract it from the JavaScript bundle
- Use it to make API calls on your behalf (costing you money)

## 🛡️ Immediate Actions Required

### 1. Rotate Your API Key Immediately

If you've already deployed this app or committed it to a public repository:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Delete or regenerate your current API key**
3. Create a new key and update your `.env` file

### 2. Never Commit `.env` Files

The `.gitignore` file should include:
```
.env
.env.local
.env.*.local
*.env
```

**Verify your `.env` file is NOT in git:**
```bash
git ls-files | grep .env
```
If any `.env` files appear, remove them:
```bash
git rm --cached .env
git commit -m "Remove .env from git"
```

### 3. Check Your Git History

If you've already committed an API key:
```bash
# Search git history for API keys
git log -p --all -S "GEMINI_API_KEY" | grep -A 5 -B 5 "GEMINI_API_KEY"
```

If found, you **must**:
1. Rotate the API key immediately
2. Consider using [git-filter-repo](https://github.com/newren/git-filter-repo) to remove it from history
3. Force push (⚠️ coordinate with team first)

## 🏗️ Proper Architecture: Backend Proxy

For production, you **MUST** use a backend proxy. The API key should **NEVER** be in client-side code.

### Option 1: Serverless Functions (Recommended)

#### Vercel
Create `api/gemini.ts`:
```typescript
import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const { prompt, model = 'gemini-2.5-flash' } = req.body;
    
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    return res.status(200).json({ data: response });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

#### Netlify Functions
Create `netlify/functions/gemini.ts` (similar structure)

#### Cloudflare Workers
Create `functions/gemini.ts` (similar structure)

### Option 2: Express.js Backend

Create a separate backend service:

```typescript
// backend/server.ts
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/gemini', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const { prompt, model = 'gemini-2.5-flash' } = req.body;
    
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    res.json({ data: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => console.log('Backend running on port 3001'));
```

Then update your frontend to call your backend instead of directly calling Gemini.

## 🔐 Environment Variable Best Practices

### Development
1. **Never** commit `.env` files
2. Use `.env.example` as a template (without real keys):
   ```env
   GEMINI_API_KEY=your_key_here
   ```
3. Add `.env` to `.gitignore`

### Production
1. Set environment variables in your hosting platform's dashboard
2. **Never** hardcode keys in source code
3. Use different API keys for development and production
4. Set up API key usage limits and monitoring

## 🚨 API Key Restrictions (Google Cloud Console)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Click on your API key
4. **Restrict the key:**
   - **Application restrictions**: Restrict to specific domains/IPs
   - **API restrictions**: Limit to only Gemini API
5. Set up usage quotas and alerts

## 📊 Monitoring & Alerts

1. **Set up billing alerts** in Google Cloud Console
2. **Monitor API usage** regularly
3. **Set daily/monthly quotas** to prevent abuse
4. **Enable audit logs** to track usage

## ✅ Security Checklist

- [ ] `.env` is in `.gitignore`
- [ ] `.env` is NOT committed to git
- [ ] API key is rotated if previously exposed
- [ ] Backend proxy is implemented for production
- [ ] API key restrictions are configured in Google Cloud
- [ ] Usage quotas and alerts are set up
- [ ] Different keys for dev/staging/production
- [ ] Team members know not to commit `.env` files

## 🆘 If Your Key is Compromised

1. **Immediately** delete/regenerate the key in Google Cloud Console
2. Update all environments (dev, staging, production)
3. Review API usage logs for unauthorized access
4. Check billing for unexpected charges
5. Update your architecture to use a backend proxy

## 📚 Additional Resources

- [Google AI API Security Best Practices](https://ai.google.dev/docs/safety)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)

