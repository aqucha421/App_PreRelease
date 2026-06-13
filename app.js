const formatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

const APP_VERSION = "v0.9.7";

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

const paymentTemplates = [
  { id: "quicpay", label: "QUICPay / Apple Pay", provider: "QUICPay", merchant: "コンビニ 渋谷三丁目", amount: 680, source: "wallet", note: "Apple Walletの取引トリガー向け。カード名、店舗名、金額をURLへ差し込みます。" },
  { id: "id", label: "iD / Apple Pay", provider: "iD", merchant: "スーパー 中目黒", amount: 2310, source: "wallet", note: "iDタッチ決済向け。Walletを通らない物理カード決済は拾えません。" },
  { id: "suica", label: "Suica / PASMO", provider: "Suica", merchant: "JR 新宿駅", amount: 198, source: "wallet", note: "交通系IC向け。駅名や利用先が取れない場合は確認待ちにします。" },
  { id: "paypay", label: "PayPay通知文", provider: "PayPay", merchant: "ドラッグストア 青山", amount: 1420, source: "qr", note: "PayPayは直接連携ではなく、通知文やCSVから半自動入力する方針です。" },
  { id: "rakutenpay", label: "楽天ペイ通知文", provider: "楽天ペイ", merchant: "カフェ 表参道", amount: 620, source: "qr", note: "楽天ペイ通知文の貼り付けやURLテスト用テンプレートです。" },
  { id: "dbarai", label: "d払い通知文", provider: "d払い", merchant: "書店 新宿", amount: 980, source: "qr", note: "d払い通知文の半自動入力を想定したテンプレートです。" },
  { id: "aupay", label: "au PAY通知文", provider: "au PAY", merchant: "ホームセンター 世田谷", amount: 2480, source: "qr", note: "au PAY通知文の半自動入力を想定したテンプレートです。" },
];

const qrSamples = [
  { label: "PayPay", text: "PayPayで1,420円を支払いました\n店舗: ドラッグストア 青山" },
  { label: "楽天ペイ", text: "楽天ペイ お支払い完了\nご利用金額 620円\n加盟店: カフェ 表参道" },
  { label: "d払い", text: "d払い ご利用のお知らせ\n支払金額: 980円\nご利用先: 書店 新宿" },
  { label: "au PAY", text: "au PAYでお支払いしました\n金額 2,480円\nお店: ホームセンター 世田谷" },
  { label: "メルペイ", text: "メルペイ決済が完了しました\n利用先: コンビニ 恵比寿\n支払い金額 540円" },
];

const onboardingItems = [
  { id: "refresh", title: "最新版に更新", detail: "古いキャッシュを消して、表示されているバージョンが最新か確認します。" },
  { id: "fixed-url", title: "固定URLで1件追加", detail: "ショートカット診断のテストURLから、受信履歴と明細が増えることを確認します。" },
  { id: "home", title: "ホーム画面に追加", detail: "Safariの共有からホーム画面へ追加し、通常のアプリのように起動できる状態にします。" },
  { id: "vault", title: "暗号化保存を有効化", detail: "8文字以上のパスフレーズで保存し、端末内の明細を暗号化した保管に切り替えます。" },
  { id: "backup", title: "JSONバックアップを取る", detail: "端末紛失や機種変更に備えて、公開リポジトリではなく自分の安全な場所へ保存します。" },
  { id: "production", title: "本番ショートカットを準備", detail: "差し替えURLと手順をコピーし、PayPayやWallet用のショートカットへ設定します。" },
];

const preflightItems = [
  { id: "pages", title: "GitHub Pages URLで開ける", detail: "github.comのファイル画面ではなく、https://ユーザー名.github.io/リポジトリ名/ をSafariで開きます。" },
  { id: "home", title: "ホーム画面に追加できる", detail: "Safariの共有ボタンからホーム画面に追加し、Auto Ledgerのアイコンで起動できることを確認します。" },
  { id: "fixed-url", title: "固定URLテストで1件追加される", detail: "実機設定ガイドの固定URLでテストし、ショートカット診断の最終受信が更新されることを確認します。" },
  { id: "shortcut", title: "ショートカットから1件追加される", detail: "Wallet取引オートメーションで、まず固定値URLを開く構成にして記録できるか確認します。" },
  { id: "vault", title: "暗号化保存と復元ができる", detail: "パスフレーズで保存し、再読み込み後に同じパスフレーズで復元できることを確認します。" },
  { id: "backup", title: "JSONバックアップを取得できる", detail: "JSONバックアップを出力し、公開リポジトリには置かないことを確認します。" },
];

const issueChecks = [
  { id: "https", label: "公開URLがHTTPS", pass: () => location.protocol === "https:" || location.hostname === "127.0.0.1" || location.hostname === "localhost", fix: "GitHubのファイル画面ではなく、GitHub PagesのURLをSafariで開きます。" },
  { id: "service-worker", label: "オフライン更新機能が使える", pass: () => "serviceWorker" in navigator, fix: "古いiOSやプライベートブラウズでは動かない場合があります。Safariの通常タブで開き直します。" },
  { id: "storage", label: "端末内保存が使える", pass: () => { try { localStorage.setItem("auto-ledger-selfcheck", "ok"); localStorage.removeItem("auto-ledger-selfcheck"); return true; } catch { return false; } }, fix: "Safariのプライベートブラウズを避け、空き容量やサイトデータ制限を確認します。" },
  { id: "test-url", label: "固定値テストURLが生成済み", pass: () => Boolean(testUrlInput?.value && testUrlInput.value.includes("amount=")), fix: "店舗名または金額欄を一度編集して、テストURLを再生成します。" },
  { id: "intake", label: "受信履歴がある", pass: () => loadIntakeHistory().length > 0, fix: "まず「テスト追加」か「固定URLでテスト」を押して、アプリ側だけで追加されるか見ます。" },
];

let selectedWalletProvider = "QUICPay";
let ledger = [];
let duplicateCount = 0;
let merchantCategoryMemory = {};
let unlockedPassphrase = "";
let autoSaveTimer = 0;
const debugMode = new URLSearchParams(window.location.search).get("debug") === "1";
const localStateKey = debugMode ? "auto-ledger-debug-state" : "auto-ledger-local-state";
const budgetStateKey = "auto-ledger-category-budgets";
const customRuleStateKey = "auto-ledger-custom-category-rules";
const sponsorStateKey = "auto-ledger-sponsor-visible";
let categoryBudgets = {};
let customCategoryRules = [];
let ledgerFilter = "all";

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
const lastIntakeStatus = document.querySelector("#lastIntakeStatus");
const autoSaveState = document.querySelector("#autoSaveState");
const testUrlInput = document.querySelector("#testUrlInput");
const appVersionLabel = document.querySelector("#appVersionLabel");
const intakeHistoryList = document.querySelector("#intakeHistoryList");
const paymentTemplateSelect = document.querySelector("#paymentTemplateSelect");
const templateNote = document.querySelector("#templateNote");
const wizardUrlOutput = document.querySelector("#wizardUrlOutput");
const monthlyInsight = document.querySelector("#monthlyInsight");
const monthlyDetailGrid = document.querySelector("#monthlyDetailGrid");
const topCategoryList = document.querySelector("#topCategoryList");
const dataStatus = document.querySelector("#dataStatus");
const budgetEditor = document.querySelector("#budgetEditor");
const budgetAlertList = document.querySelector("#budgetAlertList");
const qrSampleButtons = document.querySelector("#qrSampleButtons");
const ruleForm = document.querySelector("#ruleForm");
const ruleKeywordInput = document.querySelector("#ruleKeywordInput");
const ruleCategorySelect = document.querySelector("#ruleCategorySelect");
const customRuleList = document.querySelector("#customRuleList");
const importJsonInput = document.querySelector("#importJsonInput");
const sponsorToggle = document.querySelector("#sponsorToggle");
const sponsorSlot = document.querySelector("#sponsorSlot");
const setupGuideUrl = document.querySelector("#setupGuideUrl");
const issueChecklist = document.querySelector("#issueChecklist");
const selfCheckStatus = document.querySelector("#selfCheckStatus");
const productionShortcutUrl = document.querySelector("#productionShortcutUrl");
const productionShortcutStatus = document.querySelector("#productionShortcutStatus");
const preflightList = document.querySelector("#preflightList");
const preflightProgress = document.querySelector("#preflightProgress");
const preflightStatus = document.querySelector("#preflightStatus");
const onboardingList = document.querySelector("#onboardingList");
const onboardingProgress = document.querySelector("#onboardingProgress");
const onboardingStatus = document.querySelector("#onboardingStatus");
const releaseReadinessLabel = document.querySelector("#releaseReadinessLabel");
const releaseScoreBox = document.querySelector("#releaseScoreBox");
const releaseScoreValue = document.querySelector("#releaseScoreValue");
const releaseScoreText = document.querySelector("#releaseScoreText");
const releaseReadinessList = document.querySelector("#releaseReadinessList");
const releaseReadinessStatus = document.querySelector("#releaseReadinessStatus");
const flowCheckSummary = document.querySelector("#flowCheckSummary");
const flowCheckList = document.querySelector("#flowCheckList");
const flowCheckStatus = document.querySelector("#flowCheckStatus");
const packageSummary = document.querySelector("#packageSummary");
const packageStepList = document.querySelector("#packageStepList");
const packageStatus = document.querySelector("#packageStatus");
const publishSummary = document.querySelector("#publishSummary");
const publishCheckList = document.querySelector("#publishCheckList");
const publishStatus = document.querySelector("#publishStatus");
const auditSummary = document.querySelector("#auditSummary");
const auditCheckList = document.querySelector("#auditCheckList");
const auditStatus = document.querySelector("#auditStatus");
const pushSummary = document.querySelector("#pushSummary");
const pushPrepList = document.querySelector("#pushPrepList");
const pushPrepStatus = document.querySelector("#pushPrepStatus");
const finalPushSummary = document.querySelector("#finalPushSummary");
const finalPushList = document.querySelector("#finalPushList");
const finalPushStatus = document.querySelector("#finalPushStatus");
const feedbackForm = document.querySelector("#feedbackForm");
const feedbackTypeInput = document.querySelector("#feedbackTypeInput");
const feedbackPriorityInput = document.querySelector("#feedbackPriorityInput");
const feedbackNoteInput = document.querySelector("#feedbackNoteInput");
const feedbackList = document.querySelector("#feedbackList");
const feedbackCountLabel = document.querySelector("#feedbackCountLabel");
const feedbackStatus = document.querySelector("#feedbackStatus");
const publicUrlInput = document.querySelector("#publicUrlInput");
const opsGrid = document.querySelector("#opsGrid");
const opsHealthLabel = document.querySelector("#opsHealthLabel");
const opsStatus = document.querySelector("#opsStatus");

const preflightStateKey = "auto-ledger-preflight-state";
const opsStateKey = "auto-ledger-ops-state";
const onboardingStateKey = "auto-ledger-onboarding-state";
const feedbackStateKey = "auto-ledger-feedback-state";
function inferCategory(text, fallback) {
  if (fallback && categories.includes(fallback)) return fallback;
  const customRule = customCategoryRules.find((rule) => text.includes(rule.keyword));
  if (customRule) return customRule.category;
  const remembered = Object.entries(merchantCategoryMemory).find(([merchant]) => text.includes(merchant));
  if (remembered) return remembered[1];
  const rule = categoryRules.find((item) => item.match.test(text));
  return rule ? rule.category : "未分類";
}

function createPayment({ provider, merchant, amount, memo = "", category, source, time }) {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : provider + "-" + merchant + "-" + amount + "-" + Date.now(),
    provider,
    merchant,
    amount: Number(amount),
    memo,
    category: inferCategory(merchant + " " + memo, category),
    source,
    time: time ? new Date(time) : new Date(),
  };
}

function addPayment(payment) {
  const duplicate = ledger.some(
    (item) => item.provider === payment.provider && item.merchant === payment.merchant && item.amount === payment.amount,
  );
  if (duplicate) {
    duplicateCount += 1;
    duplicateCountLabel.textContent = duplicateCount;
    pulse(connectionState, "重複を除外しました");
    return;
  }
  ledger = [payment, ...ledger].slice(0, 30);
  pulse(connectionState, payment.source + "から登録しました");
  renderLedger();
  saveLocalState();
  queueEncryptedAutoSave();
}

function renderLedger() {
  ledgerList.replaceChildren();
  const visibleLedger = ledgerFilter === "uncategorized" ? ledger.filter((item) => item.category === "未分類") : ledger;
  visibleLedger.forEach((item) => {
    const row = template.content.firstElementChild.cloneNode(true);
    row.dataset.id = item.id;
    row.querySelector(".provider-badge").textContent = shortProvider(item.provider);
    row.querySelector(".merchant-name").textContent = item.merchant;
    row.querySelector(".memo").textContent = item.provider + " / " + item.source + " / " + (item.memo || "メモなし") + " / " + formatTime(item.time);
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
  if (!visibleLedger.length) {
    const empty = document.createElement("li");
    empty.className = "ledger-empty";
    empty.textContent = ledgerFilter === "uncategorized" ? "未分類の取引はありません" : "取引がありません";
    ledgerList.append(empty);
  }
  updateStats();
  updateShortcutPayload();
}

function updateCategory(id, category) {
  const item = ledger.find((entry) => entry.id === id);
  if (!item) return;
  item.category = category;
  if (category !== "未分類") merchantCategoryMemory[item.merchant] = category;
  pulse(connectionState, "カテゴリを学習しました");
  renderLedger();
  saveLocalState();
  queueEncryptedAutoSave();
}

function updateStats() {
  const total = ledger.reduce((sum, item) => sum + item.amount, 0);
  const needsReview = ledger.filter((item) => item.category === "未分類").length;
  const classified = ledger.length ? Math.round(((ledger.length - needsReview) / ledger.length) * 100) : 0;
  monthTotal.textContent = formatter.format(total);
  autoCount.textContent = ledger.length + "件";
  reviewCount.textContent = needsReview;
  classifiedRate.textContent = classified + "%";
  renderCategorySummary(total);
  renderMonthlyReport(total, needsReview);
  renderBudgetAlerts();
}

function renderCategorySummary(total) {
  categorySummary.replaceChildren();
  const sums = categories.map((category) => ({
    category,
    amount: ledger.filter((item) => item.category === category).reduce((sum, item) => sum + item.amount, 0),
  })).filter((item) => item.amount > 0);
  if (!sums.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "取引が入るとカテゴリ別に集計します。";
    categorySummary.append(empty);
    return;
  }
  sums.forEach((item) => {
    const row = document.createElement("div");
    row.className = "category-row";
    const percent = total ? Math.round((item.amount / total) * 100) : 0;
    row.innerHTML = '<div><strong>' + item.category + '</strong><span>' + formatter.format(item.amount) + ' / ' + percent + '%</span></div><meter min="0" max="100" value="' + percent + '"></meter>';
    categorySummary.append(row);
  });
}

function categoryTotalsForReport() {
  return categories.map((category) => ({
    category,
    amount: ledger.filter((item) => item.category === category).reduce((sum, item) => sum + item.amount, 0),
    count: ledger.filter((item) => item.category === category).length,
  })).filter((item) => item.amount > 0).sort((a, b) => b.amount - a.amount);
}

function renderMonthlyReport(total, needsReview) {
  if (!monthlyInsight || !topCategoryList) return;
  const ranked = categoryTotalsForReport();
  topCategoryList.replaceChildren();
  if (monthlyDetailGrid) monthlyDetailGrid.replaceChildren();
  if (!ledger.length) {
    monthlyInsight.innerHTML = "<strong>まだ取引がありません</strong><span>ショートカットURLやQR通知文で追加すると、ここに月次レポートが出ます。</span>";
    renderMonthlyDetails([]);
    return;
  }
  const top = ranked[0];
  const avg = Math.round(total / ledger.length);
  const warningCount = budgetWarnings().length;
  monthlyInsight.innerHTML = '<strong>' + formatter.format(total) + '</strong><span>' + ledger.length + '件 / 平均 ' + formatter.format(avg) + '。一番大きいカテゴリは ' + top.category + ' です。確認待ちは ' + needsReview + '件、予算注意は ' + warningCount + '件です。</span>';
  renderMonthlyDetails([
    { label: "未分類", value: needsReview + "件" },
    { label: "予算残額", value: budgetRemainingLabel() },
    { label: "トップ店舗", value: topMerchantLabel() },
    { label: "最大支出", value: largestTransactionLabel() },
  ]);
  ranked.slice(0, 4).forEach((item) => {
    const row = document.createElement("div");
    row.className = "top-category-item";
    row.innerHTML = '<div><strong>' + item.category + '</strong><span>' + item.count + '件</span></div><strong>' + formatter.format(item.amount) + '</strong>';
    topCategoryList.append(row);
  });
}

function renderMonthlyDetails(items) {
  if (!monthlyDetailGrid) return;
  monthlyDetailGrid.replaceChildren();
  if (!items.length) {
    items = [
      { label: "未分類", value: "0件" },
      { label: "予算残額", value: "未設定" },
      { label: "トップ店舗", value: "-" },
      { label: "最大支出", value: "-" },
    ];
  }
  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "monthly-detail";
    card.innerHTML = '<span>' + item.label + '</span><strong>' + item.value + '</strong>';
    monthlyDetailGrid.append(card);
  });
}

function budgetRemainingLabel() {
  const totals = categoryTotalsForReport();
  const budgetEntries = Object.entries(categoryBudgets);
  if (!budgetEntries.length) return "未設定";
  const remaining = budgetEntries.reduce((sum, [category, budget]) => {
    const used = totals.find((item) => item.category === category)?.amount || 0;
    return sum + Number(budget) - used;
  }, 0);
  return remaining >= 0 ? formatter.format(remaining) : "-" + formatter.format(Math.abs(remaining));
}

function topMerchantLabel() {
  if (!ledger.length) return "-";
  const totals = new Map();
  ledger.forEach((item) => totals.set(item.merchant, (totals.get(item.merchant) || 0) + item.amount));
  const [merchant, amount] = [...totals.entries()].sort((a, b) => b[1] - a[1])[0];
  return merchant + " " + formatter.format(amount);
}

function largestTransactionLabel() {
  if (!ledger.length) return "-";
  const item = [...ledger].sort((a, b) => b.amount - a.amount)[0];
  return item.merchant + " " + formatter.format(item.amount);
}

function setupBudgetEditor() {
  if (!budgetEditor) return;
  loadBudgets();
  budgetEditor.replaceChildren();
  categories.filter((category) => category !== "未分類").forEach((category) => {
    const row = document.createElement("label");
    row.className = "budget-row";
    row.innerHTML = '<strong>' + category + '</strong><input type="number" min="0" step="100" inputmode="numeric" data-budget-category="' + category + '" placeholder="未設定" />';
    const input = row.querySelector("input");
    input.value = categoryBudgets[category] || "";
    input.addEventListener("input", () => {
      const value = Number(input.value || 0);
      if (value > 0) categoryBudgets[category] = value;
      else delete categoryBudgets[category];
      saveBudgets();
      updateStats();
    });
    budgetEditor.append(row);
  });
}

function setupRuleEditor() {
  if (!ruleForm || !ruleCategorySelect || !customRuleList) return;
  loadCustomRules();
  ruleCategorySelect.replaceChildren();
  categories.filter((category) => category !== "未分類").forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    ruleCategorySelect.append(option);
  });
  ruleForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addCustomRule(ruleKeywordInput.value.trim(), ruleCategorySelect.value);
  });
  renderCustomRules();
}

function addCustomRule(keyword, category) {
  if (!keyword) {
    setDataStatus("キーワードを入力してください", true);
    return;
  }
  customCategoryRules = [
    { id: crypto.randomUUID ? crypto.randomUUID() : keyword + "-" + Date.now(), keyword, category },
    ...customCategoryRules.filter((rule) => rule.keyword !== keyword),
  ].slice(0, 30);
  ruleKeywordInput.value = "";
  saveCustomRules();
  renderCustomRules();
  reclassifyUncategorized();
  setDataStatus("分類ルールを追加しました", false);
}

function removeCustomRule(id) {
  customCategoryRules = customCategoryRules.filter((rule) => rule.id !== id);
  saveCustomRules();
  renderCustomRules();
  setDataStatus("分類ルールを削除しました", false);
}

function renderCustomRules() {
  if (!customRuleList) return;
  customRuleList.replaceChildren();
  if (!customCategoryRules.length) {
    const empty = document.createElement("div");
    empty.className = "budget-alert";
    empty.textContent = "まだ追加ルールはありません。";
    customRuleList.append(empty);
    return;
  }
  customCategoryRules.forEach((rule) => {
    const row = document.createElement("div");
    row.className = "rule-item";
    row.innerHTML = '<div><strong>' + rule.keyword + '</strong><span>' + rule.category + '</span></div><button type="button">削除</button>';
    row.querySelector("button").addEventListener("click", () => removeCustomRule(rule.id));
    customRuleList.append(row);
  });
}

function reclassifyUncategorized() {
  let changed = false;
  ledger = ledger.map((item) => {
    if (item.category !== "未分類") return item;
    const category = inferCategory(`${item.merchant} ${item.memo}`);
    if (category === "未分類") return item;
    changed = true;
    return { ...item, category };
  });
  if (changed) {
    renderLedger();
    saveLocalState();
  }
}

function loadCustomRules() {
  try {
    customCategoryRules = JSON.parse(localStorage.getItem(customRuleStateKey) || "[]");
  } catch {
    customCategoryRules = [];
  }
}

function saveCustomRules() {
  localStorage.setItem(customRuleStateKey, JSON.stringify(customCategoryRules));
}

function setupSponsorControls() {
  if (!sponsorToggle || !sponsorSlot) return;
  const saved = localStorage.getItem(sponsorStateKey);
  sponsorToggle.checked = saved === null ? true : saved === "true";
  applySponsorVisibility();
  sponsorToggle.addEventListener("change", () => {
    localStorage.setItem(sponsorStateKey, String(sponsorToggle.checked));
    applySponsorVisibility();
    setDataStatus(sponsorToggle.checked ? "スポンサー枠を表示します" : "スポンサー枠を非表示にしました", false);
  });
}

function applySponsorVisibility() {
  sponsorSlot?.classList.toggle("hidden", !sponsorToggle.checked);
}

function budgetWarnings() {
  return categoryTotalsForReport()
    .map((item) => {
      const budget = Number(categoryBudgets[item.category] || 0);
      if (!budget) return null;
      return { ...item, budget, ratio: item.amount / budget };
    })
    .filter(Boolean)
    .filter((item) => item.ratio >= 0.8)
    .sort((a, b) => b.ratio - a.ratio);
}

function renderBudgetAlerts() {
  if (!budgetAlertList) return;
  budgetAlertList.replaceChildren();
  const warnings = budgetWarnings();

  if (!Object.keys(categoryBudgets).length) {
    const empty = document.createElement("div");
    empty.className = "budget-alert";
    empty.textContent = "予算を入れると、80%到達や超過をここで知らせます。";
    budgetAlertList.append(empty);
    return;
  }

  if (!warnings.length) {
    const ok = document.createElement("div");
    ok.className = "budget-alert";
    ok.textContent = "現在、予算注意はありません。";
    budgetAlertList.append(ok);
    return;
  }

  warnings.forEach((item) => {
    const alert = document.createElement("div");
    alert.className = `budget-alert ${item.ratio >= 1 ? "warning" : ""}`;
    const percent = Math.round(item.ratio * 100);
    const remaining = item.budget - item.amount;
    alert.textContent =
      item.ratio >= 1
        ? `${item.category}: 予算を${formatter.format(Math.abs(remaining))}超過しています (${percent}%)`
        : `${item.category}: 予算の${percent}%です。残り${formatter.format(remaining)}`;
    budgetAlertList.append(alert);
  });
}

function loadBudgets() {
  try {
    categoryBudgets = JSON.parse(localStorage.getItem(budgetStateKey) || "{}");
  } catch {
    categoryBudgets = {};
  }
}

function saveBudgets() {
  localStorage.setItem(budgetStateKey, JSON.stringify(categoryBudgets));
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
  const amount = extractQrAmount(text);
  const merchant = extractQrMerchant(text);
  const provider = detectQrProvider(text);
  return {
    provider,
    merchant: merchant || "確認待ちの店舗",
    amount,
    memo: "通知/レシートから抽出",
    source: "QR半自動",
  };
}

function extractQrAmount(text) {
  const patterns = [
    /(?:支払金額|支払い金額|ご利用金額|利用金額|決済金額|金額)[:：]?\s*¥?\s*([0-9,]+)\s*円?/,
    /¥\s*([0-9,]+)/,
    /([0-9,]+)\s*円/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return Number(match[1].replaceAll(",", ""));
  }
  return 0;
}

function extractQrMerchant(text) {
  const labelPattern = /(?:店舗|店名|利用先|ご利用先|加盟店|お店|支払先|支払い先)[:：]\s*(.+)/;
  const labelMatch = text.match(labelPattern);
  if (labelMatch) return cleanMerchant(labelMatch[1]);

  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const candidate = lines.find((line) => {
    if (/円|金額|支払|決済|完了|お知らせ|PayPay|楽天ペイ|d払い|au PAY|メルペイ/i.test(line)) return false;
    return line.length >= 2;
  });
  return candidate ? cleanMerchant(candidate) : "";
}

function cleanMerchant(value) {
  return value.replace(/\s+/g, " ").replace(/[。]+$/, "").trim();
}

function detectQrProvider(text) {
  if (/PayPay/i.test(text)) return "PayPay";
  if (/楽天ペイ|Rakuten Pay/i.test(text)) return "楽天ペイ";
  if (/d払い|ｄ払い/i.test(text)) return "d払い";
  if (/au PAY|auペイ/i.test(text)) return "au PAY";
  if (/メルペイ/i.test(text)) return "メルペイ";
  return "QR決済";
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
  updateTestUrl();
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

function updateTestUrl() {
  if (!testUrlInput) return;
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("provider", "QUICPay");
  url.searchParams.set("merchant", "ショートカットテスト");
  url.searchParams.set("amount", "999");
  url.searchParams.set("source", "wallet");
  testUrlInput.value = url.toString();
  if (setupGuideUrl) setupGuideUrl.value = url.toString();
}

function buildWizardUrl(template) {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("provider", template.provider);
  url.searchParams.set("merchant", template.merchant);
  url.searchParams.set("amount", String(template.amount));
  url.searchParams.set("source", template.source);
  return url.toString();
}

function buildProductionShortcutUrl() {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("provider", "{{PROVIDER}}");
  url.searchParams.set("merchant", "{{MERCHANT}}");
  url.searchParams.set("amount", "{{AMOUNT}}");
  url.searchParams.set("source", "wallet");
  return decodeURIComponent(url.toString());
}

function updateProductionShortcutUrl() {
  if (!productionShortcutUrl) return;
  productionShortcutUrl.value = buildProductionShortcutUrl();
}

function setupWizard() {
  if (!paymentTemplateSelect) return;
  paymentTemplates.forEach((template) => {
    const option = document.createElement("option");
    option.value = template.id;
    option.textContent = template.label;
    paymentTemplateSelect.append(option);
  });

  paymentTemplateSelect.addEventListener("change", updateWizard);
  document.querySelector("#copyWizardUrlButton").addEventListener("click", copyWizardUrl);
  document.querySelector("#testWizardUrlButton").addEventListener("click", () => {
    window.location.href = wizardUrlOutput.value;
  });
  document.querySelectorAll(".step-pill").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".step-pill").forEach((item) => item.classList.toggle("active", item === button));
    });
  });
  updateWizard();
  updateProductionShortcutUrl();
}

function setupQrSamples() {
  if (!qrSampleButtons) return;
  qrSampleButtons.replaceChildren();
  qrSamples.forEach((sample) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = sample.label;
    button.addEventListener("click", () => {
      qrTextInput.value = sample.text;
      pulse(connectionState, `${sample.label}サンプルを入力しました`);
    });
    qrSampleButtons.append(button);
  });
}

function updateWizard() {
  const template = paymentTemplates.find((item) => item.id === paymentTemplateSelect.value) || paymentTemplates[0];
  templateNote.textContent = template.note;
  wizardUrlOutput.value = buildWizardUrl(template);
}

async function copyWizardUrl() {
  try {
    await navigator.clipboard.writeText(wizardUrlOutput.value);
    setVaultStatus("ウィザードURLをコピーしました", false);
  } catch {
    wizardUrlOutput.select();
    setVaultStatus("コピーできない場合はURL欄を選択してください", true);
  }
}

async function copySetupGuideUrl() {
  try {
    await navigator.clipboard.writeText(setupGuideUrl.value);
    setVaultStatus("固定値テストURLをコピーしました", false);
  } catch {
    setupGuideUrl.select();
    setVaultStatus("コピーできない場合はURL欄を選択してください", true);
  }
}

async function copyProductionShortcutUrl() {
  try {
    await navigator.clipboard.writeText(productionShortcutUrl.value);
    markOnboardingStep("production");
    setProductionShortcutStatus("差し替えURLをコピーしました", false);
  } catch {
    productionShortcutUrl.select();
    setProductionShortcutStatus("コピーできない場合はURL欄を長押ししてください", true);
  }
}

async function copyProductionSteps() {
  const steps = [
    "Auto Ledger 本番ショートカット化",
    "1. 固定値URLで1件追加できることを確認",
    "2. 差し替え用URLをショートカットの「URL」アクションへ貼る",
    "3. {{PROVIDER}} をカード名または固定値へ置換",
    "4. {{MERCHANT}} を加盟店名へ置換",
    "5. {{AMOUNT}} を金額の数字だけへ置換",
    "6. 次のアクションに「URLを開く」を追加",
    "7. ショートカット診断の最終受信を確認",
    "",
    productionShortcutUrl?.value || buildProductionShortcutUrl(),
  ].join("\n");
  try {
    await navigator.clipboard.writeText(steps);
    markOnboardingStep("production");
    setProductionShortcutStatus("本番化手順をコピーしました", false);
  } catch {
    setProductionShortcutStatus("コピーできない場合は画面の手順を見ながら設定してください", true);
  }
}

function setProductionShortcutStatus(text, isError) {
  if (!productionShortcutStatus) return;
  productionShortcutStatus.textContent = text;
  productionShortcutStatus.classList.toggle("error", isError);
}

function escapeCsv(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function ledgerToCsv() {
  const header = ["date", "provider", "merchant", "amount", "category", "source", "memo"];
  const rows = ledger.map((item) => [
    item.time.toISOString(),
    item.provider,
    item.merchant,
    item.amount,
    item.category,
    item.source,
    item.memo,
  ]);
  return [header, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n");
}

function downloadText(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportCsv() {
  if (!ledger.length) {
    setDataStatus("出力する取引がありません", true);
    return;
  }
  downloadText(`auto-ledger-${dateStamp()}.csv`, ledgerToCsv(), "text/csv;charset=utf-8");
  setDataStatus("CSVを書き出しました", false);
}

function exportJsonBackup() {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    privacy: "local-export",
    ledger: ledger.map((item) => ({ ...item, time: item.time.toISOString() })),
    merchantCategoryMemory,
    categoryBudgets,
    customCategoryRules,
    feedbackItems: loadFeedbackItems(),
  };
  downloadText(
    `auto-ledger-backup-${dateStamp()}.json`,
    JSON.stringify(payload, null, 2),
    "application/json;charset=utf-8",
  );
  markOpsEvent("lastBackupAt");
  markOnboardingStep("backup");
  setDataStatus("JSONバックアップを書き出しました", false);
}

function chooseJsonBackup() {
  importJsonInput?.click();
}

async function importJsonBackup(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const payload = JSON.parse(text);
    restoreBackupPayload(payload);
    setDataStatus("JSONバックアップから復元しました", false);
  } catch (error) {
    setDataStatus("JSON復元に失敗しました。ファイル形式を確認してください", true);
  } finally {
    event.target.value = "";
  }
}

function restoreBackupPayload(payload) {
  if (!payload || !Array.isArray(payload.ledger)) {
    throw new Error("Invalid backup payload");
  }

  ledger = payload.ledger.map((item) =>
    createPayment({
      provider: String(item.provider || "QR決済"),
      merchant: String(item.merchant || "不明な店舗"),
      amount: Number(item.amount || 0),
      memo: String(item.memo || ""),
      category: categories.includes(item.category) ? item.category : undefined,
      source: String(item.source || "復元"),
      time: item.time || item.occurredAt || new Date().toISOString(),
    }),
  );
  merchantCategoryMemory = payload.merchantCategoryMemory || {};
  categoryBudgets = payload.categoryBudgets || {};
  customCategoryRules = Array.isArray(payload.customCategoryRules) ? payload.customCategoryRules : [];
  if (Array.isArray(payload.feedbackItems)) {
    saveFeedbackItems(payload.feedbackItems);
  }
  duplicateCount = 0;
  duplicateCountLabel.textContent = "0";

  saveBudgets();
  saveCustomRules();
  setupBudgetEditor();
  setupRuleEditor();
  renderFeedback();
  renderLedger();
  saveLocalState();
  queueEncryptedAutoSave();
}

async function copyMonthlySummary() {
  const total = ledger.reduce((sum, item) => sum + item.amount, 0);
  const ranked = categoryTotalsForReport();
  const lines = [
    "Auto Ledger 月次サマリー",
    `合計: ${formatter.format(total)}`,
    `件数: ${ledger.length}件`,
    "カテゴリ:",
    ...ranked.map((item) => `- ${item.category}: ${formatter.format(item.amount)} (${item.count}件)`),
  ];
  try {
    await navigator.clipboard.writeText(lines.join("\n"));
    setDataStatus("月次サマリーをコピーしました", false);
  } catch {
    setDataStatus("コピーできませんでした", true);
  }
}

function resetDebugData() {
  if (!debugMode) {
    setDataStatus("デバッグ画面でのみ削除できます", true);
    return;
  }
  localStorage.removeItem("auto-ledger-debug-state");
  localStorage.removeItem("auto-ledger-last-intake");
  ledger = [];
  duplicateCount = 0;
  merchantCategoryMemory = {};
  duplicateCountLabel.textContent = "0";
  renderLedger();
  setDataStatus("デバッグデータを削除しました", false);
}

function setDataStatus(text, isError) {
  if (!dataStatus) return;
  dataStatus.textContent = text;
  dataStatus.classList.toggle("error", isError);
}

function dateStamp() {
  return new Date().toISOString().slice(0, 10);
}

function vaultPayload() {
  return {
    version: 1,
    exported_at: new Date().toISOString(),
    ledger: ledger.map((item) => ({ ...item, time: item.time.toISOString() })),
    merchantCategoryMemory,
    categoryBudgets,
    customCategoryRules,
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

async function saveVault(options = {}) {
  const passphrase = passphraseInput.value || unlockedPassphrase;
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
  unlockedPassphrase = passphrase;
  privacyState.textContent = "暗号化保存済み";
  updateAutoSaveState();
  markOnboardingStep("vault");
  if (!options.silent) {
    setVaultStatus("解除済み。以後は自動保存します", false);
  } else {
    setVaultStatus(`自動保存しました ${formatTime(new Date())}`, false);
  }
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
    categoryBudgets = payload.categoryBudgets || {};
    customCategoryRules = payload.customCategoryRules || [];
    saveBudgets();
    saveCustomRules();
    setupBudgetEditor();
    setupRuleEditor();
    unlockedPassphrase = passphraseInput.value;
    privacyState.textContent = "暗号化保存済み";
    updateAutoSaveState();
    setVaultStatus("復元しました。以後は自動保存します", false);
    renderLedger();
  } catch (error) {
    setVaultStatus("復元できません。パスフレーズを確認してください", true);
  }
}

function setVaultStatus(text, isError) {
  vaultStatus.textContent = text;
  vaultStatus.classList.toggle("error", isError);
}

function saveLocalState() {
  if (!localStateKey) return;
  localStorage.setItem(
    localStateKey,
    JSON.stringify({
      ledger: ledger.map((item) => ({ ...item, time: item.time.toISOString() })),
      duplicateCount,
      merchantCategoryMemory,
      savedAt: new Date().toISOString(),
    }),
  );
}

function loadLocalState() {
  if (!localStateKey) return false;
  const raw = localStorage.getItem(localStateKey);
  if (!raw) return false;
  try {
    const state = JSON.parse(raw);
    ledger = (state.ledger || []).map((item) => ({ ...item, time: new Date(item.time) }));
    duplicateCount = Number(state.duplicateCount || 0);
    merchantCategoryMemory = state.merchantCategoryMemory || {};
    duplicateCountLabel.textContent = duplicateCount;
    renderLedger();
    return true;
  } catch {
    localStorage.removeItem(localStateKey);
    return false;
  }
}

function updateAutoSaveState() {
  if (!autoSaveState) return;
  autoSaveState.textContent = unlockedPassphrase ? "自動保存ON" : "未解除";
}

function queueEncryptedAutoSave() {
  if (!unlockedPassphrase) return;
  window.clearTimeout(autoSaveTimer);
  autoSaveTimer = window.setTimeout(() => {
    saveVault({ silent: true });
  }, 350);
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
  if (lastIntakeStatus) {
    lastIntakeStatus.textContent = `${provider} ${formatter.format(amount)}`;
  }
  saveIntakeHistory({ provider, merchant, amount, source, receivedAt: new Date().toISOString() });

  const cleanUrl = new URL(window.location.href);
  cleanUrl.search = "";
  window.history.replaceState({}, document.title, cleanUrl.toString());
}

function restoreLastIntakeStatus() {
  if (!lastIntakeStatus) return;
  const history = loadIntakeHistory();
  const item = history[0];
  if (!item) {
    renderIntakeHistory();
    return;
  }
  lastIntakeStatus.textContent = `${item.provider} ${formatter.format(item.amount)}`;
  renderIntakeHistory();
}

function loadIntakeHistory() {
  const raw = localStorage.getItem("auto-ledger-intake-history");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem("auto-ledger-intake-history");
    return [];
  }
}

function saveIntakeHistory(item) {
  const history = [item, ...loadIntakeHistory()].slice(0, 8);
  localStorage.setItem("auto-ledger-intake-history", JSON.stringify(history));
  localStorage.setItem("auto-ledger-last-intake", JSON.stringify(item));
  markOnboardingStep("fixed-url");
  renderIntakeHistory();
}

function renderIntakeHistory() {
  if (!intakeHistoryList) return;
  intakeHistoryList.replaceChildren();
  const history = loadIntakeHistory();
  if (!history.length) {
    const empty = document.createElement("li");
    empty.textContent = "まだ受信していません";
    intakeHistoryList.append(empty);
    return;
  }
  history.forEach((item) => {
    const row = document.createElement("li");
    row.textContent = `${formatTime(new Date(item.receivedAt))} ${item.provider} ${formatter.format(item.amount)} / ${item.merchant}`;
    intakeHistoryList.append(row);
  });
}

function runIssueChecks() {
  const results = issueChecks.map((check) => {
    let ok = false;
    try {
      ok = Boolean(check.pass());
    } catch {
      ok = false;
    }
    return { ...check, ok };
  });
  renderIssueChecklist(results);
  return results;
}

function renderIssueChecklist(results = runIssueChecks()) {
  if (!issueChecklist) return;
  issueChecklist.replaceChildren();
  results.forEach((check) => {
    const row = document.createElement("li");
    row.className = check.ok ? "issue-pass" : "issue-fail";
    row.innerHTML = `
      <strong>${check.ok ? "OK" : "確認"} · ${check.label}</strong>
      <span>${check.ok ? "問題なさそうです" : check.fix}</span>
    `;
    issueChecklist.append(row);
  });

  const failCount = results.filter((item) => !item.ok).length;
  if (selfCheckStatus) {
    selfCheckStatus.textContent = failCount ? `確認が必要な項目が${failCount}件あります` : "自己診断はOKです";
    selfCheckStatus.classList.toggle("error", failCount > 0);
  }
}

function debugReportPayload() {
  const params = new URLSearchParams(window.location.search);
  const preflight = loadPreflightState();
  const onboarding = loadOnboardingState();
  const issueResults = runIssueChecks();
  const feedbackItems = loadFeedbackItems();
  const openFeedbackItems = feedbackItems.filter((item) => !item.resolved);
  return {
    appVersion: APP_VERSION,
    url: `${location.origin}${location.pathname}`,
    protocol: location.protocol,
    hasShortcutParams: ["provider", "merchant", "amount", "source"].some((key) => params.has(key)),
    ledgerCount: ledger.length,
    duplicateCount,
    uncategorizedCount: ledger.filter((item) => item.category === "未分類").length,
    intakeHistoryCount: loadIntakeHistory().length,
    feedbackOpenCount: openFeedbackItems.length,
    feedbackHighCount: openFeedbackItems.filter((item) => item.priority === "high").length,
    lastIntakeStatus: lastIntakeStatus?.textContent || "",
    autoSaveState: autoSaveState?.textContent || "",
    onboardingDone: onboarding.checked.length,
    onboardingTotal: onboardingItems.length,
    preflightDone: preflight.checked.length,
    preflightTotal: preflightItems.length,
    publicUrlMemo: preflight.publicUrl || "",
    serviceWorkerSupported: "serviceWorker" in navigator,
    cacheSupported: "caches" in window,
    localStorageSupported: issueResults.find((item) => item.id === "storage")?.ok || false,
    issueChecks: issueResults.map((item) => ({ id: item.id, ok: item.ok })),
  };
}

async function copyDebugReport() {
  const report = debugReportPayload();
  const text = [
    "Auto Ledger debug report",
    JSON.stringify(report, null, 2),
    "",
    "※店舗名・金額などの明細本文は含めていません。",
  ].join("\n");
  try {
    await navigator.clipboard.writeText(text);
    setVaultStatus("デバッグ情報をコピーしました", false);
  } catch {
    setVaultStatus("コピーできない場合は画面の自己診断結果を控えてください", true);
  }
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      setVaultStatus("オフライン機能の登録に失敗しました", true);
    });
  });
}

async function refreshApp() {
  await clearAppCaches();
  markOpsEvent("lastRefreshAt");
  markOnboardingStep("refresh");
  const url = new URL(window.location.href);
  url.searchParams.set("v", Date.now().toString());
  window.location.href = url.toString();
}

async function clearAppCaches() {
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.update()));
  }
  if ("caches" in window) {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith("auto-ledger")).map((key) => caches.delete(key)));
  }
  setVaultStatus("キャッシュを削除しました", false);
}

function loadOnboardingState() {
  try {
    const saved = JSON.parse(localStorage.getItem(onboardingStateKey) || "{}");
    return {
      checked: Array.isArray(saved.checked) ? saved.checked : [],
      updatedAt: saved.updatedAt || "",
    };
  } catch {
    return { checked: [], updatedAt: "" };
  }
}

function saveOnboardingState(state) {
  localStorage.setItem(
    onboardingStateKey,
    JSON.stringify({
      ...state,
      updatedAt: new Date().toISOString(),
    }),
  );
}

function markOnboardingStep(id) {
  if (!onboardingItems.some((item) => item.id === id)) return;
  const state = loadOnboardingState();
  if (state.checked.includes(id)) return;
  state.checked = [...state.checked, id];
  saveOnboardingState(state);
  renderOnboarding();
  renderReleaseReadiness();
}

function renderOnboarding() {
  if (!onboardingList) return;
  const state = loadOnboardingState();
  const checkedIds = new Set(state.checked);
  onboardingList.replaceChildren();

  onboardingItems.forEach((item, index) => {
    const checked = checkedIds.has(item.id);
    const label = document.createElement("label");
    label.className = "onboarding-item";
    label.innerHTML = `
      <input type="checkbox" ${checked ? "checked" : ""} data-onboarding-id="${item.id}" />
      <span class="onboarding-number">${index + 1}</span>
      <span>
        <strong>${item.title}</strong>
        <small>${item.detail}</small>
      </span>
    `;
    label.querySelector("input").addEventListener("change", (event) => {
      const next = loadOnboardingState();
      const ids = new Set(next.checked);
      if (event.target.checked) {
        ids.add(item.id);
      } else {
        ids.delete(item.id);
      }
      next.checked = [...ids];
      saveOnboardingState(next);
      renderOnboarding();
      renderReleaseReadiness();
    });
    onboardingList.append(label);
  });

  const done = state.checked.length;
  if (onboardingProgress) onboardingProgress.textContent = `${done}/${onboardingItems.length}`;
  if (onboardingStatus) {
    onboardingStatus.textContent =
      done === onboardingItems.length
        ? "初回セットアップは完了です。実機で日常利用に進めます。"
        : `あと${onboardingItems.length - done}項目です`;
    onboardingStatus.classList.toggle("error", done < onboardingItems.length);
  }
}

function onboardingStepsText() {
  const state = loadOnboardingState();
  const done = new Set(state.checked);
  return [
    `Auto Ledger ${APP_VERSION} 初回セットアップ`,
    `確認日時: ${new Date().toLocaleString("ja-JP")}`,
    "",
    ...onboardingItems.map((item, index) => `${done.has(item.id) ? "[x]" : "[ ]"} ${index + 1}. ${item.title}`),
    "",
    "注意: JSONバックアップと明細データは個人情報に近いので、公開リポジトリや共有リンクには置かないでください。",
  ].join("\n");
}

async function copyOnboardingSteps() {
  try {
    await navigator.clipboard.writeText(onboardingStepsText());
    if (onboardingStatus) {
      onboardingStatus.textContent = "初回セットアップ手順をコピーしました";
      onboardingStatus.classList.remove("error");
    }
  } catch {
    if (onboardingStatus) {
      onboardingStatus.textContent = "コピーできない場合はチェックリストを画面で確認してください";
      onboardingStatus.classList.add("error");
    }
  }
}

function resetOnboarding() {
  localStorage.removeItem(onboardingStateKey);
  renderOnboarding();
  renderReleaseReadiness();
}

function loadPreflightState() {
  try {
    const saved = JSON.parse(localStorage.getItem(preflightStateKey) || "{}");
    return {
      checked: Array.isArray(saved.checked) ? saved.checked : [],
      publicUrl: typeof saved.publicUrl === "string" ? saved.publicUrl : "",
      updatedAt: saved.updatedAt || "",
    };
  } catch {
    return { checked: [], publicUrl: "", updatedAt: "" };
  }
}

function savePreflightState(state) {
  localStorage.setItem(
    preflightStateKey,
    JSON.stringify({
      ...state,
      updatedAt: new Date().toISOString(),
    }),
  );
}

function renderPreflight() {
  if (!preflightList) return;
  const state = loadPreflightState();
  preflightList.replaceChildren();
  if (publicUrlInput) publicUrlInput.value = state.publicUrl;

  preflightItems.forEach((item) => {
    const checked = state.checked.includes(item.id);
    const label = document.createElement("label");
    label.className = "preflight-item";
    label.innerHTML = `
      <input type="checkbox" ${checked ? "checked" : ""} data-preflight-id="${item.id}" />
      <span>
        <strong>${item.title}</strong>
        <small>${item.detail}</small>
      </span>
    `;
    label.querySelector("input").addEventListener("change", (event) => {
      const next = loadPreflightState();
      const ids = new Set(next.checked);
      if (event.target.checked) {
        ids.add(item.id);
      } else {
        ids.delete(item.id);
      }
      next.checked = [...ids];
      savePreflightState(next);
      renderPreflight();
      renderReleaseReadiness();
    });
    preflightList.append(label);
  });

  const done = state.checked.length;
  if (preflightProgress) preflightProgress.textContent = `${done}/${preflightItems.length}`;
  if (preflightStatus) {
    preflightStatus.textContent =
      done === preflightItems.length
        ? "実機プレリリース確認が完了しました"
        : `あと${preflightItems.length - done}項目です`;
    preflightStatus.classList.toggle("error", done < preflightItems.length);
  }
}

async function copyPreflightReport() {
  const state = loadPreflightState();
  const done = new Set(state.checked);
  const lines = [
    `Auto Ledger ${APP_VERSION} 実機プレリリース確認`,
    `公開URL: ${state.publicUrl || "未入力"}`,
    `確認日時: ${new Date().toLocaleString("ja-JP")}`,
    "",
    ...preflightItems.map((item) => `${done.has(item.id) ? "[x]" : "[ ]"} ${item.title}`),
  ];
  try {
    await navigator.clipboard.writeText(lines.join("\n"));
    if (preflightStatus) preflightStatus.textContent = "確認結果をコピーしました";
  } catch {
    if (preflightStatus) {
      preflightStatus.textContent = "コピーできない場合は公開URLメモとチェック状態を手元に控えてください";
      preflightStatus.classList.add("error");
    }
  }
}

function resetPreflight() {
  localStorage.removeItem(preflightStateKey);
  renderPreflight();
  renderReleaseReadiness();
}

function buildReleaseReadiness() {
  const onboarding = loadOnboardingState();
  const preflight = loadPreflightState();
  const ops = loadOpsState();
  const issueResults = runIssueChecks();
  const onboardingDone = new Set(onboarding.checked);
  const preflightDone = new Set(preflight.checked);
  const issueFails = issueResults.filter((item) => !item.ok);
  const openFeedbackItems = loadFeedbackItems().filter((item) => !item.resolved);
  const highFeedbackCount = openFeedbackItems.filter((item) => item.priority === "high").length;
  const backupAge = daysSince(ops.lastBackupAt);
  const refreshAge = daysSince(ops.lastRefreshAt);
  const checks = [
    {
      id: "app",
      label: "アプリ更新",
      detail: `${APP_VERSION} / cache ready`,
      ok: onboardingDone.has("refresh") || refreshAge !== null,
      blocker: false,
      fix: "最新版に更新を押して、表示バージョンを確認します。",
    },
    {
      id: "url",
      label: "公開URL",
      detail: preflight.publicUrl || "未入力",
      ok: Boolean(preflight.publicUrl) || location.protocol === "https:" || location.hostname === "127.0.0.1",
      blocker: true,
      fix: "GitHub PagesのURLを公開URLメモへ入れます。",
    },
    {
      id: "intake",
      label: "固定URL受信",
      detail: `${loadIntakeHistory().length}件`,
      ok: onboardingDone.has("fixed-url") || preflightDone.has("fixed-url") || loadIntakeHistory().length > 0,
      blocker: true,
      fix: "ショートカット診断の固定URLで1件追加します。",
    },
    {
      id: "shortcut",
      label: "本番ショートカット",
      detail: onboardingDone.has("production") || preflightDone.has("shortcut") ? "準備済み" : "未確認",
      ok: onboardingDone.has("production") || preflightDone.has("shortcut"),
      blocker: false,
      fix: "差し替えURLか手順をコピーし、ショートカットへ設定します。",
    },
    {
      id: "vault",
      label: "暗号化保存",
      detail: unlockedPassphrase ? "有効" : "未解除",
      ok: onboardingDone.has("vault") || preflightDone.has("vault") || Boolean(unlockedPassphrase),
      blocker: true,
      fix: "8文字以上のパスフレーズで解除して保存します。",
    },
    {
      id: "backup",
      label: "JSONバックアップ",
      detail: backupAge === null ? "未記録" : `${backupAge}日前`,
      ok: onboardingDone.has("backup") || preflightDone.has("backup") || (backupAge !== null && backupAge <= 7),
      blocker: false,
      fix: "JSONバックアップを取得し、安全な場所へ保存します。",
    },
    {
      id: "home",
      label: "ホーム画面追加",
      detail: onboardingDone.has("home") || preflightDone.has("home") ? "確認済み" : "手動確認待ち",
      ok: onboardingDone.has("home") || preflightDone.has("home"),
      blocker: false,
      fix: "iPhone Safariの共有からホーム画面へ追加し、手動でチェックします。",
    },
    {
      id: "self-check",
      label: "自己診断",
      detail: issueFails.length ? `${issueFails.length}件注意` : "OK",
      ok: issueFails.length === 0,
      blocker: issueFails.some((item) => ["https", "storage"].includes(item.id)),
      fix: issueFails.map((item) => item.label).join(" / ") || "問題なし",
    },
    {
      id: "feedback",
      label: "実機フィードバック",
      detail: openFeedbackItems.length ? `未解決 ${openFeedbackItems.length}件` : "未解決なし",
      ok: highFeedbackCount === 0,
      blocker: false,
      fix: `高優先度の改善メモが${highFeedbackCount}件あります。次の改善候補に回します。`,
    },
  ];
  const passed = checks.filter((item) => item.ok).length;
  const blockers = checks.filter((item) => !item.ok && item.blocker);
  const warnings = checks.filter((item) => !item.ok && !item.blocker);
  const score = Math.round((passed / checks.length) * 100);
  return { checks, score, blockers, warnings };
}

function renderReleaseReadiness() {
  if (!releaseReadinessList) return;
  const readiness = buildReleaseReadiness();
  releaseReadinessList.replaceChildren();
  readiness.checks.forEach((item) => {
    const row = document.createElement("div");
    row.className = `release-item ${item.ok ? "pass" : item.blocker ? "blocker" : "warning"}`;
    row.innerHTML = `
      <span>${item.ok ? "OK" : item.blocker ? "要対応" : "注意"}</span>
      <div>
        <strong>${item.label}</strong>
        <small>${item.ok ? item.detail : item.fix}</small>
      </div>
    `;
    releaseReadinessList.append(row);
  });

  if (releaseScoreValue) releaseScoreValue.textContent = `${readiness.score}%`;
  if (releaseScoreText) {
    releaseScoreText.textContent = readiness.blockers.length
      ? "まだ自分用プレリリース前に直す項目があります"
      : readiness.warnings.length
        ? "自分用プレリリースは可能。注意項目があります"
        : "自分用プレリリース準備OKです";
  }
  if (releaseReadinessLabel) {
    releaseReadinessLabel.textContent = readiness.blockers.length
      ? `要対応 ${readiness.blockers.length}`
      : readiness.warnings.length
        ? `注意 ${readiness.warnings.length}`
        : "OK";
  }
  if (releaseScoreBox) {
    releaseScoreBox.classList.toggle("ready", readiness.blockers.length === 0 && readiness.warnings.length === 0);
    releaseScoreBox.classList.toggle("warning", readiness.blockers.length === 0 && readiness.warnings.length > 0);
    releaseScoreBox.classList.toggle("blocker", readiness.blockers.length > 0);
  }
  if (releaseReadinessStatus) {
    releaseReadinessStatus.textContent = readiness.blockers.length
      ? "ブロッカーを解消してから実機利用に進みます"
      : readiness.warnings.length
        ? "注意項目を把握したうえで自分用利用に進めます"
        : "プレリリース最終確認は完了です";
    releaseReadinessStatus.classList.toggle("error", readiness.blockers.length > 0);
  }
}

function releaseReportText() {
  const readiness = buildReleaseReadiness();
  return [
    `Auto Ledger ${APP_VERSION} プレリリース判定`,
    `判定日時: ${new Date().toLocaleString("ja-JP")}`,
    `スコア: ${readiness.score}%`,
    `ブロッカー: ${readiness.blockers.length}件`,
    `注意: ${readiness.warnings.length}件`,
    "",
    ...readiness.checks.map((item) => {
      const status = item.ok ? "[OK]" : item.blocker ? "[要対応]" : "[注意]";
      return `${status} ${item.label} - ${item.ok ? item.detail : item.fix}`;
    }),
    "",
    "注意: このレポートには店舗名や金額などの明細本文は含めていません。",
  ].join("\n");
}

async function copyReleaseReport() {
  try {
    await navigator.clipboard.writeText(releaseReportText());
    if (releaseReadinessStatus) {
      releaseReadinessStatus.textContent = "判定レポートをコピーしました";
      releaseReadinessStatus.classList.remove("error");
    }
  } catch {
    if (releaseReadinessStatus) {
      releaseReadinessStatus.textContent = "コピーできない場合は判定カードの内容を手元に控えてください";
      releaseReadinessStatus.classList.add("error");
    }
  }
}

function buildFlowChecks() {
  const onboarding = loadOnboardingState();
  const preflight = loadPreflightState();
  const ops = loadOpsState();
  const onboardingDone = new Set(onboarding.checked);
  const preflightDone = new Set(preflight.checked);
  const feedbackItems = loadFeedbackItems();
  const backupAge = daysSince(ops.lastBackupAt);
  const hasVault = Boolean(unlockedPassphrase || localStorage.getItem("auto-ledger-vault"));
  const hasBackup = onboardingDone.has("backup") || preflightDone.has("backup") || (backupAge !== null && backupAge <= 7);
  const release = buildReleaseReadiness();
  return [
    {
      id: "url-ready",
      title: "固定URLが生成されている",
      ok: Boolean(testUrlInput?.value && testUrlInput.value.includes("amount=")),
      detail: "ショートカット診断のテストURLを開ける状態です。",
      fix: "店舗名または金額を一度編集して、テストURLを再生成します。",
    },
    {
      id: "intake-ready",
      title: "固定URLまたはテスト追加で1件記録できた",
      ok: loadIntakeHistory().length > 0 || ledger.length > 0 || onboardingDone.has("fixed-url") || preflightDone.has("fixed-url"),
      detail: "支払いを受け取って家計簿ログへ入る流れを確認済みです。",
      fix: "「テスト追加」か固定URLテストを実行して、家計簿ログが増えるか確認します。",
    },
    {
      id: "vault-ready",
      title: "暗号化保存を確認できた",
      ok: hasVault || onboardingDone.has("vault") || preflightDone.has("vault"),
      detail: "端末内の明細を暗号化保存する準備があります。",
      fix: "8文字以上のパスフレーズで「解除して保存」を押します。",
    },
    {
      id: "backup-ready",
      title: "JSONバックアップを取れる",
      ok: hasBackup,
      detail: "バックアップまたはバックアップ済み記録があります。",
      fix: "「JSONバックアップ」を押し、公開場所ではなく自分だけが開ける場所へ保存します。",
    },
    {
      id: "feedback-ready",
      title: "実機フィードバックを記録できる",
      ok: feedbackItems.length > 0,
      detail: "実機で気づいた改善メモを残せています。",
      fix: "実機フィードバックに短いテストメモを1件記録します。明細本文は入れません。",
    },
    {
      id: "release-ready",
      title: "プレリリース判定にブロッカーがない",
      ok: release.blockers.length === 0,
      detail: "自分用プレリリースへ進める状態です。",
      fix: `プレリリース判定に要対応が${release.blockers.length}件あります。上から順に解消します。`,
    },
  ];
}

function renderFlowChecks() {
  if (!flowCheckList) return;
  const checks = buildFlowChecks();
  const passed = checks.filter((item) => item.ok).length;
  flowCheckList.replaceChildren();
  checks.forEach((item) => {
    const row = document.createElement("div");
    row.className = `flow-item ${item.ok ? "pass" : "warning"}`;
    row.innerHTML = `
      <span>${item.ok ? "OK" : "確認"}</span>
      <div>
        <strong>${item.title}</strong>
        <small>${item.ok ? item.detail : item.fix}</small>
      </div>
    `;
    flowCheckList.append(row);
  });
  if (flowCheckSummary) flowCheckSummary.textContent = `${passed}/${checks.length}`;
  if (flowCheckStatus) {
    flowCheckStatus.textContent =
      passed === checks.length ? "操作フローの通し確認は完了です" : `あと${checks.length - passed}項目です`;
    flowCheckStatus.classList.toggle("error", passed < checks.length);
  }
}

function flowCheckReportText() {
  const checks = buildFlowChecks();
  const passed = checks.filter((item) => item.ok).length;
  return [
    `Auto Ledger ${APP_VERSION} 操作フロー確認`,
    `確認日時: ${new Date().toLocaleString("ja-JP")}`,
    `進捗: ${passed}/${checks.length}`,
    "",
    ...checks.map((item) => `${item.ok ? "[OK]" : "[確認]"} ${item.title} - ${item.ok ? item.detail : item.fix}`),
    "",
    "注意: このレポートには店舗名や金額などの明細本文を含めていません。",
  ].join("\n");
}

async function copyFlowCheckReport() {
  try {
    await navigator.clipboard.writeText(flowCheckReportText());
    if (flowCheckStatus) {
      flowCheckStatus.textContent = "通し確認レポートをコピーしました";
      flowCheckStatus.classList.remove("error");
    }
  } catch {
    if (flowCheckStatus) {
      flowCheckStatus.textContent = "コピーできない場合は画面の通し確認を見ながら進めてください";
      flowCheckStatus.classList.add("error");
    }
  }
}

function buildPackageSteps() {
  const preflight = loadPreflightState();
  const publicUrl = preflight.publicUrl || "GitHub Pages URL未入力";
  const flowChecks = buildFlowChecks();
  const flowPassed = flowChecks.filter((item) => item.ok).length;
  const flowReady = flowPassed === flowChecks.length;
  const release = buildReleaseReadiness();
  return [
    {
      title: "1. GitHubへpushする",
      detail: "ローカル変更をGitHubへpushし、GitHub Pagesの反映を待ちます。",
      status: "手動",
    },
    {
      title: "2. Pages URLをSafariで開く",
      detail: publicUrl,
      status: preflight.publicUrl ? "OK" : "要メモ",
    },
    {
      title: "3. iPhone側で最新版に更新",
      detail: "アプリ内の「最新版に更新」を押し、表示バージョンが " + APP_VERSION + " になることを確認します。",
      status: "確認",
    },
    {
      title: "4. 初回セットアップを進める",
      detail: "固定URLテスト、ホーム画面追加、暗号化保存、JSONバックアップ、本番ショートカット準備を確認します。",
      status: "確認",
    },
    {
      title: "5. 操作フロー確認を完了する",
      detail: "現在の通し確認は " + flowPassed + "/" + flowChecks.length + " です。",
      status: flowReady ? "OK" : "確認",
    },
    {
      title: "6. バックアップを安全な場所へ保管",
      detail: "JSONバックアップは公開リポジトリや共有リンクに置かず、自分だけが開ける場所へ保存します。",
      status: "重要",
    },
    {
      title: "7. プレリリース判定を確認",
      detail: release.blockers.length ? "要対応が " + release.blockers.length + " 件あります。" : "ブロッカーはありません。",
      status: release.blockers.length ? "要対応" : "OK",
    },
  ];
}

function renderPackageSteps() {
  if (!packageStepList) return;
  const steps = buildPackageSteps();
  const okCount = steps.filter((item) => item.status === "OK").length;
  packageStepList.replaceChildren();
  steps.forEach((item) => {
    const row = document.createElement("div");
    row.className = `package-item ${item.status === "OK" ? "pass" : item.status === "要対応" ? "blocker" : "warning"}`;
    row.innerHTML = `
      <span>${item.status}</span>
      <div>
        <strong>${item.title}</strong>
        <small>${item.detail}</small>
      </div>
    `;
    packageStepList.append(row);
  });
  if (packageSummary) packageSummary.textContent = `${okCount}/${steps.length}`;
  if (packageStatus) {
    const blockers = steps.filter((item) => item.status === "要対応").length;
    packageStatus.textContent = blockers ? "要対応項目を解消してから自分用プレリリースに進みます" : "手順パックを使ってプレリリース準備を進められます";
    packageStatus.classList.toggle("error", blockers > 0);
  }
}

function packageStepsText() {
  const steps = buildPackageSteps();
  return [
    `Auto Ledger ${APP_VERSION} 自分用プレリリース手順`,
    `作成日時: ${new Date().toLocaleString("ja-JP")}`,
    "",
    ...steps.map((item) => `[${item.status}] ${item.title}\n${item.detail}`),
    "",
    "注意: JSONバックアップと明細データは個人情報に近いため、公開場所へ置かないでください。",
  ].join("\n");
}

async function copyPackageSteps() {
  try {
    await navigator.clipboard.writeText(packageStepsText());
    if (packageStatus) {
      packageStatus.textContent = "プレリリース手順パックをコピーしました";
      packageStatus.classList.remove("error");
    }
  } catch {
    if (packageStatus) {
      packageStatus.textContent = "コピーできない場合は画面の手順パックを見ながら進めてください";
      packageStatus.classList.add("error");
    }
  }
}

function buildPublishChecks() {
  const preflight = loadPreflightState();
  const publicUrl = (preflight.publicUrl || "").trim();
  const release = buildReleaseReadiness();
  const packageSteps = buildPackageSteps();
  const packageBlockers = packageSteps.filter((item) => item.status === "要対応").length;
  const urlLooksLikePages = /^https:\/\/[^/]+\.github\.io\/.+/i.test(publicUrl);
  const urlLooksLikeGithubFile = /github\.com/i.test(publicUrl);
  const hasVaultData = Boolean(localStorage.getItem("auto-ledger-vault"));
  const hasPlainLedger = ledger.length > 0;

  return [
    {
      id: "version",
      label: "バージョン更新",
      ok: APP_VERSION === "v0.9.7",
      blocker: true,
      detail: `${APP_VERSION} / PWA cache v34`,
      fix: "index.html、app.js、sw.jsのバージョンとキャッシュ名を更新します。",
    },
    {
      id: "pages-url",
      label: "Pages URL",
      ok: urlLooksLikePages && !urlLooksLikeGithubFile,
      blocker: true,
      detail: publicUrl || "未入力",
      fix: "https://ユーザー名.github.io/リポジトリ名/ のURLを公開URLメモへ入れます。github.comのファイル画面は共有しません。",
    },
    {
      id: "release",
      label: "プレリリース判定",
      ok: release.blockers.length === 0,
      blocker: true,
      detail: `ブロッカー ${release.blockers.length}件 / 注意 ${release.warnings.length}件`,
      fix: "プレリリース判定の要対応を上から解消します。",
    },
    {
      id: "package",
      label: "手順パック",
      ok: packageBlockers === 0,
      blocker: false,
      detail: `要対応 ${packageBlockers}件`,
      fix: "プレリリース手順パックの要対応を確認します。",
    },
    {
      id: "cache",
      label: "iPhone最新版反映",
      ok: true,
      blocker: false,
      detail: "push後はiPhoneで「最新版に更新」を押して v0.9.7 表示を確認します。",
      fix: "push後にSafariまたはホーム画面アプリで最新版に更新します。",
    },
    {
      id: "privacy",
      label: "個人データ混入防止",
      ok: !hasPlainLedger || hasVaultData,
      blocker: false,
      detail: hasPlainLedger ? "明細あり。GitHubへJSONバックアップや個人メモを置かないことを確認します。" : "サンプル中心。公開リポジトリへ個人データを置かない方針です。",
      fix: "明細、JSONバックアップ、スクショ、共有レポートに金額や店舗名が入っていないか確認します。",
    },
    {
      id: "share",
      label: "共有先",
      ok: Boolean(publicUrl) && !urlLooksLikeGithubFile,
      blocker: false,
      detail: publicUrl || "共有URL未入力",
      fix: "共有するのはGitHub Pages URLだけにします。GitHubのリポジトリ画面やindex.htmlファイル画面は共有しません。",
    },
  ];
}

function renderPublishChecks() {
  if (!publishCheckList) return;
  const checks = buildPublishChecks();
  const passed = checks.filter((item) => item.ok).length;
  const blockers = checks.filter((item) => !item.ok && item.blocker).length;
  publishCheckList.replaceChildren();
  checks.forEach((item) => {
    const row = document.createElement("div");
    row.className = `publish-item ${item.ok ? "pass" : item.blocker ? "blocker" : "warning"}`;
    row.innerHTML = `
      <span>${item.ok ? "OK" : item.blocker ? "要対応" : "確認"}</span>
      <div>
        <strong>${item.label}</strong>
        <small>${item.ok ? item.detail : item.fix}</small>
      </div>
    `;
    publishCheckList.append(row);
  });
  if (publishSummary) publishSummary.textContent = `${passed}/${checks.length}`;
  if (publishStatus) {
    publishStatus.textContent = blockers
      ? `公開前に要対応が${blockers}件あります`
      : "GitHub Pagesへpushする前の確認がまとまっています";
    publishStatus.classList.toggle("error", blockers > 0);
  }
}

function publishCheckText() {
  const checks = buildPublishChecks();
  const passed = checks.filter((item) => item.ok).length;
  const blockers = checks.filter((item) => !item.ok && item.blocker).length;
  return [
    `Auto Ledger ${APP_VERSION} GitHub Pages公開前チェック`,
    `確認日時: ${new Date().toLocaleString("ja-JP")}`,
    `進捗: ${passed}/${checks.length}`,
    `要対応: ${blockers}件`,
    "",
    ...checks.map((item) => {
      const status = item.ok ? "[OK]" : item.blocker ? "[要対応]" : "[確認]";
      return `${status} ${item.label} - ${item.ok ? item.detail : item.fix}`;
    }),
    "",
    "注意: このレポートには取引明細を入れません。GitHubへpushする前にJSONバックアップ、スクショ、個人メモを含めていないか確認してください。",
  ].join("\n");
}

async function copyPublishCheckReport() {
  try {
    await navigator.clipboard.writeText(publishCheckText());
    if (publishStatus) {
      publishStatus.textContent = "公開前チェックをコピーしました";
      publishStatus.classList.remove("error");
    }
  } catch {
    if (publishStatus) {
      publishStatus.textContent = "コピーできない場合は公開前チェックの内容を見ながら進めてください";
      publishStatus.classList.add("error");
    }
  }
}

function buildPushAuditChecks() {
  const preflight = loadPreflightState();
  const ops = loadOpsState();
  const publicUrl = (preflight.publicUrl || "").trim();
  const publishChecks = buildPublishChecks();
  const publishBlockers = publishChecks.filter((item) => !item.ok && item.blocker).length;
  const backupAge = daysSince(ops.lastBackupAt);
  const urlLooksLikePages = /^https:\/\/[^/]+\.github\.io\/.+/i.test(publicUrl);
  const urlLooksLikeGithubFile = /github\.com/i.test(publicUrl);
  const hasPersonalLedger = ledger.length > 0;
  const hasFeedback = loadFeedbackItems().length > 0;

  return [
    {
      id: "static-check",
      label: "静的チェック",
      ok: APP_VERSION === "v0.9.7",
      blocker: true,
      detail: `${APP_VERSION} / cache v34 / JS構文チェック対象`,
      fix: "push前に node --check app.js と node --check debug-iphone.js を通します。",
    },
    {
      id: "publish-clear",
      label: "公開前チェック",
      ok: publishBlockers === 0,
      blocker: true,
      detail: `要対応 ${publishBlockers}件`,
      fix: "GitHub Pages公開前チェックの要対応を解消します。",
    },
    {
      id: "share-url",
      label: "共有URL",
      ok: urlLooksLikePages && !urlLooksLikeGithubFile,
      blocker: true,
      detail: publicUrl || "未入力",
      fix: "共有するURLは https://ユーザー名.github.io/リポジトリ名/ の形式にします。",
    },
    {
      id: "privacy-files",
      label: "個人データ除外",
      ok: true,
      blocker: false,
      detail: hasPersonalLedger ? "明細あり。JSON、CSV、スクショ、個人メモをpushしないことを確認します。" : "明細なし。push対象はアプリ本体とドキュメント中心です。",
      fix: "git statusと差分を見て、バックアップJSONや個人スクショが含まれていないか確認します。",
    },
    {
      id: "backup",
      label: "バックアップ",
      ok: backupAge !== null && backupAge <= 7,
      blocker: false,
      detail: backupAge === null ? "未記録" : `${backupAge}日前`,
      fix: "JSONバックアップを自分だけが開ける場所へ保存し、アプリ内でバックアップ済みにします。",
    },
    {
      id: "report-safe",
      label: "共有レポート",
      ok: true,
      blocker: false,
      detail: hasFeedback ? "フィードバックあり。共有前にメモの個人情報を確認します。" : "レポートは状態のみ。取引明細は含めません。",
      fix: "コピーしたレポートに店舗名、金額、個人メモが混ざっていないか見ます。",
    },
    {
      id: "after-push",
      label: "push後確認",
      ok: false,
      blocker: false,
      detail: "push後にiPhoneで最新版へ更新し、v0.9.7表示と固定URL追加を確認します。",
      fix: "push後の実機確認項目です。完了後に公開前チェックとセルフ監査を再実行します。",
    },
  ];
}

function renderPushAuditChecks() {
  if (!auditCheckList) return;
  const checks = buildPushAuditChecks();
  const passed = checks.filter((item) => item.ok).length;
  const blockers = checks.filter((item) => !item.ok && item.blocker).length;
  auditCheckList.replaceChildren();
  checks.forEach((item) => {
    const row = document.createElement("div");
    row.className = `audit-item ${item.ok ? "pass" : item.blocker ? "blocker" : "warning"}`;
    row.innerHTML = `
      <span>${item.ok ? "OK" : item.blocker ? "要対応" : "確認"}</span>
      <div>
        <strong>${item.label}</strong>
        <small>${item.ok ? item.detail : item.fix}</small>
      </div>
    `;
    auditCheckList.append(row);
  });
  if (auditSummary) auditSummary.textContent = `${passed}/${checks.length}`;
  if (auditStatus) {
    auditStatus.textContent = blockers
      ? `push前に要対応が${blockers}件あります`
      : "push前のセルフ監査を見ながら最終確認できます";
    auditStatus.classList.toggle("error", blockers > 0);
  }
}

function pushAuditText() {
  const checks = buildPushAuditChecks();
  const passed = checks.filter((item) => item.ok).length;
  const blockers = checks.filter((item) => !item.ok && item.blocker).length;
  return [
    `Auto Ledger ${APP_VERSION} 公開前セルフ監査`,
    `確認日時: ${new Date().toLocaleString("ja-JP")}`,
    `進捗: ${passed}/${checks.length}`,
    `push前の要対応: ${blockers}件`,
    "",
    ...checks.map((item) => {
      const status = item.ok ? "[OK]" : item.blocker ? "[要対応]" : "[確認]";
      return `${status} ${item.label} - ${item.ok ? item.detail : item.fix}`;
    }),
    "",
    "push前コマンド目安:",
    "git status --short",
    "node --check app.js",
    "node --check debug-iphone.js",
    "",
    "注意: JSONバックアップ、CSV、スクリーンショット、取引明細、個人メモは公開リポジトリへ含めないでください。",
  ].join("\n");
}

async function copyPushAuditReport() {
  try {
    await navigator.clipboard.writeText(pushAuditText());
    if (auditStatus) {
      auditStatus.textContent = "公開前セルフ監査をコピーしました";
      auditStatus.classList.remove("error");
    }
  } catch {
    if (auditStatus) {
      auditStatus.textContent = "コピーできない場合はセルフ監査の内容を見ながら進めてください";
      auditStatus.classList.add("error");
    }
  }
}

function buildPushPrepSteps() {
  const preflight = loadPreflightState();
  const publicUrl = (preflight.publicUrl || "").trim();
  const audit = buildPushAuditChecks();
  const auditBlockers = audit.filter((item) => !item.ok && item.blocker).length;
  const urlLooksLikePages = /^https:\/\/[^/]+\.github\.io\/.+/i.test(publicUrl);
  return [
    {
      id: "review-status",
      label: "差分確認",
      ok: true,
      blocker: false,
      title: "git statusでpush対象を確認",
      detail: "PWA本体、debug iPhone、公開手順ドキュメント、アイコン、ネイティブ下書きを対象にします。",
      fix: "git status --short を見て、バックアップJSON、CSV、スクショ、個人メモが入っていないか確認します。",
    },
    {
      id: "static-check",
      label: "構文確認",
      ok: APP_VERSION === "v0.9.7",
      blocker: true,
      title: "JS構文チェックを通す",
      detail: "node --check app.js / node --check debug-iphone.js を通します。",
      fix: "構文チェックを通してからpushします。",
    },
    {
      id: "audit-clear",
      label: "監査",
      ok: auditBlockers === 0,
      blocker: true,
      title: "セルフ監査の要対応を解消",
      detail: `要対応 ${auditBlockers}件`,
      fix: "公開前セルフ監査の要対応を解消します。",
    },
    {
      id: "pages-url",
      label: "URL",
      ok: urlLooksLikePages,
      blocker: true,
      title: "GitHub Pages URLを控える",
      detail: publicUrl || "未入力",
      fix: "公開URLメモに https://ユーザー名.github.io/リポジトリ名/ を入れます。",
    },
    {
      id: "push",
      label: "push",
      ok: false,
      blocker: false,
      title: "GitHubへpushする",
      detail: "差分と監査を確認してから、通常のgit pushでGitHub Pagesへ反映します。",
      fix: "pushはこのカードをコピーしてから実行します。",
    },
    {
      id: "iphone-refresh",
      label: "実機",
      ok: false,
      blocker: false,
      title: "iPhoneで最新版を確認",
      detail: "push後にiPhoneで最新版に更新し、v0.9.7表示、固定URL追加、ホーム画面起動を確認します。",
      fix: "反映後の実機確認として残します。",
    },
  ];
}

function renderPushPrepSteps() {
  if (!pushPrepList) return;
  const steps = buildPushPrepSteps();
  const passed = steps.filter((item) => item.ok).length;
  const blockers = steps.filter((item) => !item.ok && item.blocker).length;
  pushPrepList.replaceChildren();
  steps.forEach((item) => {
    const row = document.createElement("div");
    row.className = `push-item ${item.ok ? "pass" : item.blocker ? "blocker" : "warning"}`;
    row.innerHTML = `
      <span>${item.ok ? "OK" : item.blocker ? "要対応" : "確認"}</span>
      <div>
        <strong>${item.title}</strong>
        <small>${item.ok ? item.detail : item.fix}</small>
      </div>
    `;
    pushPrepList.append(row);
  });
  if (pushSummary) pushSummary.textContent = `${passed}/${steps.length}`;
  if (pushPrepStatus) {
    pushPrepStatus.textContent = blockers
      ? `push前に要対応が${blockers}件あります`
      : "GitHub Pages反映の準備手順を確認できます";
    pushPrepStatus.classList.toggle("error", blockers > 0);
  }
}

function pushPrepText() {
  const steps = buildPushPrepSteps();
  const passed = steps.filter((item) => item.ok).length;
  const blockers = steps.filter((item) => !item.ok && item.blocker).length;
  return [
    `Auto Ledger ${APP_VERSION} GitHub Pages反映準備`,
    `確認日時: ${new Date().toLocaleString("ja-JP")}`,
    `進捗: ${passed}/${steps.length}`,
    `push前の要対応: ${blockers}件`,
    "",
    ...steps.map((item) => {
      const status = item.ok ? "[OK]" : item.blocker ? "[要対応]" : "[確認]";
      return `${status} ${item.title} - ${item.ok ? item.detail : item.fix}`;
    }),
    "",
    "push前コマンド:",
    "git status --short",
    "node --check app.js",
    "node --check debug-iphone.js",
    "git add index.html app.js styles.css sw.js manifest.webmanifest debug-iphone.html debug-iphone.css debug-iphone.js icon-192.png icon-512.png README.md REAL_DEVICE_PRERELEASE_GUIDE.md PUBLIC_PWA_CHECKLIST.md PUSH_PREP_AUDIT.md PUSH_READY_MANIFEST.md PRERELEASE_BACKLOG.md",
    "git commit -m \"Prepare PWA pre-release\"",
    "git push",
    "",
    "注意: 実データのJSONバックアップ、CSV、スクリーンショット、個人メモはaddしないでください。",
  ].join("\n");
}

async function copyPushPrepReport() {
  try {
    await navigator.clipboard.writeText(pushPrepText());
    if (pushPrepStatus) {
      pushPrepStatus.textContent = "push準備をコピーしました";
      pushPrepStatus.classList.remove("error");
    }
  } catch {
    if (pushPrepStatus) {
      pushPrepStatus.textContent = "コピーできない場合は画面のpush準備を見ながら進めてください";
      pushPrepStatus.classList.add("error");
    }
  }
}

function finalPushAddCommand() {
  return [
    "git add",
    "index.html",
    "app.js",
    "styles.css",
    "sw.js",
    "manifest.webmanifest",
    "debug-iphone.html",
    "debug-iphone.css",
    "debug-iphone.js",
    "icon-192.png",
    "icon-512.png",
    "README.md",
    "REAL_DEVICE_PRERELEASE_GUIDE.md",
    "PUBLIC_PWA_CHECKLIST.md",
    "PUSH_PREP_AUDIT.md",
    "PUSH_READY_MANIFEST.md",
    "PUSH_FINAL_CHECK.md",
    "PRERELEASE_BACKLOG.md",
    "IPHONE_DEBUG_GUIDE.md",
    "POSITIONING_AND_FREE_MODEL.md",
    "NATIVE_RELEASE_SYNC.md",
    "APP_STORE_SUBMISSION_DRAFT.md",
    "IOS_ARCHITECTURE_DECISION.md",
    "PRIVACY_POLICY_DRAFT.md",
    "PWA_PRERELEASE_GUIDE.md",
    "SHORTCUT_SETUP_GUIDE.md",
    "ios",
    "ios-tests",
  ].join(" ");
}

function buildFinalPushSteps() {
  const pushPrep = buildPushPrepSteps();
  const pushBlockers = pushPrep.filter((item) => !item.ok && item.blocker).length;
  return [
    {
      id: "precheck",
      label: "確認",
      ok: pushBlockers === 0,
      blocker: true,
      title: "push準備の要対応がない",
      detail: "GitHub Pages反映準備にブロッカーはありません。",
      fix: `GitHub Pages反映準備に要対応が${pushBlockers}件あります。先に解消します。`,
    },
    {
      id: "status",
      label: "status",
      ok: true,
      blocker: false,
      title: "差分を確認する",
      detail: "git status --short",
      fix: "個人データファイルが含まれていないことを見ます。",
    },
    {
      id: "check-js",
      label: "check",
      ok: true,
      blocker: false,
      title: "構文チェックを実行する",
      detail: "node --check app.js / node --check debug-iphone.js",
      fix: "構文チェックが通っていることを確認します。",
    },
    {
      id: "stage",
      label: "add",
      ok: false,
      blocker: false,
      title: "必要ファイルだけstageする",
      detail: finalPushAddCommand(),
      fix: "バックアップJSON、CSV、スクショ、個人メモはstageしません。",
    },
    {
      id: "commit",
      label: "commit",
      ok: false,
      blocker: false,
      title: "commitする",
      detail: "git commit -m \"Prepare PWA pre-release\"",
      fix: "ステージング後にcommitします。",
    },
    {
      id: "push",
      label: "push",
      ok: false,
      blocker: false,
      title: "GitHubへpushする",
      detail: "git push",
      fix: "commit後にpushします。",
    },
    {
      id: "iphone",
      label: "iPhone",
      ok: false,
      blocker: false,
      title: "iPhoneで反映確認する",
      detail: "Pages URLを開き、最新版更新、v0.9.7表示、固定URL追加、ホーム画面起動を確認します。",
      fix: "push後の実機確認として残します。",
    },
  ];
}

function renderFinalPushSteps() {
  if (!finalPushList) return;
  const steps = buildFinalPushSteps();
  const passed = steps.filter((item) => item.ok).length;
  const blockers = steps.filter((item) => !item.ok && item.blocker).length;
  finalPushList.replaceChildren();
  steps.forEach((item) => {
    const row = document.createElement("div");
    row.className = `final-push-item ${item.ok ? "pass" : item.blocker ? "blocker" : "warning"}`;
    row.innerHTML = `
      <span>${item.ok ? "OK" : item.blocker ? "要対応" : "実行"}</span>
      <div>
        <strong>${item.title}</strong>
        <small>${item.ok ? item.detail : item.fix}</small>
      </div>
    `;
    finalPushList.append(row);
  });
  if (finalPushSummary) finalPushSummary.textContent = `${passed}/${steps.length}`;
  if (finalPushStatus) {
    finalPushStatus.textContent = blockers
      ? `push実行前に要対応が${blockers}件あります`
      : "最終push手順をコピーして実行準備できます";
    finalPushStatus.classList.toggle("error", blockers > 0);
  }
}

function finalPushText() {
  const steps = buildFinalPushSteps();
  const blockers = steps.filter((item) => !item.ok && item.blocker).length;
  return [
    `Auto Ledger ${APP_VERSION} 最終push手順`,
    `確認日時: ${new Date().toLocaleString("ja-JP")}`,
    `push実行前の要対応: ${blockers}件`,
    "",
    "1. 差分確認",
    "git status --short",
    "",
    "2. 構文チェック",
    "node --check app.js",
    "node --check debug-iphone.js",
    "",
    "3. 必要ファイルだけstage",
    finalPushAddCommand(),
    "",
    "4. commit",
    "git commit -m \"Prepare PWA pre-release\"",
    "",
    "5. push",
    "git push",
    "",
    "6. iPhone確認",
    "Pages URLを開く -> 最新版に更新 -> v0.9.7表示 -> 固定URL追加 -> ホーム画面起動",
    "",
    "注意: JSONバックアップ、CSV、スクリーンショット、取引明細、個人メモ、認証情報はstageしないでください。",
  ].join("\n");
}

async function copyFinalPushReport() {
  try {
    await navigator.clipboard.writeText(finalPushText());
    if (finalPushStatus) {
      finalPushStatus.textContent = "最終push手順をコピーしました";
      finalPushStatus.classList.remove("error");
    }
  } catch {
    if (finalPushStatus) {
      finalPushStatus.textContent = "コピーできない場合は画面の最終push手順を見ながら進めてください";
      finalPushStatus.classList.add("error");
    }
  }
}

function loadFeedbackItems() {
  try {
    const saved = JSON.parse(localStorage.getItem(feedbackStateKey) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    localStorage.removeItem(feedbackStateKey);
    return [];
  }
}

function saveFeedbackItems(items) {
  localStorage.setItem(feedbackStateKey, JSON.stringify(items));
}

function feedbackLabel(type) {
  return {
    bug: "不具合",
    friction: "使いにくい",
    idea: "改善案",
    win: "良かった点",
  }[type] || "メモ";
}

function priorityLabel(priority) {
  return {
    high: "高",
    medium: "中",
    low: "低",
  }[priority] || "中";
}

function renderFeedback() {
  if (!feedbackList) return;
  const items = loadFeedbackItems();
  const openItems = items.filter((item) => !item.resolved);
  feedbackList.replaceChildren();
  if (feedbackCountLabel) feedbackCountLabel.textContent = `${openItems.length}件`;
  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "feedback-empty";
    empty.textContent = "まだフィードバックはありません。実機で気づいたことをここに残せます。";
    feedbackList.append(empty);
  } else {
    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = `feedback-item ${item.resolved ? "resolved" : ""}`;
      row.innerHTML = `
        <div>
          <span>${feedbackLabel(item.type)} / 優先度 ${priorityLabel(item.priority)}</span>
          <strong>${item.note}</strong>
          <small>${new Date(item.createdAt).toLocaleString("ja-JP")}${item.resolved ? " / 解決済み" : ""}</small>
        </div>
        <button type="button" data-feedback-id="${item.id}">${item.resolved ? "戻す" : "解決"}</button>
      `;
      row.querySelector("button").addEventListener("click", () => toggleFeedbackResolved(item.id));
      feedbackList.append(row);
    });
  }
  if (feedbackStatus) {
    feedbackStatus.textContent = openItems.length ? `未解決の改善メモが${openItems.length}件あります` : "未解決の改善メモはありません";
    feedbackStatus.classList.toggle("error", openItems.some((item) => item.priority === "high"));
  }
  renderReleaseReadiness();
  renderPushAuditChecks();
  renderPushPrepSteps();
  renderFinalPushSteps();
}

function addFeedbackItem(event) {
  event.preventDefault();
  const note = feedbackNoteInput?.value.trim() || "";
  if (note.length < 3) {
    if (feedbackStatus) {
      feedbackStatus.textContent = "メモを3文字以上で入力してください";
      feedbackStatus.classList.add("error");
    }
    return;
  }
  const items = loadFeedbackItems();
  const next = [
    {
      id: crypto.randomUUID ? crypto.randomUUID() : `feedback-${Date.now()}`,
      type: feedbackTypeInput?.value || "idea",
      priority: feedbackPriorityInput?.value || "medium",
      note,
      createdAt: new Date().toISOString(),
      resolved: false,
    },
    ...items,
  ].slice(0, 50);
  saveFeedbackItems(next);
  feedbackNoteInput.value = "";
  if (feedbackStatus) {
    feedbackStatus.textContent = "フィードバックを記録しました";
    feedbackStatus.classList.remove("error");
  }
  renderFeedback();
}

function toggleFeedbackResolved(id) {
  const items = loadFeedbackItems().map((item) =>
    item.id === id ? { ...item, resolved: !item.resolved, resolvedAt: item.resolved ? "" : new Date().toISOString() } : item,
  );
  saveFeedbackItems(items);
  renderFeedback();
}

function feedbackReportText() {
  const items = loadFeedbackItems();
  const openItems = items.filter((item) => !item.resolved);
  return [
    `Auto Ledger ${APP_VERSION} 実機フィードバック`,
    `作成日時: ${new Date().toLocaleString("ja-JP")}`,
    `未解決: ${openItems.length}件 / 合計: ${items.length}件`,
    "",
    ...items.map((item) => {
      const status = item.resolved ? "[解決済み]" : "[未解決]";
      return `${status} ${feedbackLabel(item.type)} 優先度${priorityLabel(item.priority)} - ${item.note}`;
    }),
    "",
    "注意: 店舗名、金額、カード名などの明細本文は必要な時だけ最小限にしてください。",
  ].join("\n");
}

async function copyFeedbackReport() {
  try {
    await navigator.clipboard.writeText(feedbackReportText());
    if (feedbackStatus) {
      feedbackStatus.textContent = "改善メモをコピーしました";
      feedbackStatus.classList.remove("error");
    }
  } catch {
    if (feedbackStatus) {
      feedbackStatus.textContent = "コピーできない場合は画面の改善メモを確認してください";
      feedbackStatus.classList.add("error");
    }
  }
}

function clearResolvedFeedback() {
  const openItems = loadFeedbackItems().filter((item) => !item.resolved);
  saveFeedbackItems(openItems);
  if (feedbackStatus) {
    feedbackStatus.textContent = "解決済みフィードバックを削除しました";
    feedbackStatus.classList.remove("error");
  }
  renderFeedback();
}

function loadOpsState() {
  try {
    const saved = JSON.parse(localStorage.getItem(opsStateKey) || "{}");
    return {
      lastBackupAt: saved.lastBackupAt || "",
      lastRefreshAt: saved.lastRefreshAt || "",
      lastRecoveryCopyAt: saved.lastRecoveryCopyAt || "",
    };
  } catch {
    return { lastBackupAt: "", lastRefreshAt: "", lastRecoveryCopyAt: "" };
  }
}

function saveOpsState(state) {
  localStorage.setItem(opsStateKey, JSON.stringify(state));
}

function markOpsEvent(key) {
  const state = loadOpsState();
  state[key] = new Date().toISOString();
  saveOpsState(state);
  renderOpsPanel();
  renderReleaseReadiness();
  renderPushAuditChecks();
  renderPushPrepSteps();
  renderFinalPushSteps();
}

function daysSince(iso) {
  if (!iso) return null;
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}

function formatOpsDate(iso) {
  if (!iso) return "未記録";
  return new Date(iso).toLocaleString("ja-JP", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function renderOpsPanel() {
  if (!opsGrid) return;
  const state = loadOpsState();
  const backupAge = daysSince(state.lastBackupAt);
  const refreshAge = daysSince(state.lastRefreshAt);
  const backupOk = backupAge !== null && backupAge <= 7;
  const refreshOk = refreshAge !== null && refreshAge <= 14;
  const items = [
    {
      label: "JSONバックアップ",
      value: formatOpsDate(state.lastBackupAt),
      note: backupOk ? "7日以内に取得済み" : "週1回の取得を推奨",
      warning: !backupOk,
    },
    {
      label: "最新版確認",
      value: formatOpsDate(state.lastRefreshAt),
      note: refreshOk ? "最近確認済み" : "更新後は最新版に更新を押す",
      warning: !refreshOk,
    },
    {
      label: "保存済み明細",
      value: `${ledger.length}件`,
      note: unlockedPassphrase ? "暗号化自動保存ON" : "必要なら暗号化保存を解除",
      warning: !unlockedPassphrase,
    },
    {
      label: "復旧手順",
      value: state.lastRecoveryCopyAt ? "コピー済み" : "未コピー",
      note: "困った時用に手元へ控える",
      warning: !state.lastRecoveryCopyAt,
    },
  ];

  opsGrid.replaceChildren();
  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = `ops-item ${item.warning ? "warning" : ""}`;
    row.innerHTML = `
      <span>${item.label}</span>
      <strong>${item.value}</strong>
      <small>${item.note}</small>
    `;
    opsGrid.append(row);
  });

  const warningCount = items.filter((item) => item.warning).length;
  if (opsHealthLabel) opsHealthLabel.textContent = warningCount ? `注意 ${warningCount}` : "OK";
  if (opsStatus) {
    opsStatus.textContent = warningCount ? "運用メモに確認項目があります" : "運用状態は良好です";
    opsStatus.classList.toggle("error", warningCount > 0);
  }
}

function recoveryStepsText() {
  return [
    `Auto Ledger ${APP_VERSION} 復旧手順`,
    "1. GitHub Pages URLをSafariで開く",
    "2. 古い画面なら「最新版に更新」または「キャッシュ削除」を押す",
    "3. JSONバックアップがある場合は「JSON復元」を押す",
    "4. バックアップJSONを選ぶ",
    "5. 明細件数とカテゴリ予算を確認する",
    "6. パスフレーズを入れて「解除して保存」を押す",
    "7. ショートカット診断の固定値URLで1件追加を確認する",
    "",
    "注意: バックアップJSONは個人情報に近いので公開リポジトリへ置かない。",
  ].join("\n");
}

async function copyRecoverySteps() {
  try {
    await navigator.clipboard.writeText(recoveryStepsText());
    markOpsEvent("lastRecoveryCopyAt");
    setOpsStatus("復旧手順をコピーしました", false);
  } catch {
    setOpsStatus("コピーできない場合はREAL_DEVICE_PRERELEASE_GUIDE.mdを確認してください", true);
  }
}

async function copyOpsReport() {
  const state = loadOpsState();
  const lines = [
    `Auto Ledger ${APP_VERSION} 運用レポート`,
    `明細件数: ${ledger.length}`,
    `受信履歴: ${loadIntakeHistory().length}件`,
    `JSONバックアップ: ${formatOpsDate(state.lastBackupAt)}`,
    `最新版確認: ${formatOpsDate(state.lastRefreshAt)}`,
    `復旧手順コピー: ${formatOpsDate(state.lastRecoveryCopyAt)}`,
    `暗号化自動保存: ${unlockedPassphrase ? "ON" : "OFF"}`,
  ];
  try {
    await navigator.clipboard.writeText(lines.join("\n"));
    setOpsStatus("運用レポートをコピーしました", false);
  } catch {
    setOpsStatus("運用レポートをコピーできませんでした", true);
  }
}

function resetOpsState() {
  localStorage.removeItem(opsStateKey);
  renderOpsPanel();
  renderReleaseReadiness();
}

function setOpsStatus(text, isError) {
  if (!opsStatus) return;
  opsStatus.textContent = text;
  opsStatus.classList.toggle("error", isError);
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
  if (localStateKey) localStorage.removeItem(localStateKey);
  pulse(connectionState, "ログをクリアしました");
});
document.querySelector("#showUncategorizedButton")?.addEventListener("click", () => {
  ledgerFilter = "uncategorized";
  renderLedger();
});
document.querySelector("#showAllButton")?.addEventListener("click", () => {
  ledgerFilter = "all";
  renderLedger();
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
document.querySelector("#exportCsvButton")?.addEventListener("click", exportCsv);
document.querySelector("#exportJsonButton")?.addEventListener("click", exportJsonBackup);
document.querySelector("#importJsonButton")?.addEventListener("click", chooseJsonBackup);
importJsonInput?.addEventListener("change", importJsonBackup);
document.querySelector("#copySummaryButton")?.addEventListener("click", copyMonthlySummary);
document.querySelector("#resetDebugDataButton")?.addEventListener("click", resetDebugData);
document.querySelector("#markBackupButton")?.addEventListener("click", () => {
  markOpsEvent("lastBackupAt");
  setOpsStatus("バックアップ済みとして記録しました", false);
});
document.querySelector("#copyRecoveryStepsButton")?.addEventListener("click", copyRecoverySteps);
document.querySelector("#copyOpsReportButton")?.addEventListener("click", copyOpsReport);
document.querySelector("#resetOpsButton")?.addEventListener("click", resetOpsState);
document.querySelector("#copyOnboardingStepsButton")?.addEventListener("click", copyOnboardingSteps);
document.querySelector("#resetOnboardingButton")?.addEventListener("click", resetOnboarding);
document.querySelector("#copyReleaseReportButton")?.addEventListener("click", copyReleaseReport);
document.querySelector("#refreshReleaseCheckButton")?.addEventListener("click", () => {
  renderReleaseReadiness();
  if (releaseReadinessStatus) releaseReadinessStatus.textContent = "判定を更新しました";
});
document.querySelector("#runFlowCheckButton")?.addEventListener("click", () => {
  renderFlowChecks();
  if (flowCheckStatus) flowCheckStatus.textContent = "通し確認を更新しました";
});
document.querySelector("#copyFlowCheckButton")?.addEventListener("click", copyFlowCheckReport);
document.querySelector("#copyPackageStepsButton")?.addEventListener("click", copyPackageSteps);
document.querySelector("#refreshPackageStepsButton")?.addEventListener("click", () => {
  renderPackageSteps();
  if (packageStatus) packageStatus.textContent = "手順パックを更新しました";
});
document.querySelector("#copyPublishCheckButton")?.addEventListener("click", copyPublishCheckReport);
document.querySelector("#refreshPublishCheckButton")?.addEventListener("click", () => {
  renderPublishChecks();
  if (publishStatus) publishStatus.textContent = "公開前チェックを更新しました";
});
document.querySelector("#copyAuditReportButton")?.addEventListener("click", copyPushAuditReport);
document.querySelector("#refreshAuditButton")?.addEventListener("click", () => {
  renderPushAuditChecks();
  if (auditStatus) auditStatus.textContent = "公開前セルフ監査を更新しました";
});
document.querySelector("#copyPushPrepButton")?.addEventListener("click", copyPushPrepReport);
document.querySelector("#refreshPushPrepButton")?.addEventListener("click", () => {
  renderPushPrepSteps();
  if (pushPrepStatus) pushPrepStatus.textContent = "GitHub Pages反映準備を更新しました";
});
document.querySelector("#copyFinalPushButton")?.addEventListener("click", copyFinalPushReport);
document.querySelector("#refreshFinalPushButton")?.addEventListener("click", () => {
  renderFinalPushSteps();
  if (finalPushStatus) finalPushStatus.textContent = "最終push手順を更新しました";
});
feedbackForm?.addEventListener("submit", addFeedbackItem);
document.querySelector("#copyFeedbackButton")?.addEventListener("click", copyFeedbackReport);
document.querySelector("#clearResolvedFeedbackButton")?.addEventListener("click", clearResolvedFeedback);
document.querySelector("#openTestUrlButton").addEventListener("click", () => {
  window.location.href = testUrlInput.value;
});
document.querySelector("#copyTestUrlButton").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(testUrlInput.value);
    setVaultStatus("テストURLをコピーしました", false);
  } catch {
    testUrlInput.select();
    setVaultStatus("コピーできない場合はURL欄を長押ししてください", true);
  }
});
document.querySelector("#copySetupGuideUrlButton")?.addEventListener("click", copySetupGuideUrl);
document.querySelector("#openSetupGuideUrlButton")?.addEventListener("click", () => {
  window.location.href = setupGuideUrl.value;
});
document.querySelector("#copyProductionUrlButton")?.addEventListener("click", copyProductionShortcutUrl);
document.querySelector("#copyProductionStepsButton")?.addEventListener("click", copyProductionSteps);
document.querySelector("#copyPreflightReportButton")?.addEventListener("click", copyPreflightReport);
document.querySelector("#resetPreflightButton")?.addEventListener("click", resetPreflight);
publicUrlInput?.addEventListener("input", () => {
  const state = loadPreflightState();
  state.publicUrl = publicUrlInput.value.trim();
  savePreflightState(state);
  renderReleaseReadiness();
  renderPackageSteps();
  renderPublishChecks();
  renderPushAuditChecks();
  renderPushPrepSteps();
  renderFinalPushSteps();
});
document.querySelector("#refreshAppButton")?.addEventListener("click", refreshApp);
document.querySelector("#clearCacheButton")?.addEventListener("click", clearAppCaches);
document.querySelector("#copyDebugReportButton")?.addEventListener("click", copyDebugReport);
document.querySelector("#runSelfCheckButton")?.addEventListener("click", () => {
  runIssueChecks();
  setVaultStatus("自己診断を更新しました", false);
});

[walletMerchantInput, walletAmountInput].forEach((input) => {
  input.addEventListener("input", updateShortcutPayload);
});

loadCustomRules();
walletButtons[0].classList.add("active");
if (appVersionLabel) appVersionLabel.textContent = APP_VERSION;
const restoredLocalState = loadLocalState();
const hasShortcutParams = new URLSearchParams(window.location.search).has("amount");
if (!restoredLocalState && !debugMode && !hasShortcutParams) {
  walletEvents.slice(0, 2).forEach((event) => {
    addPayment(createPayment({ ...event, memo: "Wallet取引トリガー", source: "Wallet自動" }));
  });
}
updateShortcutPayload();
updateProductionShortcutUrl();
setupWizard();
setupBudgetEditor();
setupQrSamples();
setupRuleEditor();
setupSponsorControls();
renderOnboarding();
renderPreflight();
renderOpsPanel();
renderFeedback();
renderReleaseReadiness();
renderFlowChecks();
renderPackageSteps();
renderPublishChecks();
renderPushAuditChecks();
renderPushPrepSteps();
renderFinalPushSteps();
restoreLastIntakeStatus();
updateAutoSaveState();
receiveShortcutParams();
runIssueChecks();
registerServiceWorker();
