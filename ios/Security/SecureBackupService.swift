import CryptoKit
import Foundation
import Security
import CommonCrypto

struct EncryptedBackupEnvelope: Codable {
    let version: Int
    let algorithm: String
    let salt: Data
    let nonce: Data
    let ciphertext: Data
    let createdAt: Date
}

struct LedgerBackupPayload: Codable {
    let version: Int
    let exportedAt: Date
    let transactions: [LedgerTransaction]
    let merchantCategoryMemory: [String: LedgerCategory]
}

enum SecureBackupError: Error {
    case invalidPassphrase
    case invalidEnvelope
}

struct SecureBackupService {
    private let iterations = 150_000

    func encrypt(payload: LedgerBackupPayload, passphrase: String) throws -> EncryptedBackupEnvelope {
        guard passphrase.count >= 8 else {
            throw SecureBackupError.invalidPassphrase
        }

        let salt = randomData(count: 16)
        let key = try deriveKey(passphrase: passphrase, salt: salt)
        let nonce = AES.GCM.Nonce()
        let plaintext = try JSONEncoder().encode(payload)
        let sealed = try AES.GCM.seal(plaintext, using: key, nonce: nonce)

        guard let combined = sealed.combined else {
            throw SecureBackupError.invalidEnvelope
        }

        return EncryptedBackupEnvelope(
            version: 1,
            algorithm: "PBKDF2-SHA256-AES-GCM",
            salt: salt,
            nonce: nonce.dataRepresentation,
            ciphertext: combined,
            createdAt: Date()
        )
    }

    func decrypt(envelope: EncryptedBackupEnvelope, passphrase: String) throws -> LedgerBackupPayload {
        let key = try deriveKey(passphrase: passphrase, salt: envelope.salt)
        let sealed = try AES.GCM.SealedBox(combined: envelope.ciphertext)
        let plaintext = try AES.GCM.open(sealed, using: key)
        return try JSONDecoder().decode(LedgerBackupPayload.self, from: plaintext)
    }

    private func deriveKey(passphrase: String, salt: Data) throws -> SymmetricKey {
        let password = Array(passphrase.utf8)
        let saltBytes = Array(salt)
        var derived = [UInt8](repeating: 0, count: 32)

        let status = CCKeyDerivationPBKDF(
            CCPBKDFAlgorithm(kCCPBKDF2),
            password,
            password.count,
            saltBytes,
            saltBytes.count,
            CCPseudoRandomAlgorithm(kCCPRFHmacAlgSHA256),
            UInt32(iterations),
            &derived,
            derived.count
        )

        guard status == kCCSuccess else {
            throw SecureBackupError.invalidEnvelope
        }

        return SymmetricKey(data: Data(derived))
    }

    private func randomData(count: Int) -> Data {
        var bytes = [UInt8](repeating: 0, count: count)
        _ = SecRandomCopyBytes(kSecRandomDefault, bytes.count, &bytes)
        return Data(bytes)
    }
}

private extension AES.GCM.Nonce {
    var dataRepresentation: Data {
        withUnsafeBytes { Data($0) }
    }
}
