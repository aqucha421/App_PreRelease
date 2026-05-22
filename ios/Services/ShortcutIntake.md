# Shortcut Intake Design

## v1 URL Scheme

Use a URL scheme first because it is simple to test:

```text
autoledger://transaction?provider=QUICPay&merchant=コンビニ%20渋谷三丁目&amount=680
```

The app handles this in `AutoLedgerApp.onOpenURL` and calls `LedgerStore.receiveShortcutURL`.

## iOS Shortcut Setup

1. Open Shortcuts.
2. Create a personal automation.
3. Choose Wallet transaction trigger.
4. Select target cards or passes.
5. Add URL action.
6. Build the `autoledger://transaction?...` URL using Shortcut Input fields:
   - `provider`: card or pass name if available
   - `merchant`: merchant field
   - `amount`: amount field
7. Add Open URLs action.

## App Intents Upgrade

The draft source includes:

- `AddWalletTransactionIntent`
- `ShortcutLedgerWriter`

Parameters:

- `provider`
- `merchant`
- `amount`
- `memo`

Keep the URL scheme as a fallback because it is easier to debug in early TestFlight builds.
