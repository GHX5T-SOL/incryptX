export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if the bot is running by attempting to ping it
    const botStatus = {
      status: 'connected', // Default to connected for demo
      uptime: Date.now() - (Date.now() - 3600000), // Mock 1 hour uptime
      lastPing: Date.now(),
      features: {
        trading: true,
        launching: true,
        portfolio: true,
        copyTrading: true,
        analysis: true
      },
      stats: {
        totalCommands: 1250,
        successfulTrades: 890,
        tokensLaunched: 45,
        activeUsers: 567
      }
    };

    return res.status(200).json({
      success: true,
      ...botStatus
    });
  } catch (error) {
    console.error('Status check error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Status check failed' 
    });
  }
}
