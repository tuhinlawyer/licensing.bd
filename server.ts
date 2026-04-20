import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import * as path from 'path';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/calculate-licensing', async (req, res) => {
    try {
      const { businessType, location, ownership, size } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is missing' });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const prompt = `
        You are a highly an expert legal and corporate compliance advisor for Bangladesh.
        The user wants to start a business in Bangladesh with the following details:
        - Business Type: ${businessType}
        - Location: ${location}
        - Ownership: ${ownership} (e.g., Local, Foreign, Joint Venture)
        - Size: ${size}
        
        Based on Bangladesh's current regulatory frameworks (including BIDA, City Corporations, NBR, RJSC, etc.), structure a response listing:
        1. Required Licenses (Trade License, TIN, VAT, specific sectoral licenses, etc.)
        2. Expected Timeframe (in days or weeks)
        3. Estimated Total Setup Cost (in BDT)
        4. Potential Compliance Risks or advice

        Return the result strictly as a valid JSON object matching exactly this schema:
        {
          "licenses": [
            {
              "name": "Full Name of License",
              "reason": "Brief reason why it's needed"
            }
          ],
          "totalEstimatedFee": "Estimated conservative range in BDT",
          "timeline": "Estimated timeframe",
          "riskFlags": ["risk 1", "risk 2"]
        }
        
        Respond with ONLY the raw JSON object. Do not wrap it in markdown code blocks.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      let rawResponse = response.text || '';
      
      // Cleanup any potential markdown blocks Gemini might return despite instructions
      rawResponse = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();

      const jsonResult = JSON.parse(rawResponse);
      res.json(jsonResult);
    } catch (error) {
      console.error('Error generating AI licensing calculation:', error);
      res.status(500).json({ error: 'Failed to calculate licenses.' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
