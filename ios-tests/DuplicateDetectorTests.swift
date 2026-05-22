import XCTest
@testable import AutoLedger

final class DuplicateDetectorTests: XCTestCase {
    func testDetectsNearDuplicate() {
        let detector = DuplicateDetector()
        let first = LedgerTransaction(
            provider: .quicPay,
            merchant: "コンビニ 渋谷三丁目",
            amount: 680,
            category: .food,
            source: .walletShortcut,
            occurredAt: Date()
        )
        let second = LedgerTransaction(
            provider: .quicPay,
            merchant: "コンビニ 渋谷三丁目",
            amount: 680,
            category: .food,
            source: .walletShortcut,
            occurredAt: Date().addingTimeInterval(60)
        )

        XCTAssertTrue(detector.isDuplicate(second, in: [first]))
    }
}
