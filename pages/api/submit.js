export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "許可されていないメソッドです。" });
  }

  const { name, game } = req.body || {};

  // 必須チェック
  if (!name || !game) {
    return res.status(400).json({ message: "回答を入力してください！" });
  }

  // 10文字制限チェック
  if (name.length > 10 || game.length > 10) {
    return res.status(400).json({ message: "名前とゲームは10文字以内で入力してください。" });
  }

  // URLリンク禁止チェック（名前・ゲーム名にhttpやhttpsが入ってたら拒否）
  const urlPattern = /(https?:\/\/|www\.)/i;
  if (urlPattern.test(name) || urlPattern.test(game)) {
    return res.status(400).json({ message: "リンクの送信は禁止されています。" });
  }

  // Discord Webhook URLを環境変数から取得
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[ERROR] DISCORD_WEBHOOK_URLが未設定です。");
    return res.status(500).json({
      message:
        "問題があるようです、ここから連絡してください: https://otoiawase-gon.vercel.app/contact",
    });
  }

  const discordPayload = {
    content: ` 新しいアンケート回答が届きました！ \n\n**ニックネーム**: ${name}\n**好きなゲーム**: ${game}`,
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(discordPayload),
    });

    if (!response.ok && response.status !== 204) {
      const errorText = await response.text();
      console.error(`[ERROR] Discord Webhookエラー: ${response.status} - ${errorText}`);
      throw new Error("Discordへのメッセージ送信に失敗しました。");
    }

    res.status(200).json({ message: "アンケート回答を正常に送信しました！" });
  } catch (error) {
    console.error("[ERROR] アンケート回答送信中の例外:", error);
    res.status(500).json({
      message: "送信中にエラーが発生しました。時間をおいて再度お試しください。",
    });
  }
}