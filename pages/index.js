import { useState } from 'react';
import Head from 'next/head';
import { FiSend, FiXCircle } from 'react-icons/fi'; // 送信とエラーのアイコンをインポート

export default function Home() {
  const [name, setName] = useState('');
  const [game, setGame] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false); // エラーハンドリングのための新しいstate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false); // 送信前にエラー状態をリセット
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, game }),
      });

      if (!response.ok) {
        // HTTPステータスが2xx以外の場合
        const errorData = await response.json(); // エラーレスポンスを解析
        throw new Error(errorData.message || 'フォーム送信に失敗しました。');
      }
      setSent(true);
      setError(false); // 成功したらエラーをクリア
      setName(''); // フォームをクリア
      setGame(''); // フォームをクリア
    } catch (err) {
      console.error('送信エラー:', err);
      setError(true); // エラー状態をtrueに設定
      setSent(false); // エラー時は送信済みではない
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

            <button type="submit">
              <FiSend className="button-icon" /> 送信
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
          font-family: 'Inter', 'Segoe UI', sans-serif; /* モダンなフォント */
          background: linear-gradient(135deg, #0a192f 0%, #172a45 100%); /* 暗いグラデーション背景 */
          color: #e2e8f0; /* コントラストのための明るいテキスト */
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }

        .container {
          max-width: 420px; /* 少し広げてモダンな感じに */
          width: 90%; /* レスポンシブな幅 */
          background: rgba(255, 255, 255, 0.08); /* 半透明の白 */
          backdrop-filter: blur(10px); /* すりガラス効果 */
          padding: 2.5rem;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4); /* 強く拡散した影 */
          border: 1px solid rgba(255, 255, 255, 0.1); /* 微妙な境界線 */
        }

        h1 {
          font-size: 1.8rem;
          margin-bottom: 2rem;
          text-align: center;
          color: #8be9fd; /* 見出し用のアクアブルー */
          text-shadow: 0 0 10px rgba(139, 233, 253, 0.5);
        }

        label {
          display: block;
          margin-bottom: 1.2rem;
          font-weight: 500;
          color: #a6adbb; /* 少し彩度を落としたテキスト */
          font-size: 0.95rem;
        }

        input {
          width: calc(100% - 1.5rem); /* パディングを考慮して調整 */
          padding: 0.8rem 0.75rem;
          margin-top: 0.4rem;
          background: rgba(255, 255, 255, 0.05); /* 非常に微妙な背景 */
          border: 1px solid rgba(139, 233, 253, 0.3); /* アクア色の境界線 */
          border-radius: 10px;
          outline: none;
          color: #e2e8f0; /* 入力テキストの色 */
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        input:focus {
          border-color: #00bcd4; /* フォーカス時に明るいアクア */
          box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.3); /* グロー効果 */
        }

        button {
          width: 100%;
          padding: 0.9rem;
          background: linear-gradient(45deg, #007bff, #00bcd4); /* 青からアクアへのグラデーション */
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.6rem; /* アイコンとテキストの間隔 */
          font-size: 1.05rem;
          box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
        }

        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
        }

        button:active {
          transform: translateY(0);
          box-shadow: 0 2px 10px rgba(0, 123, 255, 0.2);
        }

        .thanks {
          text-align: center;
          font-size: 1.2rem;
          color: #38c172; /* 成功時の緑色 */
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          padding-top: 1rem;
        }

        .error-message {
          text-align: center;
          font-size: 1rem;
          color: #e3342f; /* エラー時の赤色 */
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
          color: #38c172; /* 送信アイコンの緑色 */
        }

        .error-icon {
          color: #e3342f; /* エラーアイコンの赤色 */
        }

        .button-icon {
            font-size: 1.1rem;
        }
      `}</style>
    </>
  );
}
