// pages/api/submit.js

export default async function handler(req, res) {
  // HTTPメソッドがPOST以外の場合はエラーを返す
  if (req.method !== "POST") {
    return res.status(405).json({ message: "許可されていないメソッドです" });
  }

  // リクエストボディからニックネームと好きなゲームを取得
  const { name, game } = req.body || {};

  // 必須項目が入力されていない場合はエラーを返す
  if (!name || !game) {
    return res.status(400).json({ message: "ニックネームと好きなゲームの両方を入力してください。" });
  }

  // Discord WebhookのURLを環境変数から取得
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  // Webhook URLが設定されていない場合はサーバーエラーを返す
  if (!webhookUrl) {
    console.error("DISCORD_WEBHOOK_URLが環境変数に設定されていません。");
    // ここを更新しました
    return res.status(500).json({
      message: "サーバー設定エラーが発生しました。管理者にお問い合わせください: https://otoiawase-gon.vercel.app/contact"
    });
  }

  // Discordに送信するペイロードを準備
  const discordPayload = {
    content: `新しいアンケート回答が届きました！\n\n**ニックネーム**: ${name}\n**好きなゲーム**: ${game}`,
  };

  try {
    // Discord Webhookにデータを送信
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discordPayload),
    });

    // Discordからのレスポンスが成功（2xx系、またはDiscord特有の204 No Content）でなければエラーをスロー
    if (!response.ok && response.status !== 204) {
      const errorText = await response.text(); // Discordからのエラー詳細を取得
      console.error(`Discord Webhookからのエラー: ${response.status} - ${errorText}`);
      throw new Error("Discordへのメッセージ送信に失敗しました。");
    }

    // 成功レスポンスを返す
    res.status(200).json({ message: "アンケート回答を送信しました！" });
  } catch (error) {
    // 送信中にエラーが発生した場合
    console.error("アンケート回答の送信中にエラーが発生しました:", error);
    res.status(500).json({ message: "回答の送信中に予期せぬエラーが発生しました。時間を置いて再度お試しください。" });
  }
}
