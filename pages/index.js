import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [name, setName] = useState('');
  const [game, setGame] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, game }),
    });
    setSent(true);
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
          <p className="thanks">送信ありがとう！</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              ニックネーム
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </label>

            <label>
              好きなゲーム
              <input
                type="text"
                value={game}
                onChange={e => setGame(e.target.value)}
                required
              />
            </label>

            <button type="submit">送信</button>
          </form>
        )}
      </div>

      <style jsx>{`
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', sans-serif;
          background: #f7f8fa;
        }

        .container {
          max-width: 400px;
          margin: 5vh auto;
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
        }

        h1 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        label {
          display: block;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        input {
          width: 100%;
          padding: 0.75rem;
          margin-top: 0.25rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.2s;
        }

        input:focus {
          border-color: #0070f3;
        }

        button {
          width: 100%;
          padding: 0.8rem;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s;
        }

        button:hover {
          background: #0059c1;
        }

        .thanks {
          text-align: center;
          font-size: 1.1rem;
          color: #10b981;
        }
      `}</style>
    </>
  );
}