const STORAGE_KEY = "mmas.accountState.v1";

// Local normalized schema (frontend-only), inspired by DB design:
// {
//   version: 1,
//   accounts: [
//     {
//       id: string,               // local uuid
//       mmasId: string,           // maps to app_accounts.mmas_id (UUID in DB; string locally)
//       tgId: string | null,      // maps to app_accounts.tg_id (UUID in DB; string locally)
//       displayName: string,      // derived from student.name or login for UX
//       color: string,            // UI avatar color
//       createdAt: number
//     }
//   ],
//   currentAccountId: string | null,
//   balances: { [accountId: string]: number },
//   histories: { [accountId: string]: Array<HistoryOp> }
// }

function uid() {
  return `acc-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

function generateColor(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 70% 50%)`;
}

function formatDate(d) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function generateAdminSeedHistory(count = 40) {
  const ops = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    if (i % 3 === 0) {
      ops.push({ type: "refill", title: "Пополнение", date: formatDate(d), amount: 5000 + (i % 5) * 1000, status: "Зачислено" });
    } else {
      const prices = [450, 640, 780, 1200, 1500, 2490, 3500];
      const names = ["Тренировка", "Кофе", "Такси", "Абонемент", "Онлайн-курс", "Инвентарь", "Протеин"];
      const idx = i % prices.length;
      ops.push({ type: "purchase", title: names[idx], date: formatDate(d), amount: -prices[idx], status: "Оплачено" });
    }
  }
  return ops;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { version: 1, accounts: [], currentAccountId: null, balances: {}, histories: {} };
    const parsed = JSON.parse(raw);
    if (!parsed.version) parsed.version = 1;
    if (!Array.isArray(parsed.accounts)) parsed.accounts = [];
    if (!parsed.balances) parsed.balances = {};
    if (!parsed.histories) parsed.histories = {};
    return parsed;
  } catch {
    return { version: 1, accounts: [], currentAccountId: null, balances: {}, histories: {} };
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function listAccounts() {
  return loadState().accounts;
}

export function getCurrentAccountId() {
  return loadState().currentAccountId;
}

export function selectAccount(id) {
  const state = loadState();
  state.currentAccountId = id || null;
  saveState(state);
  return state;
}

export function removeAccount(id) {
  const state = loadState();
  state.accounts = state.accounts.filter((a) => a.id !== id);
  delete state.balances[id];
  delete state.histories[id];
  if (state.currentAccountId === id) {
    state.currentAccountId = state.accounts[0]?.id || null;
  }
  saveState(state);
  return state;
}

// Upsert account using known identifiers (maps to DB keys conceptually)
export function upsertAccount({ mmasId, tgId = null, displayName }) {
  const state = loadState();
  const existing = state.accounts.find((a) => a.mmasId === mmasId);
  if (existing) {
    // update minimal fields if changed
    existing.displayName = displayName || existing.displayName;
    if (tgId) existing.tgId = tgId;
    saveState(state);
    return { state, account: existing };
  }
  const name = displayName || mmasId;
  const account = {
    id: uid(),
    mmasId,
    tgId,
    displayName: name,
    color: generateColor(name),
    createdAt: Date.now(),
  };
  state.accounts.push(account);
  // initialize containers
  if (state.balances[account.id] == null) state.balances[account.id] = 0;
  if (!state.histories[account.id]) state.histories[account.id] = [];

  // Seed admin with big balance and rich history once
  if (name && name.toLowerCase() === "admin") {
    if ((state.histories[account.id] || []).length === 0) {
      state.balances[account.id] = 1000000;
      state.histories[account.id] = generateAdminSeedHistory(60);
    }
  }
  saveState(state);
  return { state, account };
}

export function snapshot() {
  return loadState();
}

// Balance helpers
export function getBalance(accountId) {
  if (!accountId) return 0;
  const state = loadState();
  return state.balances[accountId] || 0;
}

export function setBalance(accountId, next) {
  const state = loadState();
  state.balances[accountId] = Number(next) || 0;
  saveState(state);
  return state.balances[accountId];
}

export function adjustBalance(accountId, delta) {
  const curr = getBalance(accountId);
  return setBalance(accountId, curr + Number(delta));
}

// History helpers
export function listHistory(accountId) {
  if (!accountId) return [];
  const state = loadState();
  return state.histories[accountId] || [];
}

export function addHistory(accountId, op) {
  const state = loadState();
  if (!state.histories[accountId]) state.histories[accountId] = [];
  state.histories[accountId].push(op);
  saveState(state);
  return state.histories[accountId];
}

export function clearHistory(accountId) {
  const state = loadState();
  state.histories[accountId] = [];
  saveState(state);
  return [];
}


