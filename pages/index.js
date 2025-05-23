import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [game, setGame] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, game }),
    });
    const data = await res.json();
    setMsg(data.message);
    setName("");
    setGame("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>ニックネーム：</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>好きなゲーム：</label>
        <input value={game} onChange={(e) => setGame(e.target.value)} required />
      </div>
      <button type="submit">送信</button>
      <p>{msg}</p>
    </form>
  );
}