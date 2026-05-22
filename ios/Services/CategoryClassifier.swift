import Foundation

struct CategoryClassifier {
    private let memory: [String: LedgerCategory]

    init(memory: [String: LedgerCategory] = [:]) {
        self.memory = memory
    }

    func classify(merchant: String, memo: String = "", fallback: LedgerCategory? = nil) -> LedgerCategory {
        if let fallback {
            return fallback
        }

        let text = "\(merchant) \(memo)"

        if let remembered = memory.first(where: { text.localizedCaseInsensitiveContains($0.key) }) {
            return remembered.value
        }

        if matches(text, ["駅", "JR", "Suica", "PASMO", "メトロ", "タクシー", "バス"]) {
            return .transport
        }
        if matches(text, ["コンビニ", "スーパー", "弁当", "食堂", "レストラン", "食品"]) {
            return .food
        }
        if matches(text, ["カフェ", "喫茶", "コーヒー"]) {
            return .cafe
        }
        if matches(text, ["ドラッグ", "薬局", "日用品", "ホームセンター"]) {
            return .dailyGoods
        }
        if matches(text, ["病院", "クリニック", "歯科"]) {
            return .medical
        }
        if matches(text, ["映画", "書店", "ゲーム", "カラオケ"]) {
            return .entertainment
        }
        if matches(text, ["電気", "ガス", "水道", "通信", "家賃"]) {
            return .fixed
        }

        return .uncategorized
    }

    private func matches(_ text: String, _ words: [String]) -> Bool {
        words.contains { text.localizedCaseInsensitiveContains($0) }
    }
}
