# Macなし個人プレリリース手順

## 方針

App Store提出にはMac/Xcode環境が必要です。Macなしで自分だけ使う最短ルートは、Auto LedgerをPWAとしてHTTPSで置き、iPhoneのSafariから「ホーム画面に追加」する方法です。

## できること

- iPhoneのホーム画面からアプリ風に起動
- 端末内localStorageへ暗号化保存
- オフライン表示
- ショートカットからURLを開いて取引追加
- PayPayなどQR決済は通知文/CSVで半自動入力

## できない/弱いこと

- App Store配布
- ネイティブのWallet API連携
- App Intentsのネイティブアクション
- iOSの完全なバックグラウンド処理
- PayPayアプリからの個人履歴直接取得

## デプロイ候補

Windowsだけで扱いやすい順:

1. GitHub Pages
2. Cloudflare Pages
3. Netlify
4. Vercel

いずれもHTTPSで公開できるため、iPhoneショートカットから開けます。

## GitHub Pages例

1. GitHubでprivate repositoryを作る。
2. このフォルダのファイルをpushする。
3. Settings > Pagesを開く。
4. Deploy from branchを選ぶ。
5. `main` branch、rootを選ぶ。
6. 表示されたHTTPS URLをiPhone Safariで開く。
7. 共有ボタンから「ホーム画面に追加」する。

private repositoryでもPagesの公開範囲はプランや設定に依存します。完全非公開で使いたい場合はCloudflare Accessなどの認証付きホスティングを使います。

## ショートカットURL形式

PWAのURLが以下だとします。

```text
https://example.com/auto-ledger/index.html
```

ショートカットから開くURL:

```text
https://example.com/auto-ledger/index.html?provider=QUICPay&merchant=コンビニ%20渋谷三丁目&amount=680&source=wallet
```

パラメータ:

- `provider`: QUICPay / iD / Suica / PASMO / PayPay
- `merchant`: 店舗名
- `amount`: 金額
- `source`: wallet または qr

## iPhoneでの確認

1. PWAをホーム画面に追加する。
2. PWAを開く。
3. パスフレーズを入れて暗号化保存を試す。
4. SafariでショートカットURLを開く。
5. 家計簿ログに取引が追加されることを確認する。
6. ショートカットのWallet取引トリガーから同じURLを組み立てる。

## 注意

PWAはWebアプリなので、ネイティブiOSアプリよりOS連携は弱いです。ただし、Macなしで個人利用プレリリースを始めるには最短です。
