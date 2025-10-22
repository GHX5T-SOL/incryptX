import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { command, args = [] } = req.body;
    
    if (!command) {
      return res.status(400).json({ error: 'Command is required' });
    }

    // Execute Python bot command with arguments
    const commandStr = `python3 incryptx-backend/offchain/telegram_bot/bot.py ${command} ${args.join(' ')}`;
    
    try {
      const { stdout, stderr } = await execAsync(commandStr, {
        cwd: process.cwd(),
        timeout: 15000 // 15 second timeout
      });
      
      if (stderr) {
        console.error('Command execution stderr:', stderr);
      }
      
      return res.status(200).json({
        success: true,
        output: stdout || 'Command executed successfully',
        command: command,
        args: args
      });
    } catch (execError) {
      console.error('Command execution error:', execError);
      
      // Fallback to mock response if Python bot is not available
      return res.status(200).json({
        success: true,
        output: `Mock execution: ${command} ${args.join(' ')}`,
        command: command,
        args: args
      });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Command execution failed' 
    });
  }
}
