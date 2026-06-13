# Native Release Sync

PWAで固まった仕様を、将来のSwiftUI版へ移すための同期メモです。

## Current Source Of Truth

短期の実用版はPWAです。

- app version: `v0.8.1`
- local app: `index.html`
- iPhone debugger: `debug-iphone.html`
- public guide: `README.md`
- release checklist: `PUBLIC_PWA_CHECKLIST.md`

## Native v1 Minimum

SwiftUI版で最初にそろえる機能:

- Walletショートカット取り込み
- URL Scheme `autoledger://transaction`
- App Intentsの追加候補
- QR通知文パース
- CSV明細インポート
- 店舗カテゴリ記憶
- ユーザー定義カテゴリルール
- カテゴリ別予算
- 月次レポート
- 暗号化ローカル保存
- 暗号化バックアップ/復元
- データ削除
- ショートカット設定ガイド
- 非追跡スポンサー方針の表示

## Data Fields To Keep Compatible

取引:

- `id`
- `provider`
- `merchant`
- `amount`
- `currency`
- `category`
- `source`
- `occurredAt`
- `createdAt`
- `memo`

保存スナップショット:

- `transactions`
- `merchantCategoryMemory`
- `customCategoryRules`
- `categoryBudgets`
- `settings`
- `duplicateCount`
- `savedAt`

## Privacy Requirements

- 取引明細を開発者サーバーへ送らない
- 外部AIへ店舗名、金額、メモ、カテゴリ、時刻を送らない
- 広告またはスポンサー枠へ明細を渡さない
- 同期機能を入れる場合は明示的なオプトインにする
- 同期データはサーバー側で読めない設計を目指す

## App Store Notes

- PayPayなど外部決済サービスから履歴を直接取得する表現は避ける
- Wallet履歴を直接読む表現も避ける
- 「ユーザーが設定したiOSショートカットから渡された情報を記録する」と説明する
- 無料モデルを説明する場合は、非追跡スポンサー枠として説明する

## Macなし運用

Macがない間は、SwiftUI草案は設計同期までに留める。実機利用はGitHub PagesのPWAで進める。

ネイティブ化に進む条件:

- Mac、クラウドMac、またはXcode Cloudのどれかを使える
- Apple Developer Program登録方針が決まる
- Privacy Policyの正式な問い合わせ先が決まる
