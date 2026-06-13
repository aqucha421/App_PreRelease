const frame = document.querySelector("#appFrame");
const frameShell = document.querySelector("#iphoneFrame");
const devicePreset = document.querySelector("#devicePreset");
const baseUrl = document.querySelector("#baseUrl");
const provider = document.querySelector("#provider");
const merchant = document.querySelector("#merchant");
const amount = document.querySelector("#amount");
const source = document.querySelector("#source");
const eventUrl = document.querySelector("#eventUrl");
const debugLog = document.querySelector("#debugLog");

const scenarios = {
  convenience: {
    provider: "QUICPay",
    merchant: "コンビニ 渋谷三丁目",
    amount: "680",
    source: "wallet",
  },
  train: {
    provider: "Suica",
    merchant: "JR 新宿駅",
    amount: "198",
    source: "wallet",
  },
  qr: {
    provider: "PayPay",
    merchant: "ドラッグストア 青山",
    amount: "1420",
    source: "qr",
  },
  rakutenpay: {
    provider: "楽天ペイ",
    merchant: "カフェ 表参道",
    amount: "620",
    source: "qr",
  },
  dbarai: {
    provider: "d払い",
    merchant: "書店 新宿",
    amount: "980",
    source: "qr",
  },
  aupay: {
    provider: "au PAY",
    merchant: "ホームセンター 世田谷",
    amount: "2480",
    source: "qr",
  },
  merpay: {
    provider: "メルペイ",
    merchant: "コンビニ 恵比寿",
    amount: "540",
    source: "qr",
  },
  unknown: {
    provider: "PASMO",
    merchant: "テスト店",
    amount: "321",
    source: "wallet",
  },
};

function buildUrl() {
  const url = new URL(baseUrl.value || "./index.html", window.location.href);
  url.searchParams.set("provider", provider.value);
  url.searchParams.set("merchant", merchant.value);
  url.searchParams.set("amount", amount.value);
  url.searchParams.set("source", source.value);
  return url.toString();
}

function syncEventUrl() {
  eventUrl.value = buildUrl();
}

function log(message) {
  const item = document.createElement("li");
  item.textContent = `${new Date().toLocaleTimeString("ja-JP")} ${message}`;
  debugLog.prepend(item);
}

function sendEvent() {
  const url = buildUrl();
  frame.src = url;
  log(`Sent ${provider.value} ${amount.value}円 / ${merchant.value}`);
  amount.value = String(Number(amount.value || 0) + 1);
  syncEventUrl();
}

function applyScenario(name) {
  const scenario = scenarios[name];
  if (!scenario) return;
  provider.value = scenario.provider;
  merchant.value = scenario.merchant;
  amount.value = scenario.amount;
  source.value = scenario.source;
  syncEventUrl();
  log(`Loaded scenario: ${name}`);
}

function applyDevicePreset() {
  const [width, height] = devicePreset.value.split("x").map(Number);
  frameShell.style.width = `${width}px`;
  frameShell.style.height = `${height}px`;
  log(`Device set to ${width}x${height}`);
}

document.querySelector("#reloadButton").addEventListener("click", () => {
  frame.src = baseUrl.value || "./index.html";
  log("Reloaded app frame");
});

document.querySelector("#openFullButton").addEventListener("click", () => {
  window.open(frame.src, "_blank", "noopener,noreferrer");
});

document.querySelector("#sendEventButton").addEventListener("click", sendEvent);

document.querySelector("#copyUrlButton").addEventListener("click", async () => {
  syncEventUrl();
  try {
    await navigator.clipboard.writeText(eventUrl.value);
    log("Copied event URL");
  } catch {
    eventUrl.select();
    log("Clipboard unavailable. Select the URL manually.");
  }
});

document.querySelectorAll("[data-scenario]").forEach((button) => {
  button.addEventListener("click", () => applyScenario(button.dataset.scenario));
});

[baseUrl, provider, merchant, amount, source].forEach((input) => {
  input.addEventListener("input", syncEventUrl);
  input.addEventListener("change", syncEventUrl);
});

devicePreset.addEventListener("change", applyDevicePreset);
frame.addEventListener("load", () => log("iPhone frame loaded"));

applyDevicePreset();
syncEventUrl();
log("Debugger ready");
