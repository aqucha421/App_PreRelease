import Foundation
import Security

enum KeychainKeyStoreError: Error {
    case unexpectedStatus(OSStatus)
    case missingData
}

struct KeychainKeyStore {
    private let service = "com.autoledger.keys"
    private let account = "ledger-encryption-key"

    func loadOrCreateKey() throws -> Data {
        if let existing = try loadKey() {
            return existing
        }

        var bytes = [UInt8](repeating: 0, count: 32)
        let status = SecRandomCopyBytes(kSecRandomDefault, bytes.count, &bytes)
        guard status == errSecSuccess else {
            throw KeychainKeyStoreError.unexpectedStatus(status)
        }

        let data = Data(bytes)
        try saveKey(data)
        return data
    }

    func deleteKey() throws {
        let query = baseQuery()
        let status = SecItemDelete(query as CFDictionary)
        if status != errSecSuccess && status != errSecItemNotFound {
            throw KeychainKeyStoreError.unexpectedStatus(status)
        }
    }

    private func loadKey() throws -> Data? {
        var query = baseQuery()
        query[kSecReturnData as String] = true
        query[kSecMatchLimit as String] = kSecMatchLimitOne

        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)

        if status == errSecItemNotFound {
            return nil
        }
        guard status == errSecSuccess else {
            throw KeychainKeyStoreError.unexpectedStatus(status)
        }
        guard let data = item as? Data else {
            throw KeychainKeyStoreError.missingData
        }
        return data
    }

    private func saveKey(_ data: Data) throws {
        var query = baseQuery()
        query[kSecValueData as String] = data
        query[kSecAttrAccessible as String] = kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly

        let status = SecItemAdd(query as CFDictionary, nil)
        guard status == errSecSuccess else {
            throw KeychainKeyStoreError.unexpectedStatus(status)
        }
    }

    private func baseQuery() -> [String: Any] {
        [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account
        ]
    }
}
