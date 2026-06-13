# Auto Ledger iOS Source Draft

This folder contains Swift source drafts for the native iOS version.

It is not a complete Xcode project yet. The goal is to keep the core app structure ready so it can be copied into a SwiftUI Xcode project once a Mac, cloud Mac, or Xcode Cloud path is available.

## Target

- SwiftUI app
- Local-first transaction storage
- Wallet transaction intake through Shortcuts/App Intents or URL scheme
- QR payment notification parsing for PayPay, Rakuten Pay, d払い, au PAY, and メルペイ
- Local category classification with merchant memory and custom keyword rules
- Category budgets and monthly review states
- Encrypted local storage and encrypted backup/restore with CryptoKit and Keychain
- Optional non-tracking sponsor area that never receives transaction detail

## Suggested Xcode Groups

- `App`
- `Models`
- `Services`
- `Views`
- `Security`
- `AppIntents`
- `Config`

## First Xcode Steps Later

1. Create a new iOS SwiftUI app named `AutoLedger`.
2. Add the Swift files from this folder to the project.
3. Enable App Groups only if a widget/extension is added later.
4. Add URL scheme `autoledger`.
5. Add App Intents target only after the basic app runs on device.

## PWA Parity Notes

The current PWA is the source of truth for v0.8 behavior. Keep the native app aligned with:

- provider list in `PaymentProvider`
- category list in `LedgerCategory`
- custom category rules
- category budgets
- JSON/encrypted backup payload fields
- Shortcut setup guide and diagnostics
- privacy promise: no developer server receives transaction details
