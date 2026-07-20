import { validateGrowthRequest } from '../src/validation.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const contentType = req.headers?.['content-type'] || req.headers?.['Content-Type'] || '';
  if (!contentType.includes('application/json')) {
    res.status(415).json({ error: 'Expected application/json payload.' });
    return;
  }

  let body = req.body;
  if (!body) {
    try {
      const raw = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', (chunk) => {
          data += chunk;
        });
        req.on('end', () => resolve(data));
        req.on('error', reject);
      });
      body = JSON.parse(body || raw || '{}');
    } catch {
      res.status(400).json({ error: 'Invalid JSON payload.' });
      return;
    }
  }

  const { valid, errors } = validateGrowthRequest(body);
  if (!valid) {
    res.status(400).json({ error: 'Validation failed.', errors });
    return;
  }

  res.status(200).json({ message: 'Request received.' });
}
