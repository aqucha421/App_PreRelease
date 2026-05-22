const formatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

const categories = ["食費", "交通費", "カフェ", "日用品", "医療", "娯楽", "固定費", "未分類"];

const categoryRules = [
  { match: /駅|JR|Suica|PASMO|メトロ|タクシー|バス/, category: "交通費" },
  { match: /コンビニ|スーパー|弁当|食堂|レストラン|食品/, category: "食費" },
  { match: /カフェ|喫茶|コーヒー/, category: "カフェ" },
  { match: /ドラッグ|薬局|日用品|ホームセンター/, category: "日用品" },
  { match: /病院|クリニック|歯科/, category: "医療" },
  { match: /映画|書店|ゲーム|カラオケ/, category: "娯楽" },
  { match: /電気|ガス|水道|通信|家賃/, category: "固定費" },
];

const walletEvents = [
  { provider: "QUICPay", merchant: "コンビニ 渋谷三丁目", amount: 680 },
  { provider: "Suica", merchant: "JR 新宿駅", amount: 198 },
  { provider: "iD", merchant: "スーパー 中目黒", amount: 2310 },
  { provider: "PASMO", merchant: "東京メトロ 表参道駅", amount: 178 },
];

let selectedWalletProvider = "QUICPay";
let ledger = [];
let duplicateCount = 0;
let merchantCategoryMemory = {};

const walletButtons = document.querySelectorAll("#walletButtons button");
const walletForm = document.querySelector("#walletForm");
const qrForm = document.querySelector("#qrForm");
const walletMerchantInput = document.querySelector("#walletMerchantInput");
const walletAmountInput = document.querySelector("#walletAmountInput");
const qrTextInput = document.querySelector("#qrTextInput");
const ledgerList = document.querySelector("#ledgerList");
const template = document.querySelector("#ledgerItemTemplate");
const monthTotal = document.querySelector("#monthTotal");
const autoCount = document.querySelector("#autoCount");
const duplicateCountLabel = document.querySelector("#duplicateCount");
const reviewCount = document.querySelector("#reviewCount");
const classifiedRate = document.querySelector("#classifiedRate");
const connectionState = document.querySelector("#connectionState");
const shortcutPayload = document.querySelector("#shortcutPayload");
const categorySummary = document.querySelector("#categorySummary");
const passphraseInput = document.querySelector("#passphraseInput");
const vaultStatus = document.querySelector("#vaultStatus");
const privacyState = document.querySelector("#privacyState");
const shortcutUrlPreview = document.querySelector("#shortcutUrlPreview");

function inferCategory(text, fallback) {
  if (fallback && categories.includes(fallback)) return fallback;
  const remembered = Object.entries(merchantCategoryMemory).find(([merchant]) => text.includes(merchant));
  if (remembered) return remembered[1];
  const rule = categoryRules.find((item) => item.match.test(text));
  return rule ? rule.category : "未分類";
}

function createPayment({ provider, merchant, amount, memo = "", category, source, time }) {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${provider}-${merchant}-${amount}-${Date.now()}`,
    provider,
    merchant,
    amount: Number(amount),
    memo,
    category: inferCategory(`${merchant} ${memo}`, category),
    source,
    time: time ? new Date(time) : new Date(),
  };
}

function addPayment(payment) {
  const duplicate = ledger.some(
    (item) =>
      item.provider === payment.provider &&
      item.merchant === payment.merchant &&
      item.amount === payment.amount,
  );

  if (duplicate) {
    duplicateCount += 1;
    duplicateCountLabel.textContent = duplicateCount;
    pulse(connectionState, "重複を除外しました");
    return;
  }

  ledger = [payment, ...ledger].slice(0, 30);
  pulse(connectionState, `${payment.source}から登録`);
  renderLedger();
}

function renderLedger() {
  ledgerList.replaceChildren();

  ledger.forEach((item) => {
    const row = template.content.firstElementChild.cloneNode(true);
    row.dataset.id = item.id;
    row.querySelector(".provider-badge").textContent = shortProvider(item.provider);
    row.querySelector(".merchant").textContent = item.merchant;
    row.querySelector(".category").textContent = item.category;
    row.querySelector(".meta").textContent =
      `${item.provider} · ${item.source} · ${item.memo || "メモなし"} · ${formatTime(item.time)}`;
    row.querySelector(".amount").textContent = formatter.format(item.amount);

    const select = row.querySelector(".category-select");
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      option.selected = category === item.category;
      select.append(option);
    });
    select.addEventListener("change", () => updateCategory(item.id, select.value));

    ledgerList.append(row);
  });

  updateStats();
  updateShortcutPayload();
}

function updateCategory(id, category) {
  const item = ledger.find((entry) => entry.id === id);
  if (!item) return;
  item.category = category;
  if (category !== "未分類") {
    merchantCategoryMemory[item.merchant] = category;
  }
  pulse(connectionState, "カテゴリを学習しました");
  renderLedger();
}

function updateStats() {
  const total = ledger.reduce((sum, item) => sum + item.amount, 0);
  const needsReview = ledger.filter((item) => item.category === "未分類").length;
  const classified = ledger.length ? Math.round(((ledger.length - needsReview) / ledger.length) * 100) : 0;

  monthTotal.textContent = formatter.format(total);
  autoCount.textContent = `${ledger.length}件`;
  reviewCount.textContent = needsReview;
  classifiedRate.textContent = `${classified}%`;
  renderCategorySummary(total);
}

function renderCategorySummary(total) {
  categorySummary.replaceChildren();
  const sums = categories
    .map((category) => ({
      category,
      amount: ledger.filter((item) => item.category === category).reduce((sum, item) => sum + item.amount, 0),
    }))
    .filter((item) => item.amount > 0);

  if (!sums.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "取引が入るとカテゴリ別に集計します";
    categorySummary.append(empty);
    return;
  }

  sums.forEach((item) => {
    const row = document.createElement("div");
    row.className = "category-row";
    const percent = total ? Math.round((item.amount / total) * 100) : 0;
    row.innerHTML = `
      <div>
        <strong>${item.category}</strong>
        <span>${formatter.format(item.amount)} · ${percent}%</span>
      </div>
      <meter min="0" max="100" value="${percent}"></meter>
    `;
    categorySummary.append(row);
  });
}

function shortProvider(provider) {
  const labels = {
    PayPay: "Pay",
    QUICPay: "QP",
    Suica: "Su",
    PASMO: "PM",
    iD: "iD",
  };
  return labels[provider] || provider.slice(0, 2);
}

function formatTime(date) {
  return date.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
}

function pulse(element, text) {
  element.textContent = text;
  window.clearTimeout(pulse.timer);
  pulse.timer = window.setTimeout(() => {
    element.textContent = "ショートカット待機中";
  }, 1800);
}

function parseQrText(text) {
  const amountMatch = text.match(/([0-9,]+)\s*円/);
  const merchantMatch = text.match(/(?:店舗|店名|利用先)[:：]\s*(.+)/);
  return {
    provider: text.includes("PayPay") ? "PayPay" : "QR決済",
    merchant: merchantMatch ? merchantMatch[1].trim() : "確認待ちの店舗",
    amount: amountMatch ? Number(amountMatch[1].replaceAll(",", "")) : 0,
    memo: "通知/レシートから抽出",
    source: "QR半自動",
  };
}

function updateShortcutPayload() {
  const merchant = walletMerchantInput.value.trim() || "Shortcut Input Merchant";
  const amount = Number(walletAmountInput.value || 0);
  const payload = {
    source: "ios_shortcuts_wallet_transaction",
    provider: selectedWalletProvider,
    merchant,
    amount,
    category_hint: inferCategory(merchant),
    occurred_at: new Date().toISOString(),
  };
  shortcutPayload.textContent = JSON.stringify(payload, null, 2);
  updateShortcutUrlPreview(payload);
}

function updateShortcutUrlPreview(payload) {
  if (!shortcutUrlPreview) return;
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("provider", payload.provider);
  url.searchParams.set("merchant", payload.merchant);
  url.searchParams.set("amount", String(payload.amount));
  url.searchParams.set("source", "wallet");
  shortcutUrlPreview.textContent = url.toString();
}

function vaultPayload() {
  return {
    version: 1,
    exported_at: new Date().toISOString(),
    ledger: ledger.map((item) => ({ ...item, time: item.time.toISOString() })),
    merchantCategoryMemory,
  };
}

async function deriveKey(passphrase, salt) {
  const encoded = new TextEncoder().encode(passphrase);
  const baseKey = await crypto.subtle.importKey("raw", encoded, "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 150000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

function toBase64(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}

function fromBase64(text) {
  return Uint8Array.from(atob(text), (char) => char.charCodeAt(0));
}

async function saveVault() {
  const passphrase = passphraseInput.value;
  if (passphrase.length < 8) {
    setVaultStatus("パスフレーズは8文字以上を推奨します", true);
    return;
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const plaintext = new TextEncoder().encode(JSON.stringify(vaultPayload()));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);

  localStorage.setItem(
    "auto-ledger-vault",
    JSON.stringify({
      algorithm: "PBKDF2-SHA256-AES-GCM",
      salt: toBase64(salt),
      iv: toBase64(iv),
      ciphertext: toBase64(ciphertext),
    }),
  );
  privacyState.textContent = "暗号化保存済み";
  setVaultStatus("暗号化してこの端末に保存しました", false);
}

async function loadVault() {
  const raw = localStorage.getItem("auto-ledger-vault");
  if (!raw) {
    setVaultStatus("保存データがありません", true);
    return;
  }

  try {
    const stored = JSON.parse(raw);
    const key = await deriveKey(passphraseInput.value, fromBase64(stored.salt));
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromBase64(stored.iv) },
      key,
      fromBase64(stored.ciphertext),
    );
    const payload = JSON.parse(new TextDecoder().decode(decrypted));
    ledger = payload.ledger.map((item) => ({ ...item, time: new Date(item.time) }));
    merchantCategoryMemory = payload.merchantCategoryMemory || {};
    privacyState.textContent = "暗号化保存済み";
    setVaultStatus("復元しました", false);
    renderLedger();
  } catch (error) {
    setVaultStatus("復元できません。パスフレーズを確認してください", true);
  }
}

function setVaultStatus(text, isError) {
  vaultStatus.textContent = text;
  vaultStatus.classList.toggle("error", isError);
}

function receiveShortcutParams() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has("amount") && !params.has("merchant")) return;

  const provider = params.get("provider") || "QUICPay";
  const merchant = params.get("merchant") || "不明な店舗";
  const amount = Number(params.get("amount") || 0);
  const source = params.get("source") === "qr" ? "QR半自動" : "Wallet自動";

  addPayment(
    createPayment({
      provider,
      merchant,
      amount,
      memo: "ショートカットURL",
      source,
    }),
  );

  const cleanUrl = new URL(window.location.href);
  cleanUrl.search = "";
  window.history.replaceState({}, document.title, cleanUrl.toString());
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      setVaultStatus("オフライン機能の登録に失敗しました", true);
    });
  });
}

walletButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedWalletProvider = button.dataset.provider;
    walletButtons.forEach((item) => item.classList.toggle("active", item === button));
    updateShortcutPayload();
  });
});

walletForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addPayment(
    createPayment({
      provider: selectedWalletProvider,
      merchant: walletMerchantInput.value.trim() || "不明な店舗",
      amount: walletAmountInput.value || 0,
      memo: "Wallet取引トリガー",
      source: "Wallet自動",
    }),
  );
});

qrForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addPayment(createPayment(parseQrText(qrTextInput.value)));
});

document.querySelector("#clearButton").addEventListener("click", () => {
  ledger = [];
  duplicateCount = 0;
  duplicateCountLabel.textContent = "0";
  renderLedger();
  pulse(connectionState, "ログをクリアしました");
});

document.querySelector("#walletDemoButton").addEventListener("click", () => {
  const event = walletEvents[Math.floor(Math.random() * walletEvents.length)];
  addPayment(createPayment({ ...event, memo: "Wallet取引トリガー", source: "Wallet自動" }));
});

document.querySelector("#importButton").addEventListener("click", () => {
  const rows = document
    .querySelector("#csvInput")
    .value.split(/\n+/)
    .map((line) => line.split(",").map((cell) => cell.trim()))
    .filter((row) => row.length >= 3);

  rows.forEach(([provider, merchant, amount, category]) => {
    addPayment(
      createPayment({
        provider,
        merchant,
        amount: Number(amount),
        category,
        memo: "CSV明細",
        source: "明細インポート",
      }),
    );
  });
});

document.querySelector("#saveVaultButton").addEventListener("click", saveVault);
document.querySelector("#loadVaultButton").addEventListener("click", loadVault);

[walletMerchantInput, walletAmountInput].forEach((input) => {
  input.addEventListener("input", updateShortcutPayload);
});

walletButtons[0].classList.add("active");
walletEvents.slice(0, 2).forEach((event) => {
  addPayment(createPayment({ ...event, memo: "Wallet取引トリガー", source: "Wallet自動" }));
});
updateShortcutPayload();
receiveShortcutParams();
registerServiceWorker();
