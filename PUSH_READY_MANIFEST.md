# Push Ready Manifest

GitHub Pagesへ反映する前に、push対象を分類して確認するための一覧です。

## PWA shell

- `index.html`
- `app.js`
- `styles.css`
- `sw.js`
- `manifest.webmanifest`
- `icon-192.png`
- `icon-512.png`

## Debug iPhone

- `debug-iphone.html`
- `debug-iphone.css`
- `debug-iphone.js`
- `IPHONE_DEBUG_GUIDE.md`

## Pre-release docs

- `README.md`
- `REAL_DEVICE_PRERELEASE_GUIDE.md`
- `PUBLIC_PWA_CHECKLIST.md`
- `PUSH_PREP_AUDIT.md`
- `PUSH_READY_MANIFEST.md`
- `PUSH_FINAL_CHECK.md`
- `PRERELEASE_BACKLOG.md`
- `POSITIONING_AND_FREE_MODEL.md`
- `NATIVE_RELEASE_SYNC.md`

## Native draft

- `ios/`
- `ios-tests/`
- `IOS_ARCHITECTURE_DECISION.md`
- `APP_STORE_SUBMISSION_DRAFT.md`
- `PRIVACY_POLICY_DRAFT.md`
- `SHORTCUT_SETUP_GUIDE.md`
- `PWA_PRERELEASE_GUIDE.md`

## Do not push as personal data

- Exported JSON backups
- Exported CSV files
- Real payment screenshots
- Personal notes containing store names, exact amounts, or private routines
- Tokens, passwords, API keys, or Apple/GitHub credentials

## Suggested check commands

```powershell
git status --short
node --check app.js
node --check debug-iphone.js
```

## Suggested add command

```powershell
git add index.html app.js styles.css sw.js manifest.webmanifest debug-iphone.html debug-iphone.css debug-iphone.js icon-192.png icon-512.png README.md REAL_DEVICE_PRERELEASE_GUIDE.md PUBLIC_PWA_CHECKLIST.md PUSH_PREP_AUDIT.md PUSH_READY_MANIFEST.md PUSH_FINAL_CHECK.md PRERELEASE_BACKLOG.md IPHONE_DEBUG_GUIDE.md POSITIONING_AND_FREE_MODEL.md NATIVE_RELEASE_SYNC.md APP_STORE_SUBMISSION_DRAFT.md IOS_ARCHITECTURE_DECISION.md PRIVACY_POLICY_DRAFT.md PWA_PRERELEASE_GUIDE.md SHORTCUT_SETUP_GUIDE.md ios ios-tests
```
