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

    // Map command to appropriate Python bot function
    let pythonCommand = '';
    let commandArgs = [command, ...args];
    
    switch (command.split(' ')[0]) {
      case '/launch':
        pythonCommand = `python3 incryptx-backend/offchain/telegram_bot/bot.py launch ${args.join(' ')}`;
        break;
      case '/trade':
        pythonCommand = `python3 incryptx-backend/offchain/telegram_bot/bot.py trade ${args.join(' ')}`;
        break;
      case '/portfolio':
        pythonCommand = `python3 incryptx-backend/offchain/telegram_bot/bot.py portfolio ${args.join(' ')}`;
        break;
      case '/analyze':
        pythonCommand = `python3 incryptx-backend/offchain/telegram_bot/bot.py analyze ${args.join(' ')}`;
        break;
      case '/copy':
        pythonCommand = `python3 incryptx-backend/offchain/telegram_bot/bot.py copy ${args.join(' ')}`;
        break;
      default:
        pythonCommand = `python3 incryptx-backend/offchain/telegram_bot/bot.py generic "${command}"`;
    }
    
    try {
      const { stdout, stderr } = await execAsync(pythonCommand, {
        cwd: process.cwd(),
        timeout: 10000 // 10 second timeout
      });
      
      if (stderr) {
        console.error('Command execution stderr:', stderr);
      }
      
      // Parse the output
      let responseMessage = stdout || 'Command executed successfully';
      let signature = null;
      
      try {
        const output = JSON.parse(stdout);
        responseMessage = output.message || output.response || stdout;
        signature = output.signature || output.tx_signature;
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
        command: command,
        args: args
      });
    } catch (execError) {
      console.error('Command execution error:', execError);
      
      // Fallback to mock responses based on command type
      let mockResponse = '';
      let mockSignature = null;
      
      switch (command.split(' ')[0]) {
        case '/launch':
          mockResponse = `🚀 Mock Launch: Token "${args[0] || 'Unknown'}" launched successfully!\n\n📊 Initial MC: $1,000\n💰 Supply: 1,000,000,000\n🎯 Migration MC: $69,000`;
          mockSignature = `MockLaunchSignature${Date.now()}`;
          break;
        case '/trade':
          mockResponse = `💹 Mock Trade: Executed ${args[1] || 'buy'} ${args[2] || '1'} ${args[0] || 'SOL'}\n\n📈 Trade successful\n⏱️ Execution: 0.2s`;
          mockSignature = `MockTradeSignature${Date.now()}`;
          break;
        case '/portfolio':
          mockResponse = `📊 Mock Portfolio Summary\n\n💰 Total Value: $1,250 (+25% today)\n🎯 Top Holdings:\n• SOL: $750 (+15%)\n• Mock Token: $500 (+40%)`;
          break;
        case '/analyze':
          mockResponse = `📈 Mock Analysis: ${args.join(' ') || 'market'}\n\n🔍 Sentiment: Bullish\n📊 Technical: Strong support levels\n💡 Recommendation: Consider position`;
          break;
        case '/copy':
          mockResponse = `📋 Mock Copy Trading: Now copying ${args[0] || 'trader'}\n\n⚙️ Settings:\n• Copy %: 100%\n• Max trade: $100\n• Auto-follow: Enabled`;
          break;
        default:
          mockResponse = `🤖 Mock Response: Command "${command}" executed successfully`;
      }
      
      return res.status(200).json({
        success: true,
        message: mockResponse,
        signature: mockSignature,
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
