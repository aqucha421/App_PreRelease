# ショートカット設定ガイド

## URL Scheme版

1. iPhoneで「ショートカット」アプリを開く。
2. 「オートメーション」を開く。
3. 新規オートメーションを作る。
4. 「取引」またはWallet関連のトリガーを選ぶ。
5. 対象カード/パスを選ぶ。
6. アクションで「URL」を追加する。
7. URLを以下の形で組み立てる。

```text
autoledger://transaction?provider=QUICPay&merchant=店舗名&amount=680
```

8. `provider`にはカード/パス名、`merchant`には取引の店舗、`amount`には金額を入れる。
9. アクションで「URLを開く」を追加する。
10. 実際に少額決済またはテスト用入力で動作確認する。

## App Intents版

Xcode実装後、ショートカットに「Auto Ledgerに支払いを追加」が表示される想定。

1. Wallet取引トリガーを作る。
2. アクション「Auto Ledgerに支払いを追加」を選ぶ。
3. 金額、店舗、決済手段にShortcut Inputの各項目を割り当てる。
4. 実機で動作確認する。

## 注意

- Walletを通らないPayPay QR決済は、この取引トリガーでは拾えない。
- PayPayなどは通知文、レシート、CSVから半自動入力する。
- 取引情報の項目はカード会社、iOSバージョン、決済種別で差が出る可能性がある。
