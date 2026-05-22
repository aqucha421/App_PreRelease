# Xcode Setup

## Recommended

Use XcodeGen with `project.yml` from the repository root:

```sh
brew install xcodegen
xcodegen generate
open AutoLedger.xcodeproj
```

## Manual Xcode Setup

1. Create a new iOS SwiftUI project named `AutoLedger`.
2. Set minimum iOS to 17.0.
3. Add all `.swift` files under `ios/`.
4. Add `ios/Config/PrivacyInfo.xcprivacy` as a resource.
5. Add URL scheme `autoledger`.
6. Set Objective-C Bridging Header to `ios/Config/AutoLedger-Bridging-Header.h`.
7. Confirm `CommonCrypto` is available through the bridge.
8. Run on a real iPhone before TestFlight because Wallet transaction triggers are device behavior.

## First Run Checks

- App launches
- Demo transactions appear
- Category can be edited
- QR text creates a transaction
- CSV rows import
- URL scheme opens the app and creates a transaction
- App Intents action appears in Shortcuts
- Relaunch preserves encrypted local data
