# App Store Submission Draft

## App Name

Auto Ledger

## Subtitle

タッチ決済を家計簿へ

## Promotional Text

Apple Walletのタッチ決済をショートカット経由で記録し、PayPayなどQR決済は通知文やCSVから半自動入力できます。

## Description

Auto Ledgerは、支払い後の家計簿入力忘れを減らすためのローカル優先家計簿アプリです。

Apple Walletを通るQUICPay、iD、Suica、PASMOなどのタッチ決済は、iOSショートカットの取引トリガーから金額、店舗名、決済手段を受け取り、家計簿に登録できます。

PayPayなどのQRコード決済は、通知文、レシート文、CSV明細から金額や店舗名の候補を作成し、少ない手間で登録できます。

主な機能:

- Wallet取引トリガーからの支払い登録
- QR決済通知文からの半自動入力
- CSV明細インポート
- 店舗名に基づくカテゴリ自動分類
- カテゴリの手動修正と学習
- 月別、カテゴリ別の集計
- 端末内保存
- 暗号化バックアップ

プライバシー:

支払い履歴には生活に近い情報が含まれます。Auto Ledger v1は、取引明細を開発者サーバーへ送信せず、端末内で保存・分類する設計です。

注意:

PayPayなど各社QR決済アプリの個人支払い履歴を直接取得するアプリではありません。QR決済は通知文、レシート、CSVなどユーザーが提供した情報から半自動入力します。

## Keywords

家計簿,支出管理,Apple Pay,Suica,QUICPay,iD,PayPay,ショートカット,節約,レシート

## Review Notes

This app does not directly access PayPay or other payment app private transaction histories. Wallet transactions are recorded through user-configured iOS Shortcuts transaction triggers or through the app's demo/manual import screens.

Reviewer demo steps:

1. Launch the app.
2. Demo transactions appear on the Home screen.
3. Open Import.
4. Tap "Wallet取引を受信" to simulate a Shortcuts Wallet transaction.
5. Tap "通知文から候補を作る" to parse a QR payment notification.
6. Tap "CSVを取り込む" to import sample rows.
7. Return to Home and edit a category from the transaction row.
8. Open Settings to see privacy and Shortcut setup information.

No login is required.

## Privacy Nutrition Label Draft

Data collected by developer: None in v1, if no analytics SDK or server sync is added.

Data stored on device but not collected:

- Purchases or financial info entered by the user
- User content such as transaction memo
- Identifiers generated locally for transactions

Tracking: No.

Third-party advertising: No.
