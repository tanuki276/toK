// pages/api/submit.js

export default async function handler(req, res) {
  // POSTメソッド以外は拒否
  if (req.method !== "POST") {
    return res.status(405).json({ message: "許可されていないメソッドです。" });
  }

  // リクエストボディから入力値を取得
  const { name, game } = req.body || {};

  // 必須チェック
  if (!name || !game) {
    return res.status(400).json({ message: "回答を入力してください！" });
  }

  // Discord Webhook URLを環境変数から取得
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  // Webhook URL未設定時のエラーハンドリング
  if (!webhookUrl) {
    console.error("[ERROR] DISCORD_WEBHOOK_URLが未設定です。");
    return res.status(500).json({
      message:
        "問題があるようです、ここから連絡してください: https://otoiawase-gon.vercel.app/contact",
    });
  }

  // Discordへ送信するメッセージ内容
  const discordPayload = {
    content: ` 新しいアンケート回答が届きました！ \n\n**ニックネーム**: ${name}\n**好きなゲーム**: ${game}`,
  };

  try {
    // WebhookへPOST送信
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(discordPayload),
    });

    // Discordが成功応答を返さなかった場合の処理
    if (!response.ok && response.status !== 204) {
      const errorText = await response.text();
      console.error(`[ERROR] Discord Webhookエラー: ${response.status} - ${errorText}`);
      throw new Error("Discordへのメッセージ送信に失敗しました。");
    }

    // 成功レスポンスを返す
    res.status(200).json({ message: "アンケート回答を正常に送信しました！" });
  } catch (error) {
    console.error("[ERROR] アンケート回答送信中の例外:", error);
    res.status(500).json({
      message: "送信中にエラーが発生しました。時間をおいて再度お試しください。",
    });
  }
}