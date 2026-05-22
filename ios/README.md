# Auto Ledger iOS Source Draft

This folder contains Swift source drafts for the native iOS version.

It is not a complete Xcode project yet. The goal is to keep the core app structure ready so it can be copied into a SwiftUI Xcode project once a Mac, cloud Mac, or Xcode Cloud path is available.

## Target

- SwiftUI app
- Local-first transaction storage
- Wallet transaction intake through Shortcuts/App Intents or URL scheme
- QR payment notification parsing
- Local category classification
- Encrypted backup/restore with CryptoKit and Keychain

## Suggested Xcode Groups

- `App`
- `Models`
- `Services`
- `Views`
- `Security`

## First Xcode Steps Later

1. Create a new iOS SwiftUI app named `AutoLedger`.
2. Add the Swift files from this folder to the project.
3. Enable App Groups only if a widget/extension is added later.
4. Add URL scheme `autoledger`.
5. Add App Intents target only after the basic app runs on device.
