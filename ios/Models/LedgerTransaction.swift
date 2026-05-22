import Foundation

enum PaymentProvider: String, CaseIterable, Codable, Identifiable {
    case payPay = "PayPay"
    case quicPay = "QUICPay"
    case iD = "iD"
    case suica = "Suica"
    case pasmo = "PASMO"
    case qr = "QR決済"

    var id: String { rawValue }

    var shortName: String {
        switch self {
        case .payPay: return "Pay"
        case .quicPay: return "QP"
        case .iD: return "iD"
        case .suica: return "Su"
        case .pasmo: return "PM"
        case .qr: return "QR"
        }
    }
}

enum LedgerCategory: String, CaseIterable, Codable, Identifiable {
    case food = "食費"
    case transport = "交通費"
    case cafe = "カフェ"
    case dailyGoods = "日用品"
    case medical = "医療"
    case entertainment = "娯楽"
    case fixed = "固定費"
    case uncategorized = "未分類"

    var id: String { rawValue }
}

enum TransactionSource: String, Codable {
    case walletShortcut = "Wallet自動"
    case qrAssist = "QR半自動"
    case csvImport = "明細インポート"
    case manual = "手入力"
}

struct LedgerTransaction: Identifiable, Codable, Equatable {
    var id: UUID
    var provider: PaymentProvider
    var merchant: String
    var amount: Int
    var currency: String
    var category: LedgerCategory
    var source: TransactionSource
    var occurredAt: Date
    var createdAt: Date
    var memo: String

    init(
        id: UUID = UUID(),
        provider: PaymentProvider,
        merchant: String,
        amount: Int,
        currency: String = "JPY",
        category: LedgerCategory,
        source: TransactionSource,
        occurredAt: Date = Date(),
        createdAt: Date = Date(),
        memo: String = ""
    ) {
        self.id = id
        self.provider = provider
        self.merchant = merchant
        self.amount = amount
        self.currency = currency
        self.category = category
        self.source = source
        self.occurredAt = occurredAt
        self.createdAt = createdAt
        self.memo = memo
    }
}

struct CategoryTotal: Identifiable {
    let category: LedgerCategory
    let amount: Int

    var id: String { category.rawValue }
}
