import SwiftUI

struct ImportView: View {
    @EnvironmentObject private var store: LedgerStore
    @State private var selectedProvider: PaymentProvider = .quicPay
    @State private var walletMerchant = "コンビニ 渋谷三丁目"
    @State private var walletAmount = "680"
    @State private var qrText = """
    PayPayで680円を支払いました
    店舗: コンビニ 渋谷三丁目
    """
    @State private var csvText = """
    Suica,JR 新宿駅,198,交通費
    PayPay,ドラッグストア 青山,1420,日用品
    QUICPay,カフェ 表参道,620,カフェ
    """

    var body: some View {
        NavigationStack {
            Form {
                Section("Wallet取引") {
                    Picker("決済手段", selection: $selectedProvider) {
                        ForEach([PaymentProvider.quicPay, .iD, .suica, .pasmo]) { provider in
                            Text(provider.rawValue).tag(provider)
                        }
                    }

                    TextField("店舗", text: $walletMerchant)
                    TextField("金額", text: $walletAmount)
                        .keyboardType(.numberPad)

                    Button("Wallet取引を受信") {
                        store.addWalletTransaction(
                            provider: selectedProvider,
                            merchant: walletMerchant,
                            amount: Int(walletAmount) ?? 0
                        )
                    }
                }

                Section("QR決済の半自動入力") {
                    TextEditor(text: $qrText)
                        .frame(minHeight: 120)

                    Button("通知文から候補を作る") {
                        store.addQRText(qrText)
                    }
                }

                Section("CSV明細インポート") {
                    TextEditor(text: $csvText)
                        .frame(minHeight: 140)

                    Button("CSVを取り込む") {
                        store.addCSVRows(csvText)
                    }
                }
            }
            .navigationTitle("取り込み")
        }
    }
}
