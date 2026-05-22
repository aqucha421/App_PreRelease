import SwiftUI

struct SettingsView: View {
    @EnvironmentObject private var store: LedgerStore
    @State private var passphrase = ""
    @State private var status = "未保存"

    var body: some View {
        NavigationStack {
            Form {
                Section("プライバシー") {
                    Label("取引データは端末内保存", systemImage: "iphone")
                    Label("分類はローカルで実行", systemImage: "tag")
                    Label("同期は将来のオプトイン機能", systemImage: "lock.icloud")
                }

                Section("暗号化バックアップ") {
                    SecureField("パスフレーズ", text: $passphrase)
                    HStack {
                        Button("保存") {
                            status = "Swift実装ではSecureBackupServiceで保存"
                        }
                        Button("復元") {
                            status = "Swift実装ではSecureBackupServiceで復元"
                        }
                    }
                    Text(status)
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }

                Section("ショートカット設定") {
                    Text("Walletの取引トリガーで、金額・店舗名・カード名をAuto Ledgerへ渡します。")
                    Text("URL例: autoledger://transaction?provider=QUICPay&merchant=コンビニ&amount=680")
                        .font(.footnote)
                        .textSelection(.enabled)
                }

                Section {
                    Button("すべての取引を削除", role: .destructive) {
                        store.deleteAll()
                    }
                }
            }
            .navigationTitle("設定")
        }
    }
}
