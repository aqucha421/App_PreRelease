# iOS Architecture Decision

## Decision

公開版v1はSwiftUIネイティブアプリを目標にする。ただし、Macなしで自分用プレリリースを回す間はPWAを実用版の土台にする。

## Why

- App Storeリリースに最も素直
- iOSショートカット/App Intentsと相性が良い
- Keychain、CryptoKit、ローカルDBなどプライバシー重視の実装がしやすい
- Wallet取引トリガーから渡されたデータを受け取る導線を作りやすい

## Build Constraint

ユーザーはMacを使っていないため、WindowsだけではApp Store提出用のXcode archiveを作れない。

そのため、短期の到達点は次の2段階に分ける。

- Phase A: PWAをGitHub Pagesで公開し、自分のiPhoneでホーム画面追加して使う
- Phase B: Mac環境を確保できた時点で、PWA仕様をSwiftUIへ移植する

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
  - ユーザー定義キーワードルール

- `ShortcutIntake`
  - ショートカットからの入力
  - JSON/パラメータ検証
  - URL Schemeを初期実装、App Intentsを昇格候補にする

- `Import`
  - QR通知文パース
  - CSVインポート

- `SecureStore`
  - 端末内保存
  - 暗号化バックアップ
  - 復元
  - 予算、分類ルール、スポンサー表示設定も保存対象に含める

- `Settings`
  - データ削除
  - プライバシー表示
  - ショートカット設定ガイド
  - 非追跡スポンサー枠の説明

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
- `CategoryBudget`
- `CustomCategoryRule`
- `SecureBackupService`

## Native Parity Requirements

PWA v0.8.1からSwiftUIへ移すとき、最低限そろえる項目:

- QUICPay / iD / Suica / PASMOのショートカット取り込み
- PayPay / 楽天ペイ / d払い / au PAY / メルペイの通知文パース
- 店舗カテゴリ記憶とユーザー定義ルール
- カテゴリ予算と月次レポート
- JSONまたは暗号化バックアップの復元
- データ削除
- 取引明細を開発者サーバーへ送らない設計
- 広告またはスポンサーを入れる場合も、店舗名・金額・メモ・カテゴリ・時刻を広告側に渡さない設計

## Open Questions

- Apple Developer Program登録を個人名義で行うか、事業者名義で行うか
- Mac環境をどう確保するか
- v1を完全無料にするか、任意応援プランを付けるか
- 同期なしでリリースするか、暗号化バックアップだけ入れるか
- ネイティブ版でもスポンサー枠を残すか
