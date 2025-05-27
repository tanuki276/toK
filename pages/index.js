import React, { useState } from 'react';
import Head from 'next/head';
import { MdSend, MdCancel, MdPerson, MdSportsEsports, MdAutorenew } from 'react-icons/md';

export default function Home() {
  const [name, setName] = useState('');
  const [game, setGame] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

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
            <MdSend className="icon send-icon" /> 送信ありがとう！
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              <MdPerson className="label-icon" /> ニックネーム
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                disabled={loading}
              />
            </label>

            <label>
              <MdSportsEsports className="label-icon" /> 好きなゲーム
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
                  <MdAutorenew className="button-icon spinning" /> 送信中...
                </>
              ) : (
                <>
                  <MdSend className="button-icon" /> 送信
                </>
              )}
            </button>
          </form>
        )}

        {error && (
          <p className="error-message">
            <MdCancel className="icon error-icon" /> 送信に失敗しました。入力内容を確認し、もう一度お試しください。
          </p>
        )}
      </div>

      <style jsx>{`
        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          background: linear-gradient(180deg, #87CEEB 0%, #FFFFFF 60%, #FFDAB9 100%);
          color: #333;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 100vh;
          padding-top: 80px;
        }
        .container {
          max-width: 420px;
          width: 90%;
          background: rgba(255, 255, 255, 0.9);
          padding: 2.5rem;
          border-radius: 16px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(100, 150, 250, 0.2);
          color: #333;
        }
        h1 {
          font-size: 1.8rem;
          margin-bottom: 2rem;
          text-align: center;
          color: #1e90ff;
          text-shadow: 0 0 6px rgba(30, 144, 255, 0.5);
        }
        label {
          display: flex;
          align-items: center;
          margin-bottom: 1.2rem;
          font-weight: 500;
          color: #555;
          font-size: 0.95rem;
          gap: 0.6rem;
        }
        .label-icon {
          font-size: 1.2rem;
          color: #1e90ff;
          flex-shrink: 0;
        }
        input {
          flex-grow: 1;
          padding: 0.8rem 0.75rem;
          margin-left: 0.4rem;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(30, 144, 255, 0.5);
          border-radius: 10px;
          outline: none;
          color: #333;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        input:focus {
          border-color: #1e90ff;
          box-shadow: 0 0 0 3px rgba(30, 144, 255, 0.3);
        }
        button {
          width: 100%;
          padding: 0.9rem;
          background: linear-gradient(45deg, #1e90ff, #0055aa);
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
          box-shadow: 0 4px 15px rgba(30, 144, 255, 0.4);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(30, 144, 255, 0.6);
        }
        button:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 10px rgba(30, 144, 255, 0.3);
        }
        button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }
        .thanks {
          text-align: center;
          font-size: 1.2rem;
          color: #28a745;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          padding-top: 1rem;
        }
        .error-message {
          text-align: center;
          font-size: 1rem;
          color: #dc3545;
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
          color: #28a745;
        }
        .error-icon {
          color: #dc3545;
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