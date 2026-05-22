import AppIntents
import Foundation

struct AddWalletTransactionIntent: AppIntent {
    static var title: LocalizedStringResource = "Auto Ledgerに支払いを追加"
    static var description = IntentDescription("Wallet取引トリガーから金額、店舗名、決済手段を受け取り、家計簿に登録します。")

    @Parameter(title: "決済手段")
    var provider: String

    @Parameter(title: "店舗")
    var merchant: String

    @Parameter(title: "金額")
    var amount: Int

    @Parameter(title: "メモ", default: "")
    var memo: String

    @MainActor
    func perform() async throws -> some IntentResult & ProvidesDialog {
        // App Intents run outside the SwiftUI environment. In the real Xcode project,
        // inject an app-group-backed repository or a shared LedgerWriter here.
        let providerValue = PaymentProvider(rawValue: provider) ?? .quicPay
        let writer = ShortcutLedgerWriter()
        try writer.addWalletTransaction(provider: providerValue, merchant: merchant, amount: amount, memo: memo)
        return .result(dialog: "Auto Ledgerに追加しました")
    }
}

struct AutoLedgerShortcutsProvider: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: AddWalletTransactionIntent(),
            phrases: [
                "\(.applicationName)に支払いを追加",
                "\(.applicationName)で家計簿に記録"
            ],
            shortTitle: "支払いを追加",
            systemImageName: "yensign.circle"
        )
    }
}
