

LINE-Telegram Bridge POC
An off-chain proof of concept for bridging messages between LINE and Telegram using Firestore for storage. This implementation focuses on creating a minimal viable product using free-tier services.

Features
Bidirectional message forwarding between LINE and Telegram
Message persistence using Firestore
Serverless deployment using Vercel
Webhook-based real-time updates
Telegram Mini App integration for enhanced user experience
UI-based operational interface
Simple button controls
Mobile-friendly design
Prerequisites
LINE Messaging API Account

Create a channel at LINE Developers Console
Get the Channel Access Token and Channel Secret
Telegram Bot

Create a bot using BotFather
Get the Bot Token
Google Cloud Project

Create a new project in Google Cloud Console
Enable Firestore Database:
Select “Firestore Database” from the side menu
Click “Create database”
Choose “Production mode”
Select a location (e.g., asia-northeast1)
Choose one of the following authentication methods:

A) Using a Service Account Key:

Service account setup:
From the side menu, go to “IAM & Admin” → “Service Accounts”
Click “Create Service Account”
Enter a name (e.g., line-telegram-bridge)
Select “Cloud Datastore User” as the role
“Create Key” → select “JSON” to download the key file
Store the downloaded JSON file in a secure place
B) Using a Workload Identity Pool:

Workload Identity Pool setup:
From the side menu, go to “IAM & Admin” → “Workload Identity Pool”
Click “Create Pool”
Enter a pool name (e.g., vercel-pool)
Add a provider:
Provider name: vercel-provider
Select OpenID Connect (OIDC)
Issuer URL: https://oidc.vercel.app
Audience: urn:vercel:deploy
Attribute mapping:
google.subject = assertion.sub
google.project_id = assertion.vercel.project_id
Service account setup:
Create a service account (same steps as in A)
Link with the Workload Identity Pool:
bash
Copy code
gcloud iam service-accounts add-iam-policy-binding "SERVICE_ACCOUNT_EMAIL" \
  --project="PROJECT_ID" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL_ID/subject/VERCEL_PROJECT_ID"
Vercel Account

For deploying the serverless functions
Setup
Clone the repository and install dependencies:

bash
Copy code
npm install
Copy .env.example to .env and fill in your credentials:

bash
Copy code
cp .env.example .env
Configure environment variables in your .env file:

makefile
Copy code
LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
LINE_CHANNEL_SECRET=your_line_channel_secret
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_MINIAPP_URL=https://your-miniapp-url.vercel.app
DEFAULT_LINE_USER_ID=your_default_line_user_id
DEFAULT_TELEGRAM_CHAT_ID=your_default_telegram_chat_id
GOOGLE_APPLICATION_CREDENTIALS=path_to_your_service_account_key.json
Set up Vercel:

bash
Copy code
npm i -g vercel
vercel login
Configure Vercel environment variables:

A) Using a Service Account Key:

bash
Copy code
# Base64-encode the service account key
base64 -i path_to_your_service_account_key.json | tr -d '\n' > google_credentials_base64.txt

# Add environment variable to Vercel
vercel secrets add google_application_credentials "$(cat google_credentials_base64.txt)"
B) Using a Workload Identity Pool:

bash
Copy code
# Add environment variables to Vercel
vercel env add GOOGLE_PROJECT_ID "your_project_id"
vercel env add GOOGLE_SERVICE_ACCOUNT "your_service_account_email"
vercel env add GOOGLE_WORKLOAD_IDENTITY_POOL_PROVIDER "projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL_ID/providers/PROVIDER_ID"
Common environment variables:

bash
Copy code
vercel secrets add line_channel_access_token "your_line_channel_access_token"
vercel secrets add line_channel_secret "your_line_channel_secret"
vercel secrets add telegram_bot_token "your_telegram_bot_token"
vercel secrets add default_line_user_id "your_default_line_user_id"
vercel secrets add default_telegram_chat_id "your_default_telegram_chat_id"
Deploy to Vercel:

bash
Copy code
npm run deploy
Configure webhooks:

LINE: Set webhook URL to https://your-vercel-app.vercel.app/api/line-webhook
Telegram: Set webhook using:
bash
Copy code
curl -F "url=https://your-vercel-app.vercel.app/api/telegram-webhook" \
     https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook
Development
Run the development server:

bash
Copy code
npm run dev
Project Structure
bash
Copy code
├── api/
│   ├── line-webhook.js    # LINE webhook handler
│   └── telegram-webhook.js # Telegram webhook handler (with mini app support)
├── utils/
│   ├── line.js           # LINE messaging utilities
│   ├── telegram.js       # Telegram messaging utilities (with mini app button features)
│   └── firestore.js      # Firestore database operations
├── .env.example          # Environment variables template
├── vercel.json           # Vercel deployment configuration
└── package.json          # Project dependencies and scripts
Firestore Data Structure
Collections
users collection
yaml
Copy code
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
messages collection
sql
Copy code
messages/
└── {messageId}/
    ├── platform: "LINE" | "Telegram"
    ├── userId: "user_id"
    ├── message: "message content"
    └── timestamp: Timestamp
Data Flow
When receiving a message:

A webhook receives the message
Save or update user information in the users collection
Save the message in the messages collection
When forwarding a message:

Retrieve the most recently active user from the users collection
Forward the message to the retrieved user ID
If no recent user is found, use the default IDs in .env
Updating user information:

lastActive is automatically updated when sending messages
Separate user records by platform
Telegram also saves username
How to Use the Telegram Mini App
Starting the Bot

Send the /start command in Telegram
The bot displays a “Open Mini App” button
Launching the Mini App

Tap the displayed button to open the mini app
The UI is shown in the built-in Telegram browser
Sending Data

Use the UI in the mini app to send messages
The sent data is automatically saved to Firestore
Forward to LINE if needed
Security Considerations

The mini app URL must be served over HTTPS
Keep the Telegram Bot token secure
Handle user data with proper caution
Free Tier Limitations
LINE Messaging API: 50,000 messages/month
Telegram Bot API: Unlimited
Firestore:
1GB storage
50,000 reads/day
20,000 writes/day
Vercel:
100GB bandwidth/month
Unlimited serverless function executions
Future Enhancements
On-chain Integration:

Integration with BNB Greenfield for message storage
Smart contract implementation for DID-CID binding
BSC testnet deployment
Additional Features:

Message encryption
Multi-user support
Media message handling
Message history viewing
Mini app feature enhancements:
File upload
Real-time notifications
Custom UI themes
License
ISC













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

## Prerequisites

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

5. Vercelの環境変数を設定:

   A サービスアカウントキーを使用する場合:
   ```bash
   # サービスアカウントキーをbase64エンコード
   base64 -i path_to_your_service_account_key.json | tr -d '\n' > google_credentials_base64.txt
   
   # Vercelに環境変数を設定
   vercel secrets add google_application_credentials "$(cat google_credentials_base64.txt)"
   ```

   B Workload Identity Poolを使用する場合:
   ```bash
   # Vercelに環境変数を設定
   vercel env add GOOGLE_PROJECT_ID "your_project_id"
   vercel env add GOOGLE_SERVICE_ACCOUNT "your_service_account_email"
   vercel env add GOOGLE_WORKLOAD_IDENTITY_POOL_PROVIDER "projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL_ID/providers/PROVIDER_ID"
   ```

   共通の環境変数:
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
│   └── telegram-webhook.js # Telegram webhook handler（ミニアプリ対応）
├── utils/
│   ├── line.js           # LINE messaging utilities
│   ├── telegram.js       # Telegram messaging utilities（ミニアプリボタン機能追加）
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

### データの流れ

1. メッセージ受信時:
   - webhookでメッセージを受信
   - `users`コレクションにユーザー情報を保存/更新
   - `messages`コレクションにメッセージを保存

2. メッセージ転送時:
   - `users`コレクションから最新のアクティブユーザーを取得
   - 取得したユーザーIDに対してメッセージを転送
   - 最新ユーザーが存在しない場合は.envのデフォルトIDを使用

3. ユーザー情報の更新:
   - メッセージ送信時に自動的に`lastActive`を更新
   - プラットフォーム別にユーザー情報を管理
   - Telegramの場合は`username`も保存

## Telegram Mini App の使用方法

1. ボットの起動
   - Telegramで `/start` コマンドを送信
   - ボットが「ミニアプリを開く」ボタンを表示

2. ミニアプリの起動
   - 表示されたボタンをタップしてミニアプリを起動
   - Telegram内蔵ブラウザでUIが表示される

3. データの送信
   - ミニアプリ上のUIを使用してメッセージを送信
   - 送信されたデータは自動的にFirestoreに保存
   - 必要に応じてLINEにも転送

4. セキュリティ注意事項
   - ミニアプリのURLはHTTPS必須
   - Telegram Botのトークンは厳重に管理
   - ユーザーデータの取り扱いには十分注意

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



