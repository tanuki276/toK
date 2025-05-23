// pages/index.js
import { useState } from 'react';

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
    <div style={{
      maxWidth: '400px',
      margin: '2rem auto',
      padding: '1.5rem',
      border: '1px solid #ccc',
      borderRadius: '8px',
      fontFamily: 'sans-serif'
    }}>
      <h1>アンケート</h1>
      {sent ? (
        <p>送信ありがとう！</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            ニックネーム<br />
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', margin: '8px 0' }}
            />
          </label>
          <br />
          <label>
            好きなゲーム<br />
            <input
              type="text"
              value={game}
              onChange={e => setGame(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', margin: '8px 0' }}
            />
          </label>
          <br />
          <button
            type="submit"
            style={{
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              marginTop: '8px'
            }}
          >
            送信
          </button>
        </form>
      )}
    </div>
  );
}