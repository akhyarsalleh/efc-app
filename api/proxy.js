// api/proxy.js
// Vercel Serverless Function to proxy digital license fetches and bypass CORS blocks

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any frontend to fetch. You can limit this to your domain for security.
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Retrieve the target license URL from query parameters
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing required "url" parameter.' });
  }

  try {
    const decodedUrl = decodeURIComponent(url);

    // Basic safety validation (ensure it is a valid HTTP/HTTPS URL)
    if (!decodedUrl.startsWith('http://') && !decodedUrl.startsWith('https://')) {
      return res.status(400).json({ error: 'Invalid URL scheme. Must use http:// or https://' });
    }

    // Fetch the license page content
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Failed to fetch target digital license: ${response.statusText}`,
        status: response.status 
      });
    }

    const html = await response.text();

    // Respond with the fetched HTML
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);

  } catch (error) {
    console.error('Proxy request failure:', error);
    return res.status(500).json({ 
      error: 'Failed to retrieve digital license from remote server', 
      details: error.message 
    });
  }
}
