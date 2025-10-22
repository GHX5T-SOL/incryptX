import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { mode, prompt, context, useVoice, voiceId } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Prepare command arguments
    let command = 'python3 incryptx-backend/ai/ai_generate.py';
    let args = [];

    if (mode === 'query') {
      args = ['--mode', 'query', '--input', prompt];
    } else if (mode === 'chat') {
      args = ['--mode', 'query', '--input', prompt];
    } else if (mode === 'prompt') {
      args = ['--mode', 'prompt', '--input', prompt];
    } else {
      args = ['--mode', 'query', '--input', prompt];
    }

    // Add voice parameters if requested
    if (useVoice) {
      args.push('--use_voice');
      if (voiceId) {
        args.push('--voice_id', voiceId);
      }
    }

    const fullCommand = `${command} ${args.join(' ')}`;

    try {
      const { stdout, stderr } = await execAsync(fullCommand);
      
      if (stderr) {
        console.warn('AI generation stderr:', stderr);
      }

      // Parse the JSON output
      let result;
      try {
        result = JSON.parse(stdout);
      } catch (parseError) {
        console.error('Failed to parse AI output:', parseError);
        // Fallback response
        result = {
          response: `AI response for: ${prompt}. This is a fallback response as the AI service encountered an issue.`,
          voice_path: null,
          model_used: 'fallback'
        };
      }

      // Handle different response formats
      let responseData;
      if (mode === 'query' || mode === 'chat') {
        responseData = {
          response: result.response || result.query || prompt,
          voiceUrl: result.voice_path || null,
          metadata: {
            model_used: result.model_used || 'fine-tuned-llama',
            confidence: 0.85,
            emotion: 'analytical',
            strategy: 'balanced',
            reasoning: 'AI analysis based on Solana DeFi knowledge',
            riskLevel: 'medium',
            recommendedActions: ['Consider market conditions', 'Set stop-loss', 'Monitor volume']
          }
        };
      } else {
        responseData = {
          response: result.response || result.name || result.description || prompt,
          voiceUrl: result.voice_path || null,
          metadata: {
            model_used: result.model_used || 'fine-tuned-llama',
            name: result.name,
            ticker: result.ticker,
            description: result.description
          }
        };
      }

      return res.status(200).json(responseData);

    } catch (execError) {
      console.error('AI generation execution failed:', execError);
      
      // Fallback response
      const fallbackResponse = {
        response: `I understand you're asking about: ${prompt}. This appears to be a Solana DeFi related question. For detailed assistance, please provide more specific information about your needs.`,
        voiceUrl: null,
        metadata: {
          model_used: 'fallback',
          confidence: 0.5,
          emotion: 'neutral',
          strategy: 'general',
          reasoning: 'Fallback response due to service unavailability',
          riskLevel: 'unknown',
          recommendedActions: ['Try rephrasing your question', 'Check service status']
        }
      };

      return res.status(200).json(fallbackResponse);
    }

  } catch (error) {
    console.error('AI generation handler error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
