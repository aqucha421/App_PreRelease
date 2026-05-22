# ローカル確認手順

## Windows上で確認

このフォルダでHTTPサーバーを起動します。

```powershell
py -m http.server 8765 --bind 127.0.0.1
```

ブラウザで開きます。

```text
http://127.0.0.1:8765/index.html
```

## URL取り込みテスト

ブラウザで以下を開きます。

```text
http://127.0.0.1:8765/index.html?provider=QUICPay&merchant=コンビニ%20渋谷三丁目&amount=680&source=wallet
```

家計簿ログに取引が追加され、URLのクエリが消えれば成功です。

## iPhoneで使う場合

`127.0.0.1` はiPhone自身を指すため、Windows PCで動いているローカルサーバーにはアクセスできません。

iPhoneで使うには、次のどちらかが必要です。

- GitHub PagesやCloudflare Pagesへデプロイする
- Windows PCのLAN IPを使い、同じWi-Fi内からアクセスする

PWAとしてホーム画面に追加するには、HTTPSで配信する方法が安定します。GitHub PagesやCloudflare Pagesを推奨します。
