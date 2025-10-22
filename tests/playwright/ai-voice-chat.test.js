import { test, expect } from '@playwright/test';

test.describe('AI Voice Chat E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/incrypt-ai');
    
    // Mock wallet connection
    await page.evaluate(() => {
      window.solana = {
        isPhantom: true,
        publicKey: { toBase58: () => 'MockWalletAddress123' },
        connect: async () => ({ publicKey: { toBase58: () => 'MockWalletAddress123' } }),
        signTransaction: async () => ({ signature: 'MockSignature' }),
        signAllTransactions: async () => ([{ signature: 'MockSignature' }]),
      };
    });
    
    // Wait for page to load and connect wallet
    await page.waitForSelector('text=Connect Wallet', { timeout: 10000 });
    await page.click('text=Connect Wallet');
    await expect(page.locator('text=MockWalletAddress123')).toBeVisible({ timeout: 10000 });
  });

  test('should display AI chat interface with voice toggle', async ({ page }) => {
    // Check if AI chat interface is visible
    await expect(page.locator('text=IncryptX AI Assistant')).toBeVisible();
    
    // Check for voice toggle button
    await expect(page.locator('[data-testid="voice-toggle"]')).toBeVisible();
    
    // Check for chat input
    await expect(page.locator('[data-testid="chat-input"]')).toBeVisible();
    
    // Check for send button
    await expect(page.locator('[data-testid="send-button"]')).toBeVisible();
  });

  test('should send text query and receive AI response', async ({ page }) => {
    // Mock AI API response
    await page.route('/api/ai/generate', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          response: 'Based on current market conditions, SOL shows strong bullish momentum. Consider setting a stop-loss at 0.025 SOL and take profit at 0.035 SOL.',
          voiceUrl: null,
          metadata: {
            model_used: 'fine-tuned-llama',
            confidence: 0.85,
            emotion: 'analytical',
            strategy: 'balanced',
            reasoning: 'AI analysis based on Solana DeFi knowledge',
            riskLevel: 'medium',
            recommendedActions: ['Set stop-loss', 'Monitor volume', 'Consider DCA']
          }
        })
      });
    });

    // Type a query
    const query = 'What do you think about SOL price movement?';
    await page.fill('[data-testid="chat-input"]', query);
    
    // Send the query
    await page.click('[data-testid="send-button"]');
    
    // Wait for AI response
    await expect(page.locator('text=Based on current market conditions')).toBeVisible({ timeout: 10000 });
    
    // Check that the response includes confidence and emotion
    await expect(page.locator('text=Confidence: 85%')).toBeVisible();
    await expect(page.locator('text=Emotion: analytical')).toBeVisible();
  });

  test('should toggle voice mode and send voice-enabled query', async ({ page }) => {
    // Mock AI API response with voice
    await page.route('/api/ai/generate', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          response: 'I can help you with that trading strategy. Based on my analysis, this looks like a solid approach.',
          voiceUrl: 'https://api.elevenlabs.io/v1/text-to-speech/mock-voice-id/audio.mp3',
          metadata: {
            model_used: 'fine-tuned-llama',
            confidence: 0.92,
            emotion: 'helpful',
            strategy: 'strategic',
            reasoning: 'Voice-enabled AI analysis',
            riskLevel: 'low',
            recommendedActions: ['Consider this strategy', 'Monitor implementation']
          }
        })
      });
    });

    // Toggle voice mode
    await page.click('[data-testid="voice-toggle"]');
    
    // Check that voice mode is enabled
    await expect(page.locator('[data-testid="voice-indicator"]')).toBeVisible();
    
    // Type a query
    const query = 'Help me with a trading strategy for memecoins';
    await page.fill('[data-testid="chat-input"]', query);
    
    // Send the query with voice enabled
    await page.click('[data-testid="send-button"]');
    
    // Wait for AI response
    await expect(page.locator('text=I can help you with that trading strategy')).toBeVisible({ timeout: 10000 });
    
    // Check for voice response indicator
    await expect(page.locator('[data-testid="voice-response"]')).toBeVisible();
    
    // Check for play button for voice response
    await expect(page.locator('[data-testid="play-voice-button"]')).toBeVisible();
  });

  test('should play voice response when play button is clicked', async ({ page }) => {
    // Mock AI API response with voice
    await page.route('/api/ai/generate', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          response: 'This is a voice response test.',
          voiceUrl: 'https://api.elevenlabs.io/v1/text-to-speech/mock-voice-id/audio.mp3',
          metadata: {
            model_used: 'fine-tuned-llama',
            confidence: 0.88,
            emotion: 'friendly',
            strategy: 'supportive',
            reasoning: 'Voice test response',
            riskLevel: 'low',
            recommendedActions: []
          }
        })
      });
    });

    // Enable voice mode
    await page.click('[data-testid="voice-toggle"]');
    
    // Send a query
    await page.fill('[data-testid="chat-input"]', 'Test voice response');
    await page.click('[data-testid="send-button"]');
    
    // Wait for response
    await expect(page.locator('text=This is a voice response test')).toBeVisible({ timeout: 10000 });
    
    // Click play button for voice response
    await page.click('[data-testid="play-voice-button"]');
    
    // Check that audio element is created and playing
    const audioElement = await page.locator('audio');
    await expect(audioElement).toBeVisible();
  });

  test('should handle AI service errors gracefully', async ({ page }) => {
    // Mock AI API error
    await page.route('/api/ai/generate', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'AI service temporarily unavailable' })
      });
    });

    // Send a query
    await page.fill('[data-testid="chat-input"]', 'Test error handling');
    await page.click('[data-testid="send-button"]');
    
    // Wait for error message or fallback response
    await expect(page.locator('text=AI service error')).toBeVisible({ timeout: 10000 });
  });

  test('should display market sentiment analysis', async ({ page }) => {
    // Mock market sentiment response
    await page.route('/api/ai/generate', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          response: 'Market sentiment for SOL: bullish with 87% confidence. Social sentiment: 85%, Technical score: 92%, Risk score: 45%. Recommendation: BUY.',
          voiceUrl: null,
          metadata: {
            model_used: 'fine-tuned-llama',
            confidence: 0.87,
            emotion: 'bullish',
            strategy: 'momentum',
            reasoning: 'Strong technical and social indicators',
            riskLevel: 'low',
            recommendedActions: ['Consider buying position', 'Set stop-loss', 'Monitor volume']
          }
        })
      });
    });

    // Send a sentiment query
    await page.fill('[data-testid="chat-input"]', 'What is the market sentiment for SOL?');
    await page.click('[data-testid="send-button"]');
    
    // Wait for sentiment analysis
    await expect(page.locator('text=Market sentiment for SOL: bullish')).toBeVisible({ timeout: 10000 });
    
    // Check for sentiment metrics
    await expect(page.locator('text=Social sentiment: 85%')).toBeVisible();
    await expect(page.locator('text=Technical score: 92%')).toBeVisible();
    await expect(page.locator('text=Recommendation: BUY')).toBeVisible();
  });

  test('should execute trade action through AI', async ({ page }) => {
    // Mock trade execution response
    await page.route('/api/ai/generate', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          response: 'Trade executed: BUY 1.5 SOL at market price. Transaction: MockSignature123...',
          voiceUrl: null,
          metadata: {
            model_used: 'fine-tuned-llama',
            confidence: 1.0,
            emotion: 'executive',
            strategy: 'direct_execution',
            reasoning: 'AI trade execution',
            riskLevel: 'medium',
            recommendedActions: ['Monitor position', 'Set stop-loss'],
            txSignature: 'MockSignature1234567890abcdef',
            tradeDetails: { action: 'buy', tokenMint: 'So11111111111111111111111111111111111111112', amount: 1.5, price: null }
          }
        })
      });
    });

    // Send a trade execution query
    await page.fill('[data-testid="chat-input"]', 'Buy 1.5 SOL at market price');
    await page.click('[data-testid="send-button"]');
    
    // Wait for trade execution response
    await expect(page.locator('text=Trade executed: BUY 1.5 SOL')).toBeVisible({ timeout: 10000 });
    
    // Check for transaction signature
    await expect(page.locator('text=Transaction: MockSignature123')).toBeVisible();
  });

  test('should provide feedback on AI responses', async ({ page }) => {
    // Mock AI response
    await page.route('/api/ai/generate', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          response: 'This is a test response for feedback.',
          voiceUrl: null,
          metadata: {
            model_used: 'fine-tuned-llama',
            confidence: 0.8,
            emotion: 'neutral',
            strategy: 'general',
            reasoning: 'Test response',
            riskLevel: 'low',
            recommendedActions: []
          }
        })
      });
    });

    // Send a query
    await page.fill('[data-testid="chat-input"]', 'Test feedback system');
    await page.click('[data-testid="send-button"]');
    
    // Wait for response
    await expect(page.locator('text=This is a test response for feedback')).toBeVisible({ timeout: 10000 });
    
    // Click positive feedback button
    await page.click('[data-testid="feedback-positive"]');
    
    // Check for feedback confirmation
    await expect(page.locator('text=Thank you for your positive feedback')).toBeVisible();
  });

  test('should clear chat history', async ({ page }) => {
    // Send a query first
    await page.fill('[data-testid="chat-input"]', 'Test message');
    await page.click('[data-testid="send-button"]');
    
    // Wait for message to appear
    await expect(page.locator('text=Test message')).toBeVisible({ timeout: 10000 });
    
    // Clear chat history
    await page.click('[data-testid="clear-chat-button"]');
    
    // Check that chat is cleared
    await expect(page.locator('text=Chat history cleared')).toBeVisible();
    await expect(page.locator('text=Test message')).not.toBeVisible();
  });
});
