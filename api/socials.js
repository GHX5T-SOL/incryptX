const { spawn } = require('child_process');

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, query, content, image, recipient } = req.body;

  // Validate required parameters
  if (!action) {
    return res.status(400).json({ error: 'Action is required' });
  }

  // Execute Python script
  const pythonScript = spawn('python3', ['socials/socials.py', '--action', action]);

  let stdout = '';
  let stderr = '';

  // Handle stdout
  pythonScript.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  // Handle stderr
  pythonScript.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  // Handle close
  pythonScript.on('close', (code) => {
    if (code !== 0) {
      console.error('Python script failed:', stderr);
      return res.status(500).json({
        error: 'Python script execution failed',
        stderr
      });
    }

    try {
      const result = JSON.parse(stdout);
      return res.status(200).json(result);
    } catch (parseError) {
      console.error('Failed to parse Python output:', parseError);
      return res.status(500).json({
        error: 'Failed to parse Python output',
        stdout,
        stderr
      });
    }
  });

  // Handle timeout
  pythonScript.on('error', (error) => {
    console.error('Python script error:', error);
    return res.status(500).json({
      error: 'Python script execution error',
      details: error.message
    });
  });

  // Write input to Python script
  if (action === 'post') {
    const input = JSON.stringify({
      content,
      image,
      recipient
    });
    pythonScript.stdin.write(input);
  } else if (action === 'scan') {
    const input = JSON.stringify({
      query
    });
    pythonScript.stdin.write(input);
  }

  pythonScript.stdin.end();
}
