import SwiftUI

struct HomeView: View {
    @EnvironmentObject private var store: LedgerStore

    var body: some View {
        TabView {
            DashboardView()
                .tabItem {
                    Label("ホーム", systemImage: "house")
                }

            ImportView()
                .tabItem {
                    Label("取り込み", systemImage: "square.and.arrow.down")
                }

            SettingsView()
                .tabItem {
                    Label("設定", systemImage: "gearshape")
                }
        }
        .task {
            store.loadLocalData()
            if store.transactions.isEmpty {
                store.seedDemoData()
            }
        }
    }
}

struct DashboardView: View {
    @EnvironmentObject private var store: LedgerStore

    var body: some View {
        NavigationStack {
            List {
                Section {
                    SummaryHeader(
                        monthTotal: store.monthTotal,
                        transactionCount: store.transactions.count,
                        classifiedRate: store.classifiedRate
                    )
                }

                Section("カテゴリ別") {
                    if store.categoryTotals.isEmpty {
                        Text("取引が入るとカテゴリ別に集計します")
                            .foregroundStyle(.secondary)
                    } else {
                        ForEach(store.categoryTotals) { total in
                            CategoryTotalRow(total: total, monthTotal: store.monthTotal)
                        }
                    }
                }

                Section("最近の取引") {
                    ForEach(store.transactions) { transaction in
                        TransactionRow(transaction: transaction) { category in
                            store.updateCategory(for: transaction.id, to: category)
                        }
                    }
                }
            }
            .navigationTitle("Auto Ledger")
        }
    }
}

struct SummaryHeader: View {
    let monthTotal: Int
    let transactionCount: Int
    let classifiedRate: Int

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("今月の支出")
                .font(.subheadline)
                .foregroundStyle(.secondary)
            Text(monthTotal, format: .currency(code: "JPY"))
                .font(.largeTitle.bold())
            HStack {
                Label("\(transactionCount)件", systemImage: "list.bullet.rectangle")
                Spacer()
                Label("分類済み \(classifiedRate)%", systemImage: "tag")
            }
            .font(.subheadline)
            .foregroundStyle(.secondary)
        }
        .padding(.vertical, 8)
    }
}

struct CategoryTotalRow: View {
    let total: CategoryTotal
    let monthTotal: Int

    private var ratio: Double {
        guard monthTotal > 0 else { return 0 }
        return Double(total.amount) / Double(monthTotal)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(total.category.rawValue)
                    .font(.headline)
                Spacer()
                Text(total.amount, format: .currency(code: "JPY"))
                    .font(.subheadline.bold())
            }
            ProgressView(value: ratio)
        }
    }
}

struct TransactionRow: View {
    let transaction: LedgerTransaction
    let onCategoryChange: (LedgerCategory) -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(alignment: .top) {
                Text(transaction.provider.shortName)
                    .font(.caption.bold())
                    .foregroundStyle(.teal)
                    .frame(width: 42, height: 42)
                    .background(Color.teal.opacity(0.12))
                    .clipShape(RoundedRectangle(cornerRadius: 8))

                VStack(alignment: .leading, spacing: 4) {
                    Text(transaction.merchant)
                        .font(.headline)
                    Text("\(transaction.provider.rawValue) · \(transaction.source.rawValue)")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }

                Spacer()

                Text(transaction.amount, format: .currency(code: transaction.currency))
                    .font(.headline)
            }

            Picker("カテゴリ", selection: Binding(
                get: { transaction.category },
                set: { onCategoryChange($0) }
            )) {
                ForEach(LedgerCategory.allCases) { category in
                    Text(category.rawValue).tag(category)
                }
            }
            .pickerStyle(.menu)
        }
        .padding(.vertical, 6)
    }
}
