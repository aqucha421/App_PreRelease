# Push Final Check

最終push直前に見る短いチェックです。

## Run before staging

```powershell
git status --short
node --check app.js
node --check debug-iphone.js
```

## Stage only app and release files

```powershell
git add index.html app.js styles.css sw.js manifest.webmanifest debug-iphone.html debug-iphone.css debug-iphone.js icon-192.png icon-512.png README.md REAL_DEVICE_PRERELEASE_GUIDE.md PUBLIC_PWA_CHECKLIST.md PUSH_PREP_AUDIT.md PUSH_READY_MANIFEST.md PUSH_FINAL_CHECK.md PRERELEASE_BACKLOG.md IPHONE_DEBUG_GUIDE.md POSITIONING_AND_FREE_MODEL.md NATIVE_RELEASE_SYNC.md APP_STORE_SUBMISSION_DRAFT.md IOS_ARCHITECTURE_DECISION.md PRIVACY_POLICY_DRAFT.md PWA_PRERELEASE_GUIDE.md SHORTCUT_SETUP_GUIDE.md ios ios-tests
```

## Commit and push

```powershell
git commit -m "Prepare PWA pre-release"
git push
```

## Do not stage

- JSON backups
- CSV exports
- Screenshots with real payments
- Personal notes with exact routines, store names, or amounts
- Passwords, tokens, API keys, Apple credentials, GitHub credentials

## Confirm on iPhone after push

- Open the GitHub Pages URL, not the GitHub file page
- Refresh to the latest version
- Confirm the app shows `v0.9.6`
- Run the fixed URL test
- Open from the Home Screen icon
