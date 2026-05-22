import XCTest
@testable import AutoLedger

final class QRCodePaymentParserTests: XCTestCase {
    func testParsesPayPayNotification() {
        let parser = QRCodePaymentParser()
        let parsed = parser.parse("""
        PayPayで1,420円を支払いました
        店舗: ドラッグストア 青山
        """)

        XCTAssertEqual(parsed.provider, .payPay)
        XCTAssertEqual(parsed.amount, 1420)
        XCTAssertEqual(parsed.merchant, "ドラッグストア 青山")
    }

    func testFallsBackWhenMerchantMissing() {
        let parser = QRCodePaymentParser()
        let parsed = parser.parse("680円を支払いました")

        XCTAssertEqual(parsed.provider, .qr)
        XCTAssertEqual(parsed.amount, 680)
        XCTAssertEqual(parsed.merchant, "確認待ちの店舗")
    }
}
