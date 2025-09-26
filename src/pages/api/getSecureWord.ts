import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const SECRET = 'supersecretkey'; 

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let { username } = req.body;
  if (!username || typeof username !== 'string') {
    res.status(400).json({ error: 'Invalid username' });
    return;
  }
  username = username.trim().toLowerCase();

  const now = Date.now();

  const hmac = crypto.createHmac('sha256', SECRET);
  hmac.update(username + now.toString());
  const secureWord = hmac.digest('hex').slice(0, 10).toUpperCase();

  // Return secure word & timestamp to client
  res.status(200).json({ secureWord, issuedAt: now });
}
