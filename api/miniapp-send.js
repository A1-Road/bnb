import { sendMessage } from '../utils/telegram';
import { addMessage } from '../utils/firestore';
import crypto from 'crypto';

// Telegram Mini Appの認証データを検証する関数
function validateInitData(initData) {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');
  
  // パラメータをソートしてdata_checkstringを作成
  const dataCheckString = Array.from(urlParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  // HMACを計算
  const secretKey = crypto.createHmac('sha256', 'WebAppData')
    .update(process.env.TELEGRAM_BOT_TOKEN)
    .digest();
  
  const calculatedHash = crypto.createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  return calculatedHash === hash;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { initData, message } = req.body;

    // initDataの検証
    if (!validateInitData(initData)) {
      return res.status(401).json({ error: 'Invalid authentication data' });
    }

    // ユーザー情報の取得
    const urlParams = new URLSearchParams(initData);
    const user = JSON.parse(urlParams.get('user'));

    // メッセージの処理
    const chatId = user.id.toString();
    await sendMessage(chatId, message);

    // Firestoreにメッセージを保存
    await addMessage({
      platform: 'telegram',
      userId: chatId,
      message: message,
      timestamp: new Date(),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in miniapp-send:', error);
    return res.status(500).json({ error: error.message });
  }
}
