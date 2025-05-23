export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, game } = req.body || {};

  if (!name || !game) {
    return res.status(400).json({ message: "回答を入力してください！" });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  const discordPayload = {
    content: `新しいアンケート回答！\nニックネーム: ${name}\n好きなゲーム: ${game}`,
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discordPayload),
    });

    res.status(200).json({ message: "送信しました！" });
  } catch (error) {
    console.error("送信エラー:", error);
    res.status(500).json({ message: "送信に失敗しました" });
  }
}
