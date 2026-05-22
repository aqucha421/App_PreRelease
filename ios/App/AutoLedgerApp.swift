import SwiftUI

@main
struct AutoLedgerApp: App {
    @StateObject private var store = LedgerStore()

    var body: some Scene {
        WindowGroup {
            HomeView()
                .environmentObject(store)
                .onOpenURL { url in
                    store.receiveShortcutURL(url)
                }
        }
    }
}
