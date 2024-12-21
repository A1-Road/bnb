const { Firestore } = require('@google-cloud/firestore');

class FirestoreClient {
  constructor() {
    // Workload Identity Poolが設定されている場合はそちらを使用
    const options = process.env.GOOGLE_WORKLOAD_IDENTITY_POOL_PROVIDER ? {
      projectId: process.env.GOOGLE_PROJECT_ID,
      credentials: {
        type: 'external_account',
        audience: `//iam.googleapis.com/${process.env.GOOGLE_WORKLOAD_IDENTITY_POOL_PROVIDER}`,
        subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
        token_url: 'https://sts.googleapis.com/v1/token',
        service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${process.env.GOOGLE_SERVICE_ACCOUNT}:generateAccessToken`,
        credential_source: {
          url: 'https://vercel.com/api/auth/oidc/token',
          headers: {},
          format: {
            type: 'json',
            subject_token_field_name: 'access_token'
          }
        }
      }
    } : undefined;

    this.firestore = new Firestore(options);
    this.messagesCollection = this.firestore.collection('messages');
    this.usersCollection = this.firestore.collection('users');
  }

  /**
   * メッセージをFirestoreに保存
   * @param {string} platform - メッセージのプラットフォーム (LINE or Telegram)
   * @param {string} userId - 送信者のユーザーID
   * @param {string} message - メッセージ内容
   * @param {Date} [timestamp] - メッセージの送信時刻 (省略時は現在時刻)
   * @returns {Promise<string>} 保存されたドキュメントのID
   */
  async saveMessage(platform, userId, message, timestamp = new Date()) {
    try {
      const docRef = await this.messagesCollection.add({
        platform,
        userId,
        message,
        timestamp,
      });
      console.log('Message saved with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving message to Firestore:', error);
      throw error;
    }
  }

  async getMessages(userId, platform = null, limit = 10) {
    try {
      let query = this.messagesCollection
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc')
        .limit(limit);

      if (platform) {
        query = query.where('platform', '==', platform);
      }

      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching messages from Firestore:', error);
      throw error;
    }
  }

  /**
   * ユーザー情報をFirestoreに保存/更新
   * @param {string} platform - プラットフォーム (LINE or Telegram)
   * @param {string} userId - プラットフォーム固有のユーザーID
   * @param {string|null} username - Telegramの@username (LINEはnull)
   * @returns {Promise<string>} 保存されたドキュメントのID
   */
  async saveUser(platform, userId, username = null) {
    try {
      // ドキュメントID: {platform}_{userId}
      const userRef = this.usersCollection.doc(`${platform}_${userId}`);
      await userRef.set({
        platform,
        userId,
        username,
        lastActive: new Date(), // 最終アクティブ時刻を更新
      }, { merge: true });
      return userRef.id;
    } catch (error) {
      console.error('Error saving user to Firestore:', error);
      throw error;
    }
  }

  /**
   * 指定されたプラットフォームで最後にアクティブだったユーザーを取得
   * @param {string} platform - プラットフォーム (LINE or Telegram)
   * @returns {Promise<{id: string, platform: string, userId: string, username: string|null, lastActive: Date}|null>}
   */
  async getLatestUser(platform) {
    try {
      const snapshot = await this.usersCollection
        .where('platform', '==', platform)
        .orderBy('lastActive', 'desc')
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        platform: data.platform,
        userId: data.userId,
        username: data.username,
        lastActive: data.lastActive.toDate(),
      };
    } catch (error) {
      console.error('Error fetching latest user from Firestore:', error);
      throw error;
    }
  }
}

// Export singleton instance
module.exports = new FirestoreClient();
