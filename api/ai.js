// api/ai.js - Vercel Serverless Function for AI Processing
import { spawn } from 'child_process';
import path from 'path';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, mode = 'query', walletAddress } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Sanitize input
    const sanitizedQuery = query.replace(/[\r\n\t]/g, ' ').slice(0, 500);
    const safeMode = ['query', 'strategy', 'emotion'].includes(mode) ? mode : 'query';

    console.log(`AI API Request: ${safeMode} - ${sanitizedQuery.slice(0, 50)}...`);

    // For Vercel deployment, we'll use a mock AI response since Python subprocess
    // is not available in serverless environment
    // In production, you would integrate with actual AI services like OpenAI, Hugging Face, etc.
    
    const mockAIResponse = await generateMockAIResponse(sanitizedQuery, safeMode, walletAddress);

    return res.status(200).json({
      success: true,
      response: mockAIResponse.response,
      confidence: mockAIResponse.confidence,
      emotion: mockAIResponse.emotion,
      strategy: mockAIResponse.strategy,
      reasoning: mockAIResponse.reasoning,
      riskLevel: mockAIResponse.riskLevel,
      recommendedActions: mockAIResponse.recommendedActions,
      timestamp: new Date().toISOString(),
      query: sanitizedQuery,
      mode: safeMode
    });

  } catch (error) {
    console.error('AI API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

// Mock AI response generator for serverless environment
async function generateMockAIResponse(query, mode, walletAddress) {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

  const responses = {
    query: {
      response: `Based on current market analysis, "${query}" indicates ${Math.random() > 0.5 ? 'bullish' : 'neutral'} sentiment. Technical indicators suggest ${Math.random() > 0.5 ? 'strong support' : 'resistance levels'} around key price points. Consider implementing risk management strategies and monitoring volume patterns.`,
      confidence: 0.75 + Math.random() * 0.2,
      emotion: Math.random() > 0.5 ? 'analytical' : 'optimistic',
      strategy: 'balanced_approach',
      reasoning: 'Market data analysis combined with technical indicators and sentiment metrics.',
      riskLevel: 'medium',
      recommendedActions: ['Monitor key support/resistance levels', 'Set stop-loss orders', 'Track volume patterns', 'Consider DCA strategy']
    },
    strategy: {
      response: `Strategic analysis for "${query}": I recommend a diversified approach focusing on ${Math.random() > 0.5 ? 'momentum' : 'value'} opportunities. Current market conditions suggest ${Math.random() > 0.5 ? 'accumulation' : 'distribution'} phase, requiring careful position sizing and risk management.`,
      confidence: 0.8 + Math.random() * 0.15,
      emotion: 'strategic',
      strategy: 'diversified_portfolio',
      reasoning: 'Multi-timeframe analysis combined with market structure and risk assessment.',
      riskLevel: 'low',
      recommendedActions: ['Diversify across multiple assets', 'Implement position sizing rules', 'Use trailing stop-losses', 'Monitor market structure changes']
    },
    emotion: {
      response: `Emotional analysis for "${query}": The current market sentiment shows ${Math.random() > 0.5 ? 'positive' : 'mixed'} emotions with ${Math.random() > 0.5 ? 'high' : 'moderate'} community engagement. Fear and greed indicators suggest ${Math.random() > 0.5 ? 'opportunity' : 'caution'} in current market conditions.`,
      confidence: 0.7 + Math.random() * 0.25,
      emotion: Math.random() > 0.5 ? 'neutral' : 'cautious',
      strategy: 'sentiment_driven',
      reasoning: 'Social sentiment analysis combined with fear/greed indicators and community engagement metrics.',
      riskLevel: 'medium',
      recommendedActions: ['Monitor social sentiment', 'Track community engagement', 'Watch for sentiment shifts', 'Use emotional intelligence in trading decisions']
    }
  };

  const baseResponse = responses[mode];
  
  // Add personalized elements based on wallet address if provided
  if (walletAddress) {
    baseResponse.response += ` Personalized for wallet ${walletAddress.slice(0, 8)}...`;
  }

  // Add some randomness to make responses feel more natural
  const randomFactors = [
    'Market volatility is currently elevated.',
    'Liquidity conditions are favorable.',
    'Technical indicators are showing mixed signals.',
    'Community sentiment is trending positive.',
    'Risk-reward ratio looks attractive.',
  ];
  
  if (Math.random() > 0.7) {
    baseResponse.response += ` ${randomFactors[Math.floor(Math.random() * randomFactors.length)]}`;
  }

  return baseResponse;
}

// Alternative implementation for local development with Python subprocess
async function callPythonAI(query, mode, walletAddress) {
  return new Promise((resolve, reject) => {
    const pyPath = path.resolve('./incryptx-backend/ai/ai_generate.py');
    const venvPython = path.resolve('./incryptx-backend/venv/bin/python');
    
    const args = [pyPath, '--mode', mode, '--input', query];
    const child = spawn(venvPython, args, { stdio: ['ignore', 'pipe', 'pipe'] });

    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (d) => (stdout += d.toString()));
    child.stderr.on('data', (d) => (stderr += d.toString()));
    child.on('error', (err) => reject(err));
    child.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Python AI script exited with code ${code}: ${stderr}`));
      }
      try {
        const jsonStart = stdout.indexOf('{');
        const parsed = JSON.parse(jsonStart >= 0 ? stdout.slice(jsonStart) : stdout);
        resolve(parsed);
      } catch (e) {
        reject(new Error(`Failed to parse AI response: ${e}\nSTDOUT:${stdout}\nSTDERR:${stderr}`));
      }
    });
  });
}
