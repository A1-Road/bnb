





# LINE-Telegram Bridge POC

An off-chain proof of concept for bridging messages between LINE and Telegram using Firestore for storage. This implementation focuses on creating a minimal viable product using free-tier services.

## Features

- Bidirectional message forwarding between LINE and Telegram
- Message persistence using Firestore
- Serverless deployment using Vercel
- Webhook-based real-time updates
- Telegram Mini App integration for enhanced user experience
  - UIベースの操作インターフェース
  - ボタンによる簡単な操作
  - モバイルフレンドリーなデザイン

## Prerequisiteshttps://github.com/A1-Road/bnb/blob/main/README.md

1. LINE Messaging API Account
   - Create a channel at [LINE Developers Console](https://developers.line.biz/)
   - Get the Channel Access Token and Channel Secret

2. Telegram Bot
   - Create a bot using [BotFather](https://t.me/botfather)
   - Get the Bot Token

3. Google Cloud Project
   - [Google Cloud Console](https://console.cloud.google.com/)で新しいプロジェクトを作成
   - Firestore Databaseを有効化:
     1. サイドメニューから「Firestore Database」を選択
     2. 「データベースの作成」をクリック
     3. 「本番環境モード」を選択
     4. ロケーションを選択（例：asia-northeast1）
   
   認証方法は以下のいずれかを選択:

   A サービスアカウントキーを使用する場合:
   - サービスアカウントの設定:
     1. サイドメニューから「IAM と管理」→「サービスアカウント」を選択
     2. 「サービスアカウントを作成」をクリック
     3. 名前を入力（例：line-telegram-bridge）
     4. ロールは「Cloud Datastore ユーザー」を選択
     5. 「キーを作成」→「JSON」を選択してキーファイルをダウンロード
   - ダウンロードしたJSONファイルを安全な場所に保存

   B) Workload Identity Poolを使用する場合:
   - Workload Identity Poolの設定:
     1. サイドメニューから「IAM と管理」→「Workload Identity Pool」を選択
     2. 「プールを作成」をクリック
     3. プール名を入力（例：vercel-pool）
     4. プロバイダーを追加:
        - プロバイダー名: vercel-provider
        - OpenID Connect (OIDC)を選択
        - 発行者URL: https://oidc.vercel.app
        - 対象者: urn:vercel:deploy
     5. 属性マッピング:
        - google.subject = assertion.sub
        - google.project_id = assertion.vercel.project_id
   - サービスアカウントの設定:
     1. サービスアカウントを作成（上記A同様）
     2. Workload Identity Poolとの紐付け:
        ```bash
        gcloud iam service-accounts add-iam-policy-binding "SERVICE_ACCOUNT_EMAIL" \
          --project="PROJECT_ID" \
          --role="roles/iam.workloadIdentityUser" \
          --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL_ID/subject/VERCEL_PROJECT_ID"
        ```

4. Vercel Account
   - For deploying the serverless functions

## Setup

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

3. Configure environment variables in your `.env` file:
   ```
   LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
   LINE_CHANNEL_SECRET=your_line_channel_secret
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   TELEGRAM_MINIAPP_URL=https://your-miniapp-url.vercel.app
   DEFAULT_LINE_USER_ID=your_default_line_user_id
   DEFAULT_TELEGRAM_CHAT_ID=your_default_telegram_chat_id
   GOOGLE_APPLICATION_CREDENTIALS=path_to_your_service_account_key.json
   ```

4. Set up Vercel:
   ```bash
   npm i -g vercel
   vercel login
   ```

5. set environment variable of Vercel:

   A when we use service account key:
   ```bash
   # encode base64 of service account key
   base64 -i path_to_your_service_account_key.json | tr -d '\n' > google_credentials_base64.txt
   
   set # Vercel to environment variable
   vercel secrets add google_application_credentials "$(cat google_credentials_base64.txt)"
   ```

   - B  when we use Workload Identity Pool:
   ```bash
   set environment variable to # Vercel
   vercel env add GOOGLE_PROJECT_ID "your_project_id"
   vercel env add GOOGLE_SERVICE_ACCOUNT "your_service_account_email"
   vercel env add GOOGLE_WORKLOAD_IDENTITY_POOL_PROVIDER "projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL_ID/providers/PROVIDER_ID"
   ```

   common environment variable:
   ```bash
   vercel secrets add line_channel_access_token "your_line_channel_access_token"
   vercel secrets add line_channel_secret "your_line_channel_secret"
   vercel secrets add telegram_bot_token "your_telegram_bot_token"
   vercel secrets add default_line_user_id "your_default_line_user_id"
   vercel secrets add default_telegram_chat_id "your_default_telegram_chat_id"
   ```

6. Deploy to Vercel:
   ```bash
   npm run deploy
   ```

6. Configure webhooks:
   - LINE: Set webhook URL to `https://your-vercel-app.vercel.app/api/line-webhook`
   - Telegram: Set webhook using:
     ```bash
     curl -F "url=https://your-vercel-app.vercel.app/api/telegram-webhook" \
          https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook
     ```

## Development

Run the development server:
```bash
npm run dev
```

## Project Structure

```
├── api/
│   ├── line-webhook.js    # LINE webhook handler
│   └── telegram-webhook.js # Telegram webhook handler（Miniapp agnostic）
├── utils/
│   ├── line.js           # LINE messaging utilities
│   ├── telegram.js       # Telegram messaging utilities（Add miniapp buttion）
│   └── firestore.js      # Firestore database operations
├── .env.example          # Environment variables template
├── vercel.json          # Vercel deployment configuration
└── package.json         # Project dependencies and scripts
```

## Firestore Data Structure

### Collections

1. `users` collection
```
users/
├── LINE_{userId}/
│   ├── platform: "LINE"
│   ├── userId: "U1234..."
│   ├── username: null
│   └── lastActive: Timestamp
└── Telegram_{chatId}/
    ├── platform: "Telegram"
    ├── userId: "123456789"
    ├── username: "@username"
    └── lastActive: Timestamp
```

2. `messages` collection
```
messages/
└── {messageId}/
    ├── platform: "LINE" | "Telegram"
    ├── userId: "user_id"
    ├── message: "message content"
    └── timestamp: Timestamp
```

## Data Flow
When Receiving a Message:
- The webhook receives the incoming message.
- Save or update user information in the users collection.
- Save the message in the messages collection.


When Forwarding a Message:
- Retrieve the most recently active user from the users collection.
- Forward the message to the retrieved user ID.
- If no recent user is found, use the default ID specified in .env.


Updating User Information:
- lastActive is automatically updated when sending messages.
- Manage user information separately for each platform.
- For Telegram, also save the username.


## How to Use the Telegram Mini App
Starting the Bot
- Send the /start command in Telegram.
- The bot will display a “Open Mini App” button.

Launching the Mini App
- Tap the displayed button to open the mini app.
- The UI will be shown in Telegram’s built-in browser.


Sending Data
- Use the UI in the mini app to send messages.
- Any data you send is automatically saved to Firestore.

If necessary, the data can also be forwarded to LINE.


## Security Notes

- The mini app URL must use HTTPS.
- Telegram Bot tokens must be strictly safeguarded.
- Handle user data with proper caution.



## Free Tier Limitations

- LINE Messaging API: 50,000 messages/month
- Telegram Bot API: Unlimited
- Firestore: 
  - 1GB storage
  - 50,000 reads/day
  - 20,000 writes/day
- Vercel:
  - 100GB bandwidth/month
  - Unlimited serverless function executions

## Future Enhancements

1. On-chain Integration:
   - Integration with BNB Greenfield for message storage
   - Smart contract implementation for DID-CID binding
   - BSC testnet deployment

2. Additional Features:
   - Message encryption
   - Multi-user support
   - Media message handling
   - Message history viewing
   - ミニアプリの機能拡張
     - ファイルアップロード機能
     - リアルタイム通知
     - カスタムUIテーマ

## License

ISC



