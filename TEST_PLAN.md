# Test Plan

## Unit Tests

- CategoryClassifier
  -交通費分類
  - 食費分類
  - 手動修正メモリ優先
- QRCodePaymentParser
  - PayPay通知文の金額抽出
  - 店舗名抽出
  - 店舗名なしのフォールバック
- DuplicateDetector
  - 5分以内の同一決済を重複判定
  - 金額違いは別取引
  - 店舗違いは別取引
- SecureBackupService
  - 正しいパスフレーズで復元
  - 間違ったパスフレーズで復元失敗

## Manual Device Tests

### Launch and Persistence

- 初回起動でクラッシュしない
- デモデータが表示される
- 取引追加後にアプリを終了して再起動しても残る
- すべて削除で端末内データが消える

### Wallet Shortcut Intake

- URL Scheme:
  - `autoledger://transaction?provider=QUICPay&merchant=コンビニ&amount=680`
  - アプリが開く
  - 取引が追加される
- App Intents:
  - Shortcutsに「Auto Ledgerに支払いを追加」が表示される
  - 金額、店舗、決済手段を渡せる
  - ロック中/支払い直後の挙動を実機で確認する

### QR Assist

- PayPay通知文から金額を抽出
- 店舗ラベルありで店舗名を抽出
- 店舗ラベルなしなら確認待ちになる

### CSV Import

- サンプルCSVを取り込める
- カテゴリ指定ありなら反映される
- 不正行を無視できる

### Category Learning

- カテゴリを手動変更できる
- 同じ店舗の次回分類に反映される

### Privacy

- 機内モードで基本機能が使える
- 外部通信なしで主要機能が完結する
- データ削除後に復元されない

## TestFlight Beta Criteria

- 実機でWallet Shortcut URL Schemeが動く
- 取引保存/復元でクラッシュしない
- App Review用デモモードが使える
- Privacy Policy URLが用意済み
- App Store説明文が直接連携を誤認させない
