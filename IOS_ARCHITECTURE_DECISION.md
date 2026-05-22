# iOS Architecture Decision

## Decision

v1はSwiftUIネイティブアプリとして作る。

## Why

- App Storeリリースに最も素直
- iOSショートカット/App Intentsと相性が良い
- Keychain、CryptoKit、ローカルDBなどプライバシー重視の実装がしやすい
- Wallet取引トリガーから渡されたデータを受け取る導線を作りやすい

## Build Constraint

ユーザーはMacを使っていないため、WindowsだけではApp Store提出用のXcode archiveを作れない。

## Recommended Build Path

### Phase 1: Windowsで仕様とUIを固める

- 現在のブラウザプロトタイプをMVP仕様の確認用として使う
- SwiftUIへ移す画面、データモデル、分類ルールを固める
- プライバシーポリシーと審査説明を作る

### Phase 2: Mac環境を確保する

どれかを選ぶ。

- 一時的にMacを借りる
- 中古Mac miniを用意する
- Macクラウドを使う
- Apple Developer Program登録後にXcode Cloudを使う

### Phase 3: SwiftUI実装

- Xcodeプロジェクト作成
- SwiftData/SQLiteでローカル保存
- CryptoKitで暗号化
- Keychainで鍵保護
- App IntentsまたはURL Schemeでショートカット入力を受け取る
- TestFlightで実機確認

## App Modules

- `Transaction`
  - 取引モデル
  - CRUD
  - 重複判定

- `CategoryClassifier`
  - 店舗名ルール分類
  - 手動修正の学習

- `ShortcutIntake`
  - ショートカットからの入力
  - JSON/パラメータ検証

- `Import`
  - QR通知文パース
  - CSVインポート

- `SecureStore`
  - 端末内保存
  - 暗号化バックアップ
  - 復元

- `Settings`
  - データ削除
  - プライバシー表示
  - ショートカット設定ガイド

## First Native Implementation Target

最初に作るSwiftUI画面:

- ホーム画面
- 取引追加/編集画面
- カテゴリ別集計
- インポート画面
- 設定画面

最初に作るロジック:

- `LedgerTransaction` model
- `CategoryClassifier`
- `DuplicateDetector`
- `QRCodePaymentParser`

## Open Questions

- Apple Developer Program登録を個人名義で行うか、事業者名義で行うか
- Mac環境をどう確保するか
- v1を無料にするか、有料/サブスクにするか
- 同期なしでリリースするか、暗号化バックアップだけ入れるか
