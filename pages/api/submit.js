export default function handler(req, res) {
  const { name, game } = req.body || {};

  console.log(`ニックネーム: ${name}, 好きなゲーム: ${game}`);

  res.status(200).json({ message: "ご協力ありがとうございました" });
}
