import type { NextApiRequest, NextApiResponse } from 'next';

// Store MFA codes and attempts per user (in-memory)
const mfaStore = new Map<
  string,
  { code: string; attempts: number; locked: boolean }
>();

// Mock TOTP code generator (simulate)
function generateMfaCode(): string {
  return '123456'; // static code for demo
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { username, code } = req.body;

  if (!username || !code) {
    res.status(400).json({ error: 'Missing username or code' });
    return;
  }

  let userData = mfaStore.get(username);

  // If no record, create one with new code and zero attempts
  if (!userData) {
    userData = { code: generateMfaCode(), attempts: 0, locked: false };
    mfaStore.set(username, userData);
  }

  if (userData.locked) {
    res.status(403).json({ error: 'Account locked due to too many failed attempts' });
    return;
  }

  if (code === userData.code) {
    // Success, reset attempts and return success
    userData.attempts = 0;
    res.status(200).json({ success: true });
    return;
  } else {
    userData.attempts += 1;
    if (userData.attempts >= 3) {
      userData.locked = true;
      res.status(403).json({ error: 'Account locked due to too many failed attempts' });
    } else {
      res.status(401).json({ error: 'Invalid MFA code' });
    }
  }
}
