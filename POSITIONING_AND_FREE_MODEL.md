# Positioning and Free Model

## Positioning

Auto Ledger is not a bank aggregation app.

It is a local-first expense logger for people who mainly pay with Apple Wallet touch payments and Japanese QR payment apps.

## Differentiation

- No bank login required
- No credit card account aggregation required
- Apple Wallet payments can be logged through Shortcuts
- PayPay, Rakuten Pay, d払い, au PAY, and similar QR payments are handled as semi-automatic notification/CSV imports
- Transaction details stay local by default
- Category classification runs locally
- Lightweight PWA pre-release works without a Mac

## Competitor Avoidance

Do not compete head-on with Money Forward ME, Zaim, Moneytree, or OsidOri as a full financial aggregation app.

Instead, own this niche:

> I paid with my phone. I want the expense logged immediately without linking my bank account.

## Free Model

The default product should be free.

Allowed monetization:

- Non-tracking sponsor card on report/settings screens
- Affiliate links to general financial education content
- Optional small support plan to hide sponsor cards
- Paid encrypted backup/sync in the future

Avoid:

- Ads immediately after transaction entry
- Ads inside transaction rows
- Personalized ads based on merchant names or amounts
- Sending raw transaction details to ad networks
- Claiming direct PayPay transaction sync

## Ad Placement Rules

Allowed:

- Monthly report screen
- Settings screen
- Shortcut setup guide screen

Not allowed:

- Transaction creation success state
- Ledger list rows
- Category edit controls
- Error/diagnostic messages

## Sponsor Transparency

The app should show a clear sponsor policy in the product:

- Sponsor slots do not receive merchant names
- Sponsor slots do not receive transaction amounts
- Sponsor slots do not receive memo text
- Sponsor slots do not receive category history
- Sponsor slots can be hidden in settings/report screens

The free version can show a sponsor card, but it must feel separate from the ledger itself.

## Product Promise

Basic expense logging should remain free:

- Wallet shortcut intake
- QR notification parsing
- CSV import
- Local categories
- Local encrypted storage
- Basic monthly report
- Category budgets and local alerts
- CSV export
- JSON backup export
- JSON backup import/restore

## Data Portability

Users should never feel locked in.

Required free features:

- Export transactions as CSV
- Export local backup as JSON
- Restore local backup from JSON
- Copy monthly summary
- Delete debug/test data

Future paid backup/sync must not remove these free export paths.
