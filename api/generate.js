// api/generate.js

export default async function handler(req, res) {
  // 1. Enable CORS (Optional: allows access from other domains if needed)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle pre-flight check for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 2. Ensure the method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 3. Get the message from the frontend
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // 4. Call the Gemini API *SERVER-SIDE*
    // Note: We use process.env.GEMINI_API_KEY here. The browser CANNOT see this.
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();

    // 5. Send the Google response back to your Frontend
    res.status(200).json(data);

  } catch (error) {
    console.error('Error calling Gemini:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}