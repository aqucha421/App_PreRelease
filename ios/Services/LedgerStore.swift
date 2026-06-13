import Foundation

@MainActor
final class LedgerStore: ObservableObject {
    @Published private(set) var transactions: [LedgerTransaction] = []
    @Published private(set) var duplicateCount = 0
    @Published var merchantCategoryMemory: [String: LedgerCategory] = [:]
    @Published var customCategoryRules: [CustomCategoryRule] = []
    @Published var categoryBudgets: [CategoryBudget] = []
    @Published var settings: LedgerSettings = .defaultValue

    private let parser = QRCodePaymentParser()
    private let duplicateDetector = DuplicateDetector()
    private let repository = LocalLedgerRepository()
    private var hasLoaded = false

    var monthTotal: Int {
        transactions.reduce(0) { $0 + $1.amount }
    }

    var reviewCount: Int {
        transactions.filter { $0.category == .uncategorized }.count
    }

    var classifiedRate: Int {
        guard !transactions.isEmpty else { return 0 }
        return Int(Double(transactions.count - reviewCount) / Double(transactions.count) * 100)
    }

    var categoryTotals: [CategoryTotal] {
        LedgerCategory.allCases.compactMap { category in
            let amount = transactions.filter { $0.category == category }.reduce(0) { $0 + $1.amount }
            return amount > 0 ? CategoryTotal(category: category, amount: amount) : nil
        }
    }

    func addWalletTransaction(provider: PaymentProvider, merchant: String, amount: Int) {
        let classifier = CategoryClassifier(memory: merchantCategoryMemory, customRules: customCategoryRules)
        let transaction = LedgerTransaction(
            provider: provider,
            merchant: merchant,
            amount: amount,
            category: classifier.classify(merchant: merchant),
            source: .walletShortcut,
            memo: "Wallet取引トリガー"
        )
        add(transaction)
    }

    func addQRText(_ text: String) {
        let parsed = parser.parse(text)
        let classifier = CategoryClassifier(memory: merchantCategoryMemory, customRules: customCategoryRules)
        let transaction = LedgerTransaction(
            provider: parsed.provider,
            merchant: parsed.merchant,
            amount: parsed.amount,
            category: classifier.classify(merchant: parsed.merchant, memo: parsed.memo),
            source: .qrAssist,
            memo: parsed.memo
        )
        add(transaction)
    }

    func addCSVRows(_ rows: String) {
        rows
            .components(separatedBy: .newlines)
            .map { $0.split(separator: ",").map { String($0).trimmingCharacters(in: .whitespacesAndNewlines) } }
            .filter { $0.count >= 3 }
            .forEach { cells in
                let provider = PaymentProvider(rawValue: cells[0]) ?? .qr
                let merchant = cells[1]
                let amount = Int(cells[2]) ?? 0
                let category = cells.count >= 4 ? LedgerCategory(rawValue: cells[3]) : nil
                let classifier = CategoryClassifier(memory: merchantCategoryMemory, customRules: customCategoryRules)
                add(
                    LedgerTransaction(
                        provider: provider,
                        merchant: merchant,
                        amount: amount,
                        category: classifier.classify(merchant: merchant, fallback: category),
                        source: .csvImport,
                        memo: "CSV明細"
                    )
                )
            }
    }

    func updateCategory(for transactionID: UUID, to category: LedgerCategory) {
        guard let index = transactions.firstIndex(where: { $0.id == transactionID }) else {
            return
        }
        transactions[index].category = category
        if category != .uncategorized {
            merchantCategoryMemory[transactions[index].merchant] = category
        }
        persist()
    }

    func addCustomCategoryRule(keyword: String, category: LedgerCategory) {
        let normalizedKeyword = keyword.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !normalizedKeyword.isEmpty else {
            return
        }

        customCategoryRules.removeAll { $0.keyword.localizedCaseInsensitiveCompare(normalizedKeyword) == .orderedSame }
        customCategoryRules.insert(CustomCategoryRule(keyword: normalizedKeyword, category: category), at: 0)
        persist()
    }

    func updateBudget(for category: LedgerCategory, monthlyLimit: Int) {
        categoryBudgets.removeAll { $0.category == category }
        if monthlyLimit > 0 {
            categoryBudgets.append(CategoryBudget(category: category, monthlyLimit: monthlyLimit))
        }
        persist()
    }

    func setSponsorVisible(_ isVisible: Bool) {
        settings.sponsorVisible = isVisible
        persist()
    }

    func deleteAll() {
        transactions.removeAll()
        duplicateCount = 0
        merchantCategoryMemory.removeAll()
        customCategoryRules.removeAll()
        categoryBudgets.removeAll()
        settings = .defaultValue
        try? repository.deleteAll()
    }

    func seedDemoData() {
        guard transactions.isEmpty else {
            return
        }
        addWalletTransaction(provider: .quicPay, merchant: "コンビニ 渋谷三丁目", amount: 680)
        addWalletTransaction(provider: .suica, merchant: "JR 新宿駅", amount: 198)
    }

    func loadLocalData() {
        guard !hasLoaded else {
            return
        }
        hasLoaded = true

        do {
            guard let snapshot = try repository.load() else {
                return
            }
            transactions = snapshot.transactions
            merchantCategoryMemory = snapshot.merchantCategoryMemory
            customCategoryRules = snapshot.customCategoryRules
            categoryBudgets = snapshot.categoryBudgets
            settings = snapshot.settings
            duplicateCount = snapshot.duplicateCount
        } catch {
            // In the production app, surface a non-sensitive recovery message.
        }
    }

    func receiveShortcutURL(_ url: URL) {
        guard url.scheme == "autoledger", url.host == "transaction" else {
            return
        }

        let components = URLComponents(url: url, resolvingAgainstBaseURL: false)
        let query = Dictionary(uniqueKeysWithValues: (components?.queryItems ?? []).compactMap { item in
            item.value.map { (item.name, $0) }
        })

        let provider = PaymentProvider(rawValue: query["provider"] ?? "") ?? .quicPay
        let merchant = query["merchant"] ?? "不明な店舗"
        let amount = Int(query["amount"] ?? "") ?? 0
        addWalletTransaction(provider: provider, merchant: merchant, amount: amount)
    }

    private func add(_ transaction: LedgerTransaction) {
        if duplicateDetector.isDuplicate(transaction, in: transactions) {
            duplicateCount += 1
            persist()
            return
        }
        transactions.insert(transaction, at: 0)
        persist()
    }

    private func persist() {
        let snapshot = LocalLedgerSnapshot(
            version: 1,
            transactions: transactions,
            merchantCategoryMemory: merchantCategoryMemory,
            customCategoryRules: customCategoryRules,
            categoryBudgets: categoryBudgets,
            settings: settings,
            duplicateCount: duplicateCount,
            savedAt: Date()
        )
        try? repository.save(snapshot: snapshot)
    }
}
