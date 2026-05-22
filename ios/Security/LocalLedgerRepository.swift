import CryptoKit
import Foundation

struct LocalLedgerSnapshot: Codable {
    let version: Int
    let transactions: [LedgerTransaction]
    let merchantCategoryMemory: [String: LedgerCategory]
    let duplicateCount: Int
    let savedAt: Date
}

enum LocalLedgerRepositoryError: Error {
    case missingKey
    case invalidPayload
}

struct LocalLedgerRepository {
    private let fileName = "ledger-store.bin"
    private let keyStore = KeychainKeyStore()

    func save(snapshot: LocalLedgerSnapshot) throws {
        let keyData = try keyStore.loadOrCreateKey()
        let key = SymmetricKey(data: keyData)
        let nonce = AES.GCM.Nonce()
        let plaintext = try JSONEncoder().encode(snapshot)
        let sealed = try AES.GCM.seal(plaintext, using: key, nonce: nonce)

        guard let combined = sealed.combined else {
            throw LocalLedgerRepositoryError.invalidPayload
        }

        try combined.write(to: storeURL(), options: [.atomic, .completeFileProtection])
    }

    func load() throws -> LocalLedgerSnapshot? {
        let url = storeURL()
        guard FileManager.default.fileExists(atPath: url.path) else {
            return nil
        }

        let keyData = try keyStore.loadOrCreateKey()
        let key = SymmetricKey(data: keyData)
        let data = try Data(contentsOf: url)
        let sealed = try AES.GCM.SealedBox(combined: data)
        let plaintext = try AES.GCM.open(sealed, using: key)
        return try JSONDecoder().decode(LocalLedgerSnapshot.self, from: plaintext)
    }

    func deleteAll() throws {
        let url = storeURL()
        if FileManager.default.fileExists(atPath: url.path) {
            try FileManager.default.removeItem(at: url)
        }
        try keyStore.deleteKey()
    }

    private func storeURL() throws -> URL {
        let directory = try FileManager.default.url(
            for: .applicationSupportDirectory,
            in: .userDomainMask,
            appropriateFor: nil,
            create: true
        )
        return directory.appendingPathComponent(fileName)
    }
}
