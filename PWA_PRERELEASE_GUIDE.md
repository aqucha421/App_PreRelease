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
3. パスフレーズを入れて「解除して保存」を押す。
4. 保存状態が「自動保存ON」になることを確認する。
5. SafariでショートカットURLを開く。
6. 家計簿ログに取引が追加されることを確認する。
7. ショートカットのWallet取引トリガーから同じURLを組み立てる。

## 決済しても追加されない時

まずPWA側の「ショートカット診断」を使う。

1. PWAを開く。
2. 「ショートカット診断」の「テスト追加」を押す。
3. `ショートカットテスト 999円` が追加されるか確認する。

追加される場合:

- PWA側は正常。
- ショートカットの取引トリガー、URL作成、URLを開くアクションを見直す。

追加されない場合:

- GitHub PagesのURLではなくGitHubのファイル画面を開いていないか確認する。
- URLが `https://ユーザー名.github.io/App_PreRelease/index.html` 形式になっているか確認する。
- iPhone Safariで開けるか確認する。

ショートカット側で確認すること:

- オートメーションが有効
- 実行前に尋ねるがOFF、またはすぐに実行
- アクションが「URL」だけで終わっておらず、その次に「URLを開く」がある
- 最初は固定URLで試す

```text
https://ユーザー名.github.io/App_PreRelease/index.html?provider=QUICPay&merchant=ショートカットテスト&amount=999&source=wallet
```

固定URLで追加されるなら、Wallet取引の金額や店舗名をURLへ差し込む部分が原因。

## 注意

PWAはWebアプリなので、ネイティブiOSアプリよりOS連携は弱いです。ただし、Macなしで個人利用プレリリースを始めるには最短です。
