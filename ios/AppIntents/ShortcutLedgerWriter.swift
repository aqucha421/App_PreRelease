import Foundation

struct ShortcutLedgerWriter {
    private let repository = LocalLedgerRepository()

    func addWalletTransaction(provider: PaymentProvider, merchant: String, amount: Int, memo: String) throws {
        let snapshot = (try repository.load()) ?? LocalLedgerSnapshot(
            version: 1,
            transactions: [],
            merchantCategoryMemory: [:],
            customCategoryRules: [],
            categoryBudgets: [],
            settings: .defaultValue,
            duplicateCount: 0,
            savedAt: Date()
        )

        let classifier = CategoryClassifier(memory: snapshot.merchantCategoryMemory, customRules: snapshot.customCategoryRules)
        let transaction = LedgerTransaction(
            provider: provider,
            merchant: merchant,
            amount: amount,
            category: classifier.classify(merchant: merchant, memo: memo),
            source: .walletShortcut,
            memo: memo.isEmpty ? "Wallet取引トリガー" : memo
        )

        if DuplicateDetector().isDuplicate(transaction, in: snapshot.transactions) {
            let updated = LocalLedgerSnapshot(
                version: snapshot.version,
                transactions: snapshot.transactions,
                merchantCategoryMemory: snapshot.merchantCategoryMemory,
                customCategoryRules: snapshot.customCategoryRules,
                categoryBudgets: snapshot.categoryBudgets,
                settings: snapshot.settings,
                duplicateCount: snapshot.duplicateCount + 1,
                savedAt: Date()
            )
            try repository.save(snapshot: updated)
            return
        }

        let updated = LocalLedgerSnapshot(
            version: snapshot.version,
            transactions: [transaction] + snapshot.transactions,
            merchantCategoryMemory: snapshot.merchantCategoryMemory,
            customCategoryRules: snapshot.customCategoryRules,
            categoryBudgets: snapshot.categoryBudgets,
            settings: snapshot.settings,
            duplicateCount: snapshot.duplicateCount,
            savedAt: Date()
        )
        try repository.save(snapshot: updated)
    }
}
