import Foundation

struct DuplicateDetector {
    func isDuplicate(_ candidate: LedgerTransaction, in transactions: [LedgerTransaction]) -> Bool {
        transactions.contains { existing in
            existing.provider == candidate.provider &&
            existing.merchant == candidate.merchant &&
            existing.amount == candidate.amount &&
            abs(existing.occurredAt.timeIntervalSince(candidate.occurredAt)) < 300
        }
    }
}
