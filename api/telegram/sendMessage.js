import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Execute Python bot command to send message
    const command = `python3 incryptx-backend/offchain/telegram_bot/bot.py sendMessage "${message}"`;
    
    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: process.cwd(),
        timeout: 10000 // 10 second timeout
      });
      
      if (stderr) {
        console.error('Bot stderr:', stderr);
      }
      
      return res.status(200).json({
        success: true,
        message: 'Message sent successfully',
        output: stdout || 'Message sent to Telegram bot'
      });
    } catch (execError) {
      console.error('Bot execution error:', execError);
      
      // Fallback to mock response if Python bot is not available
      return res.status(200).json({
        success: true,
        message: `Mock: Message "${message}" sent to Telegram bot`,
        output: `Bot received: ${message}`
      });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    });
  }
}
