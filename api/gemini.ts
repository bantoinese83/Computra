/**
 * Serverless API Route for Gemini API
 * 
 * This keeps your API key secure on the server side.
 * 
 * Deployment:
 * - Vercel: Place in /api folder (auto-detected)
 * - Netlify: Place in /netlify/functions folder
 * - Cloudflare Workers: Place in /functions folder
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get API key from server-side environment variable
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY not configured');
    return res.status(500).json({ 
      error: 'API key not configured on server' 
    });
  }

  try {
    // Dynamic import to avoid bundling in client
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });

    const { prompt, model = 'gemini-2.5-flash', tools, temperature } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      tools: tools || undefined,
      temperature: temperature || 0.2,
    });

    return res.status(200).json({ data: response });
  } catch (error) {
    console.error('Gemini API error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

