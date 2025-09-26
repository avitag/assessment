import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const SECURE_WORD_EXPIRY_MS = 60000; // 60 seconds
const SECRET = 'supersecretkey'; // same secret as getSecureWord

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let { username, hashedPassword, secureWord, issuedAt } = req.body;

  console.log('Login attempt:', { username, secureWord, issuedAt });
  if (!username || !hashedPassword || !secureWord || !issuedAt) {
    res.status(400).json({ error: 'Missing fields' });
    return;
  }

  username = username.trim().toLowerCase();
  secureWord = secureWord.toUpperCase();

  // Parse issuedAt to a number safely
  const issuedAtNumber = Number(issuedAt);
  if (isNaN(issuedAtNumber)) {
    res.status(400).json({ error: 'Invalid issuedAt timestamp' });
    return;
  }

  // Check expiration
  if (Date.now() - issuedAtNumber > SECURE_WORD_EXPIRY_MS) {
    res.status(400).json({ error: 'Secure word expired' });
    return;
  }

  // Recompute secure word on server for validation
  const hmac = crypto.createHmac('sha256', SECRET);
  hmac.update(username + issuedAtNumber.toString());
  const expectedSecureWord = hmac.digest('hex').slice(0, 10).toUpperCase();

  if (expectedSecureWord !== secureWord) {
    res.status(400).json({ error: 'Invalid secure word' });
    return;
  }

  // In real system, validate hashedPassword here.

  const token = Buffer.from(username + ':' + Date.now()).toString('base64');

  res.status(200).json({ token });
}
