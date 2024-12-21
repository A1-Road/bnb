const axios = require('axios');

async function sendLineMessage(userId, text) {
  try {
    await axios.post(
      'https://api.line.me/v2/bot/message/push',
      {
        to: userId,
        messages: [{ type: 'text', text }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
        },
      }
    );
    console.log('Successfully sent message to LINE user:', userId);
  } catch (error) {
    console.error('Error sending LINE message:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  sendLineMessage,
};
