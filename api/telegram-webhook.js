const { sendLineMessage } = require('../utils/line');
const { sendStartMessage } = require('../utils/telegram');
const firestoreClient = require('../utils/firestore');
require('dotenv').config();

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send('Method not allowed');
    }

    const { message, web_app_data } = req.body;

    // ミニアプリからのデータ処理
    if (web_app_data) {
      const { button_text, data } = web_app_data;
      const chatId = message.chat.id.toString();
      const username = message.from.username || 'Unknown';
      
      try {
        const parsedData = JSON.parse(data);
        
        // Save user and message to Firestore
        await firestoreClient.saveUser('Telegram', chatId, username);
        const messageId = await firestoreClient.saveMessage('Telegram', chatId, parsedData.message || data);

        // Get latest LINE user for forwarding
        const latestLineUser = await firestoreClient.getLatestUser('LINE');
        const lineUserId = latestLineUser ? latestLineUser.userId : process.env.DEFAULT_LINE_USER_ID;

        // LINEに転送
        const formattedMessage = `[Telegram MiniApp]\nFrom: @${username}\nAction: ${button_text}\nMessage: ${parsedData.message || data}\nID: ${messageId}`;
        await sendLineMessage(lineUserId, formattedMessage);

        console.log('Successfully processed Telegram MiniApp data:', {
          chatId,
          messageId,
          platform: 'Telegram',
          action: button_text
        });
      } catch (parseError) {
        console.error('Error parsing web_app_data:', parseError);
      }
    }
    // 通常のメッセージ処理
    else if (message && message.text) {
      const chatId = message.chat.id.toString();
      const text = message.text;
      const username = message.from.username || 'Unknown';

      // Save user to Firestore (even for /start command)
      await firestoreClient.saveUser('Telegram', chatId, username);

      // /startコマンドの処理
      if (text === '/start') {
        await sendStartMessage(chatId);
        return res.status(200).json({ status: 'ok' });
      }

      // 通常のメッセージをFirestoreに保存
      const messageId = await firestoreClient.saveMessage('Telegram', chatId, text);

      // Get latest LINE user for forwarding
      const latestLineUser = await firestoreClient.getLatestUser('LINE');
      const lineUserId = latestLineUser ? latestLineUser.userId : process.env.DEFAULT_LINE_USER_ID;

      // LINEに転送
      const formattedMessage = `[Telegram Message]\nFrom: @${username}\nMessage: ${text}\nID: ${messageId}`;
      await sendLineMessage(lineUserId, formattedMessage);

      console.log('Successfully processed Telegram message:', {
        chatId,
        messageId,
        platform: 'Telegram'
      });
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing Telegram webhook:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
