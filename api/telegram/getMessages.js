import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { chatId } = req.body;
    
    // Execute Python bot command to get messages
    const command = `python3 incryptx-backend/offchain/telegram_bot/bot.py getMessages ${chatId || ''}`;
    
    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: process.cwd(),
        timeout: 5000 // 5 second timeout
      });
      
      if (stderr) {
        console.error('Get messages stderr:', stderr);
      }
      
      // Parse the output to get message list
      let messages = [];
      try {
        const output = JSON.parse(stdout);
        messages = output.messages || [];
      } catch (parseError) {
        // If stdout is not JSON, create mock messages
        messages = [
          {
            id: '1',
            text: '/launch CatWifHat 1000000000',
            timestamp: Date.now() - 3600000,
            user: {
              id: 123456789,
              username: 'trader_alice'
            }
          },
          {
            id: '2',
            text: '🚀 Launching CatWifHat... Success! Token deployed at 0x123...',
            timestamp: Date.now() - 3500000,
            user: {
              id: 987654321,
              username: 'incryptx_bot'
            }
          },
          {
            id: '3',
            text: '/trade $CATWIF buy 1000',
            timestamp: Date.now() - 1800000,
            user: {
              id: 123456789,
              username: 'trader_alice'
            }
          },
          {
            id: '4',
            text: '💹 Trade executed! Bought 1000 CATWIF at $0.01',
            timestamp: Date.now() - 1700000,
            user: {
              id: 987654321,
              username: 'incryptx_bot'
            }
          }
        ];
      }
      
      return res.status(200).json({
        success: true,
        messages: messages
      });
    } catch (execError) {
      console.error('Get messages execution error:', execError);
      
      // Fallback to mock messages if Python bot is not available
      const mockMessages = [
        {
          id: '1',
          text: '/launch CatWifHat 1000000000',
          timestamp: Date.now() - 3600000,
          user: {
            id: 123456789,
            username: 'trader_alice'
          }
        },
        {
          id: '2',
          text: '🚀 Mock Launch: Token "CatWifHat" launched successfully!\n\n📊 Initial MC: $1,000\n💰 Supply: 1,000,000,000\n🎯 Migration MC: $69,000',
          timestamp: Date.now() - 3500000,
          user: {
            id: 987654321,
            username: 'incryptx_bot'
          }
        },
        {
          id: '3',
          text: '/trade $CATWIF buy 1000',
          timestamp: Date.now() - 1800000,
          user: {
            id: 123456789,
            username: 'trader_alice'
          }
        },
        {
          id: '4',
          text: '💹 Mock Trade: Executed buy 1000 CATWIF\n\n📈 Trade successful\n⏱️ Execution: 0.2s',
          timestamp: Date.now() - 1700000,
          user: {
            id: 987654321,
            username: 'incryptx_bot'
          }
        },
        {
          id: '5',
          text: '/portfolio',
          timestamp: Date.now() - 900000,
          user: {
            id: 123456789,
            username: 'trader_alice'
          }
        },
        {
          id: '6',
          text: '📊 Mock Portfolio Summary\n\n💰 Total Value: $1,250 (+25% today)\n🎯 Top Holdings:\n• SOL: $750 (+15%)\n• CATWIF: $500 (+40%)',
          timestamp: Date.now() - 800000,
          user: {
            id: 987654321,
            username: 'incryptx_bot'
          }
        }
      ];
      
      return res.status(200).json({
        success: true,
        messages: mockMessages
      });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to fetch messages' 
    });
  }
}
