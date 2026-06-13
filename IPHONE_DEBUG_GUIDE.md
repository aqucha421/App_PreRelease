# iPhone仮想デバッグ画面

## 開き方

ローカルサーバーを起動してから、PCのブラウザで開きます。

```powershell
py -m http.server 8765 --bind 127.0.0.1
```

```text
http://127.0.0.1:8765/debug-iphone.html
```

## できること

- iPhoneサイズでAuto Ledgerを表示
- iPhone 15 / 14 / 13 mini / 15 Pro Maxの画面サイズ切り替え
- Wallet風イベントをURLで送信
- QUICPay、Suica、PayPayなどのシナリオテスト
- 生成されたショートカットURLをコピー
- デバッグログで送信履歴を確認

## 使い方

1. `debug-iphone.html` を開く。
2. 右側の `Scenarios` からテストケースを選ぶ。
3. `Send to iPhone` を押す。
4. 左側の仮想iPhone内で取引が追加されるか確認する。

## GitHub Pagesで試す場合

`Base URL` にGitHub PagesのURLを入れます。

```text
https://ユーザー名.github.io/App_PreRelease/index.html
```

その状態で `Send to iPhone` を押すと、公開版に対してショートカットURLを流し込めます。

## 注意

これはWindows上のブラウザ内で動く仮想デバッグ画面です。Apple公式のiOS Simulatorではありません。

確認できること:

- レスポンシブ表示
- URLパラメータ取り込み
- カテゴリ分類
- QR/Wallet風イベント

確認できないこと:

- 実機のWallet取引トリガーそのもの
- iOSショートカットの自動実行挙動
- Safari PWA特有の細かい制約
