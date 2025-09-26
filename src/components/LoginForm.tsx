import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Utility for hashing password using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

enum Step {
  USERNAME,
  SECURE_WORD,
  PASSWORD,
  MFA,
  SUCCESS,
}

const LoginForm: React.FC = () => {
  const [step, setStep] = useState<Step>(Step.USERNAME);
  const [username, setUsername] = useState('');
  const [secureWord, setSecureWord] = useState('');
  const [issuedAt, setIssuedAt] = useState<number | null>(null);
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Timer for secure word expiration
  const [timeLeft, setTimeLeft] = useState(60);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    if (step === Step.SECURE_WORD) {
      setTimeLeft(60);
      const interval = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(interval);
            setError('Secure word expired. Please request again.');
            setStep(Step.USERNAME);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/getSecureWord', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error getting secure word.');
      setSecureWord(data.secureWord);
      setIssuedAt(data.issuedAt);
      setStep(Step.SECURE_WORD);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    if (issuedAt === null) {
      setError('Secure word issuedAt is missing. Please try again.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const hashedPassword = await hashPassword(password);
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, hashedPassword, secureWord, issuedAt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed.');
      localStorage.setItem('token', data.token);
      setStep(Step.MFA);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaCode) {
      setError('Please enter the MFA code.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/verifyMfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, code: mfaCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'MFA verification failed.');
      setStep(Step.SUCCESS);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === Step.SUCCESS) {
    return <p>Login successful! Redirecting to dashboard...</p>;
  }

  return (
    <div>
      {step === Step.USERNAME && (
        <form onSubmit={handleUsernameSubmit} className="login-card">
          <h2 className="login-title">Login</h2>
          <input
            type="text"
            required
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <button type="submit" disabled={loading} className="secure-word-btn">
            Get Secure Word
          </button>
        </form>
      )}

      {step === Step.SECURE_WORD && (
        <div className="login-card">
          <p><strong>Your secure word:</strong> {secureWord}</p>
          <p>Expires in: {timeLeft} seconds</p>
          <button onClick={() => setStep(Step.PASSWORD)}>Next</button>
        </div>
      )}

      {step === Step.PASSWORD && (
        <form onSubmit={handlePasswordSubmit} className="login-card">
          <h2>Enter Password</h2>
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <button type="submit" disabled={loading}>Login</button>
        </form>
      )}

      {step === Step.MFA && (
        <form onSubmit={handleMfaSubmit} className="login-card">
          <h2>MFA</h2>
          <input
            type="text"
            required
            maxLength={6}
            placeholder="6-digit MFA code"
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <button type="submit" disabled={loading}>Verify</button>
        </form>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <style jsx>{`
        .login-card {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          max-width: 320px;
          padding: 24px;
          margin: 3rem auto;
          border: 1px solid #ddd;
          border-radius: 10px;
          box-shadow: 0 0 10px #ccc;
          background-color: #fff;
        }
        .login-card input {
          width: 100%;
          padding: 12px 16px;
          font-size: 18px;
          border: 1px solid #aaa;
          border-radius: 5px;
          margin-bottom: 6px;
        }
        .login-title {
          margin: 0 0 14px 0;
          font-size: 22px;
          font-weight: bold;
          color: #333;
        }
        .secure-word-btn {
          width: 100%;
          background-color: #1976d2;
          color: white;
          border: none;
          padding: 12px;
          font-size: 16px;
          border-radius: 5px;
          cursor: pointer;
        }
        .secure-word-btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        button {
          background-color: #1976d2;
          color: white;
          border: none;
          padding: 12px 16px;
          font-size: 16px;
          border-radius: 5px;
          cursor: pointer;
        }
        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        h2 {
          color: #222;
          margin-bottom: 24px;
        }
      `}</style>
    </div>
  );
};

export default LoginForm;
