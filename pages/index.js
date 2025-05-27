import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { MdSend, MdCancel, MdPerson, MdSportsEsports, MdAutorenew } from 'react-icons/md';

export default function Home() {
  const [name, setName] = useState('');
  const [game, setGame] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // 新しいState: エラーメッセージを保持
  const [loading, setLoading] = useState(false);
  const [animateForm, setAnimateForm] = useState(false);
  const [inputError, setInputError] = useState({ name: false, game: false }); // 新しいState: 入力フィールドごとのエラー

  useEffect(() => {
    // ページロード時にフォーム表示アニメーション
    setAnimateForm(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setErrorMessage(''); // エラーメッセージをリセット
    setInputError({ name: false, game: false }); // 入力エラーをリセット
    setLoading(true);

    let hasClientError = false;
    if (!name.trim()) {
      setInputError(prev => ({ ...prev, name: true }));
      hasClientError = true;
    }
    if (!game.trim()) {
      setInputError(prev => ({ ...prev, game: true }));
      hasClientError = true;
    }

    if (hasClientError) {
      setError(true);
      setErrorMessage('ニックネームと好きなゲームは必須です。');
      setLoading(false);
      return;
    }

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
      setErrorMessage('');
      setName('');
      setGame('');
    } catch (err) {
      console.error('送信エラー:', err);
      setError(true);
      // APIから返された具体的なエラーメッセージを使用
      setErrorMessage(err.message || '送信中にエラーが発生しました。時間をおいて再度お試しください。');

      // エラーメッセージに応じて入力フィールドのエラーをハイライト
      if (err.message.includes('回答を入力してください') || err.message.includes('必須')) {
        if (!name.trim()) setInputError(prev => ({ ...prev, name: true }));
        if (!game.trim()) setInputError(prev => ({ ...prev, game: true }));
      }
      if (err.message.includes('10文字以内')) {
        if (name.length > 10) setInputError(prev => ({ ...prev, name: true }));
        if (game.length > 10) setInputError(prev => ({ ...prev, game: true }));
      }
      if (err.message.includes('リンク')) {
        setInputError({ name: true, game: true }); // 両方エラーにするか、具体的なフィールドを特定
      }

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

      <div className={`container ${animateForm ? 'animate-in' : ''}`}>
        <h1>アンケートフォーム</h1>

        {sent ? (
          <p className="thanks animate-popup">
            <MdSend className="icon send-icon" /> 送信ありがとう！
          </p>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <label>
              <MdPerson className="label-icon" /> ニックネーム
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setInputError(prev => ({ ...prev, name: false })); }}
                required
                disabled={loading}
                className={inputError.name ? 'input-error' : ''} // エラークラスを適用
              />
            </label>

            <label>
              <MdSportsEsports className="label-icon" /> 好きなゲーム
              <input
                type="text"
                value={game}
                onChange={e => { setGame(e.target.value); setInputError(prev => ({ ...prev, game: false })); }}
                required
                disabled={loading}
                className={inputError.game ? 'input-error' : ''} // エラークラスを適用
              />
            </label>

            <button type="submit" disabled={loading} className="animated-button">
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

        {error && errorMessage && ( // エラーメッセージが存在する場合のみ表示
          <p className="error-message">
            <MdCancel className="icon error-icon" /> {errorMessage}
          </p>
        )}
      </div>

      <style jsx>{`
        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          background: linear-gradient(180deg, #87CEEB 0%, #FFFFFF 50%, #FFDAB9 100%); /* 既存の色をベースに */
          background-size: 400% 400%; /* アニメーションのためにサイズを大きく */
          animation: subtleBackgroundShift 20s ease infinite alternate; /* 新しいアニメーション */
          color: #333;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 100vh;
          padding-top: 80px;
          overflow-x: hidden;
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
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out; /* アニメーション調整 */
        }
        .container.animate-in {
          opacity: 1;
          transform: translateY(0);
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
          animation: floatAndGlow 3s ease-in-out infinite alternate; /* 追加 */
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
          position: relative;
          z-index: 0;
        }
        input:focus {
          border-color: #1e90ff;
          box-shadow: 0 0 10px 3px rgba(30, 144, 255, 0.6);
          z-index: 1;
        }
        /* inputがフォーカスされた時のアイコンの反応 */
        label:focus-within .label-icon {
            animation: none; /* 通常アニメーションを停止 */
            transform: translateY(-2px) scale(1.1);
            color: #007bff; /* フォーカス時に少し色を変えるなど */
            transition: transform 0.2s ease, color 0.2s ease;
        }

        /* 入力エラー時のスタイル */
        .input-error {
          border-color: #dc3545; /* 赤いボーダー */
          box-shadow: 0 0 8px 2px rgba(220, 53, 69, 0.5); /* 赤いシャドウ */
          animation: inputShake 0.3s ease; /* 揺れるアニメーション */
        }

        button {
          width: 100%;
          padding: 0.9rem;
          background: linear-gradient(270deg, #1e90ff, #0055aa, #1e90ff);
          background-size: 600% 600%;
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
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        button:hover:not(:disabled) {
          animation: bgGradientShiftHover 4s ease infinite; /* アニメーション速度調整 */
          transform: scale(1.07);
          box-shadow: 0 8px 25px rgba(30, 144, 255, 0.7);
        }
        button:active:not(:disabled) {
          transform: scale(0.95);
          box-shadow: 0 2px 10px rgba(30, 144, 255, 0.3);
        }
        button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
          animation: none;
          background: linear-gradient(45deg, #a0a0a0, #c0c0c0);
          box-shadow: none;
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
          opacity: 0;
          transform: scale(0.7);
          animation: popupScaleFade 0.6s forwards;
        }
        .animate-popup {
          opacity: 1 !important;
          transform: scale(1) !important;
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
          animation: shake 0.3s ease;
        }
        .icon {
          font-size: 1.4rem;
        }
        .send-icon {
          color: #28a745;
          animation: flyAway 1s forwards cubic-bezier(0.25, 0.46, 0.45, 0.94); /* 追加 */
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

        /* アニメーションキー */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        /* 新しい背景アニメーション */
        @keyframes subtleBackgroundShift {
          0% { background-position: 0% 0%; }
          25% { background-position: 100% 0%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
          100% { background-position: 0% 0%; }
        }
        @keyframes bgGradientShiftHover {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes popupScaleFade {
          0% { opacity: 0; transform: scale(0.7); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        /* 新しいアイコンアニメーション */
        @keyframes floatAndGlow {
          0% { transform: translateY(0px) scale(1); opacity: 1; }
          50% { transform: translateY(-3px) scale(1.05); opacity: 0.95; }
          100% { transform: translateY(0px) scale(1); opacity: 1; }
        }
        /* 新しい送信アイコンアニメーション */
        @keyframes flyAway {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
          50% { transform: translate(50px, -30px) rotate(20deg) scale(0.8); opacity: 0.8; }
          100% { transform: translate(150px, -100px) rotate(45deg) scale(0); opacity: 0; }
        }
        /* 入力エラー時の揺れるアニメーション */
        @keyframes inputShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          50% { transform: translateX(3px); }
          75% { transform: translateX(-3px); }
        }
      `}</style>
    </>
  );
}
