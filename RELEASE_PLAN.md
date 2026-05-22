# Auto Ledger Release Plan

## Goal

Apple Walletを通るタッチ決済はiOSショートカット経由で自動登録し、PayPayなどのQR決済は通知文、レシート、CSVから半自動登録する家計簿アプリとしてリリースする。

## MVP Scope

### Must have

- Wallet取引トリガーからの入力受け取り
- 金額、店舗名、決済手段、日時の登録
- 店舗名ルールによるカテゴリ自動分類
- 明細ごとのカテゴリ手動修正
- 手動修正した店舗のカテゴリ学習
- PayPayなどQR決済向けの通知文/レシート文パース
- CSVインポート
- 重複判定
- 端末内保存
- 端末内暗号化
- プライバシーポリシー
- App Store審査用のデモモード

### Should have

- 月別集計
- カテゴリ別集計
- 検索/フィルタ
- CSVエクスポート
- バックアップ/復元
- ショートカット設定ガイド

### Not in v1

- PayPayアプリの個人履歴を直接読む機能
- 決済アプリの通知をバックグラウンドで無断監視する機能
- 店舗名や明細を外部AIへ送る分類
- サーバー必須の同期
- 銀行API/クレジットカードAPI連携

## Product Positioning

このアプリは「決済サービスに直接ログインして明細を収集するアプリ」ではなく、「ユーザーが許可したiOSショートカット入力とユーザー操作のインポートから家計簿を作るアプリ」として設計する。

App Store説明では、PayPayなど各社アプリから自動で履歴を取得できるような表現を避ける。

## Privacy Design

### Default

- 取引データは端末内に保存する
- 取引データは端末内で暗号化する
- 店舗名、金額、日時、決済手段は個人情報に近いデータとして扱う
- カテゴリ分類は端末内ルールで行う
- ユーザーの明細を外部サーバーへ送らない

### Optional future sync

- 同期は明示的なオプトインにする
- サーバーには暗号化済みデータだけを置く
- サーバー側で店舗名や金額を読めない設計にする
- 分析に使う場合はカテゴリ別合計などの集計データだけに限定する

## Data Model

```json
{
  "id": "uuid",
  "provider": "QUICPay",
  "merchant": "コンビニ 渋谷三丁目",
  "amount": 680,
  "currency": "JPY",
  "category": "食費",
  "source": "wallet_shortcut",
  "occurred_at": "2026-05-22T09:00:00.000Z",
  "created_at": "2026-05-22T09:00:03.000Z",
  "memo": "Wallet取引トリガー"
}
```

## iOS Implementation Direction

### Recommended v1 architecture

- SwiftUI
- SwiftData or SQLite for local persistence
- CryptoKit for encryption
- Keychain for encryption key/passphrase material
- App Intents / Shortcuts support for transaction creation
- URL scheme or app intent action for receiving Shortcut input
- Local category classifier based on rules and user corrections

### Development constraint

App Store submission requires Apple Developer Program membership and a build uploaded through Apple-supported tooling. The user currently does not use a Mac, so the build path needs one of these:

- Use a Mac later for Xcode archive/upload
- Use a cloud Mac service
- Use Xcode Cloud after Apple Developer setup
- Start with a web/PWA prototype, then move to native iOS for release

## App Store Readiness

### Required before submission

- Apple Developer Program enrollment
- App Store Connect app record
- Bundle ID
- App icon
- Screenshots
- Privacy policy URL
- App Privacy details
- Demo account or demo mode
- TestFlight build
- Review notes explaining Shortcut-based import

### Review-sensitive points

- Do not claim direct PayPay personal-history integration
- Do not imply hidden background monitoring of other apps
- Make privacy behavior clear
- Include a working demo mode
- Avoid placeholder content
- Make the app stable on real device

## Milestones

1. Product spec freeze
2. Privacy and storage spec freeze
3. Native iOS project scaffold
4. Local transaction database
5. Category classifier
6. Shortcut intake action
7. QR/CSV import
8. Encrypted backup/restore
9. TestFlight beta
10. App Store submission

## Next Action

Lock the v1 product spec and privacy promise, then choose the implementation path:

- Native SwiftUI iOS app for App Store release
- PWA-first prototype while preparing Apple Developer and Mac/cloud build access

## Macなしプレリリース方針

Macなしで自分だけ使う段階では、PWAとしてHTTPSホスティングし、iPhone Safariからホーム画面に追加する。

PWA版で先に検証すること:

- WalletショートカットからURLを開いて取引追加できるか
- QR決済通知文の半自動入力が生活に耐えるか
- カテゴリ分類ルールが十分か
- 暗号化保存のUXが重すぎないか
- App Store版にする価値があるか
