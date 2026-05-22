import Foundation

struct ParsedPayment {
    let provider: PaymentProvider
    let merchant: String
    let amount: Int
    let memo: String
}

struct QRCodePaymentParser {
    func parse(_ text: String) -> ParsedPayment {
        let provider: PaymentProvider = text.contains("PayPay") ? .payPay : .qr
        let amount = extractAmount(from: text) ?? 0
        let merchant = extractMerchant(from: text) ?? "確認待ちの店舗"

        return ParsedPayment(
            provider: provider,
            merchant: merchant,
            amount: amount,
            memo: "通知/レシートから抽出"
        )
    }

    private func extractAmount(from text: String) -> Int? {
        let pattern = #"([0-9,]+)\s*円"#
        guard let range = text.range(of: pattern, options: .regularExpression) else {
            return nil
        }

        let matched = String(text[range])
        let digits = matched
            .replacingOccurrences(of: "円", with: "")
            .replacingOccurrences(of: ",", with: "")
            .trimmingCharacters(in: .whitespacesAndNewlines)
        return Int(digits)
    }

    private func extractMerchant(from text: String) -> String? {
        let lines = text.components(separatedBy: .newlines)
        for line in lines {
            let normalized = line.trimmingCharacters(in: .whitespacesAndNewlines)
            for label in ["店舗:", "店舗：", "店名:", "店名：", "利用先:", "利用先："] {
                if normalized.hasPrefix(label) {
                    return normalized.replacingOccurrences(of: label, with: "").trimmingCharacters(in: .whitespacesAndNewlines)
                }
            }
        }
        return nil
    }
}
