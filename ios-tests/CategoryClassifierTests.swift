import XCTest
@testable import AutoLedger

final class CategoryClassifierTests: XCTestCase {
    func testClassifiesTransport() {
        let classifier = CategoryClassifier()
        XCTAssertEqual(classifier.classify(merchant: "JR 新宿駅"), .transport)
    }

    func testClassifiesFood() {
        let classifier = CategoryClassifier()
        XCTAssertEqual(classifier.classify(merchant: "コンビニ 渋谷三丁目"), .food)
    }

    func testUsesMemoryBeforeRules() {
        let classifier = CategoryClassifier(memory: ["コンビニ 渋谷三丁目": .dailyGoods])
        XCTAssertEqual(classifier.classify(merchant: "コンビニ 渋谷三丁目"), .dailyGoods)
    }
}
