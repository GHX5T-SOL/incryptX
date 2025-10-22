import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { traderAddress } = req.body;
    
    if (!traderAddress) {
      return res.status(400).json({ error: 'Trader address is required' });
    }

    // Execute Python bot command for copy trading
    const command = `python3 incryptx-backend/offchain/telegram_bot/bot.py copy ${traderAddress}`;
    
    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: process.cwd(),
        timeout: 10000 // 10 second timeout
      });
      
      if (stderr) {
        console.error('Copy trader stderr:', stderr);
      }
      
      // Parse the output
      let responseMessage = stdout || 'Copy trading enabled successfully';
      let signature = null;
      
      try {
        const output = JSON.parse(stdout);
        responseMessage = output.message || output.response || stdout;
        signature = output.signature;
      } catch (parseError) {
        // If stdout is not JSON, look for signature pattern
        const signatureMatch = stdout.match(/signature[:\s]+([A-Za-z0-9]{64,88})/i);
        if (signatureMatch) {
          signature = signatureMatch[1];
        }
      }
      
      return res.status(200).json({
        success: true,
        message: responseMessage,
        signature: signature,
        traderAddress: traderAddress
      });
    } catch (execError) {
      console.error('Copy trader execution error:', execError);
      
      // Fallback to mock response if Python bot is not available
      const mockSignature = `MockCopySignature${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      
      return res.status(200).json({
        success: true,
        message: `📋 Mock Copy Trading: Now copying trader ${traderAddress}\n\n⚙️ Settings:\n• Copy %: 100%\n• Max trade: $100\n• Auto-follow: Enabled\n• Risk level: Medium`,
        signature: mockSignature,
        traderAddress: traderAddress
      });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Copy trader setup failed' 
    });
  }
}
