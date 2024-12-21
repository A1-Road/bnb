const { sendTelegramMessage } = require('../utils/telegram');
const firestoreClient = require('../utils/firestore');
require('dotenv').config();

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send('Method not allowed');
    }

    const events = req.body.events;
    
    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const message = event.message.text;
        const userId = event.source.userId;

        // Save user and message to Firestore
        await firestoreClient.saveUser('LINE', userId);
        const messageId = await firestoreClient.saveMessage('LINE', userId, message);

        // Get latest Telegram user for forwarding
        const latestTelegramUser = await firestoreClient.getLatestUser('Telegram');
        const telegramChatId = latestTelegramUser ? latestTelegramUser.userId : process.env.DEFAULT_TELEGRAM_CHAT_ID;

        // Forward to Telegram
        const formattedMessage = `[LINE Message]\nFrom: ${userId}\nMessage: ${message}\nID: ${messageId}`;
        await sendTelegramMessage(telegramChatId, formattedMessage);

        console.log('Successfully processed LINE message:', {
          userId,
          messageId,
          platform: 'LINE'
        });
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing LINE webhook:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
