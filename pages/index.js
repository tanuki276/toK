import React, { useState } from 'react';
import Head from 'next/head';
import { FiSend, FiXCircle, FiUser, FiGamepad, FiLoader } from 'react-icons/fi';

export default function Home() {
  const [name, setName] = useState('');
  const [game, setGame] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false); // 追加：送信中のローディング

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, game }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'フォーム送信に失敗しました。');
      }
      setSent(true);
      setError(false);
      setName('');
      setGame('');
    } catch (err) {
      console.error('送信エラー:', err);
      setError(true);
      setSent(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>アンケート</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="container">
        <h1>アンケートフォーム</h1>

        {sent ? (
          <p className="thanks">
            <FiSend className="icon send-icon" /> 送信ありがとう！
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              <FiUser className="label-icon" /> ニックネーム
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                disabled={loading}
              />
            </label>

            <label>
              <FiGamepad className="label-icon" /> 好きなゲーム
              <input
                type="text"
                value={game}
                onChange={e => setGame(e.target.value)}
                required
                disabled={loading}
              />
            </label>

            <button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <FiLoader className="button-icon spinning" /> 送信中...
                </>
              ) : (
                <>
                  <FiSend className="button-icon" /> 送信
                </>
              )}
            </button>
          </form>
        )}

        {error && (
          <p className="error-message">
            <FiXCircle className="icon error-icon" /> 送信に失敗しました。入力内容を確認し、もう一度お試しください。
          </p>
        )}
      </div>

      <style jsx>{`
        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #000000 0%, #001f4d 100%);
          color: #cfd8dc;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }

        .container {
          max-width: 420px;
          width: 90%;
          background: rgba(20, 30, 50, 0.85);
          padding: 2.5rem;
          border-radius: 16px;
          box-shadow: 0 8px 20px rgba(0, 31, 77, 0.7);
          border: 1px solid rgba(100, 150, 250, 0.2);
        }

        h1 {
          font-size: 1.8rem;
          margin-bottom: 2rem;
          text-align: center;
          color: #58a6ff;
          text-shadow: 0 0 6px rgba(88, 166, 255, 0.7);
        }

        label {
          display: flex;
          align-items: center;
          margin-bottom: 1.2rem;
          font-weight: 500;
          color: #a6b8d7;
          font-size: 0.95rem;
          gap: 0.6rem;
        }

        .label-icon {
          font-size: 1.2rem;
          color: #58a6ff;
          flex-shrink: 0;
        }

        input {
          flex-grow: 1;
          padding: 0.8rem 0.75rem;
          margin-left: 0.4rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(88, 166, 255, 0.4);
          border-radius: 10px;
          outline: none;
          color: #cfd8dc;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        input:focus {
          border-color: #58a6ff;
          box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.3);
        }

        button {
          width: 100%;
          padding: 0.9rem;
          background: linear-gradient(45deg, #003366, #0055aa);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.6rem;
          font-size: 1.05rem;
          box-shadow: 0 4px 15px rgba(0, 85, 170, 0.4);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 85, 170, 0.6);
        }

        button:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 10px rgba(0, 85, 170, 0.3);
        }

        button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .thanks {
          text-align: center;
          font-size: 1.2rem;
          color: #38c172;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          padding-top: 1rem;
        }

        .error-message {
          text-align: center;
          font-size: 1rem;
          color: #e3342f;
          margin-top: 1.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
        }

        .icon {
          font-size: 1.4rem;
        }

        .send-icon {
          color: #38c172;
        }

        .error-icon {
          color: #e3342f;
        }

        .button-icon {
          font-size: 1.1rem;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}