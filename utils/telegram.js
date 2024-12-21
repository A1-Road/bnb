const axios = require('axios');

async function sendTelegramMessage(chatId, text, options = {}) {
  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
        ...options
      }
    );
    console.log('Successfully sent message to Telegram chat:', chatId);
    return response.data;
  } catch (error) {
    console.error('Error sending Telegram message:', error.response?.data || error.message);
    throw error;
  }
}

async function sendStartMessage(chatId) {
  return sendTelegramMessage(chatId, 'ようこそ！下のボタンからミニアプリを起動できます。', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'ミニアプリを開く',
          web_app: {
            url: process.env.TELEGRAM_MINIAPP_URL
          }
        }
      ]]
    }
  });
}

module.exports = {
  sendTelegramMessage,
  sendStartMessage,
};
