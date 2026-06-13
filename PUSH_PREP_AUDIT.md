# Push Prep Audit

## v0.9.6 final push

- アプリ内の「最終push手順」をコピーしてから実行する
- 実行する前にブロッカーが残っていないか確認する
- stage対象は `PUSH_READY_MANIFEST.md` と `PUSH_FINAL_CHECK.md` を見ながら限定する
- push後、iPhoneで `v0.9.6` 表示を確認する

## v0.9.5 GitHub Pages reflection prep

- push対象は `PUSH_READY_MANIFEST.md` の分類で確認する
- push前にアプリ内の「GitHub Pages反映準備」をコピーする
- `git add` は必要ファイルだけを指定して実行する
- 実データのJSONバックアップ、CSV、スクリーンショット、個人メモはaddしない

GitHub Pagesへ反映する直前のセルフ監査メモです。

## 1. Static checks

- `git status --short` でpush対象を確認する
- `node --check app.js` を通す
- `node --check debug-iphone.js` を通す
- `app.js`、`index.html`、`sw.js` のバージョン更新が揃っていることを確認する

## 2. Privacy checks

- JSONバックアップを公開リポジトリへ置かない
- CSV、スクリーンショット、取引明細、個人メモをpushしない
- コピーしたレポートに店舗名、金額、個人メモが混ざっていないか見る
- バックアップは自分だけが開ける場所に保存する

## 3. GitHub Pages checks

- 共有するURLは `https://ユーザー名.github.io/リポジトリ名/` の形式にする
- `github.com/.../index.html` のファイル画面は共有しない
- push後、iPhoneで最新版に更新して `v0.9.4` 表示を確認する
- 固定URLテストで1件追加されることを確認する

## 4. Decision

- ブロッカーがある場合はpush前に解消する
- 注意項目だけの場合は、自分用プレリリースとして使いながら記録する
- 実機で気づいた点はアプリ内の実機フィードバックへ残す
