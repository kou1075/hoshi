const STORAGE_KEY = "hoshiRandomPickerV2";

const defaultCharacters = [
  { name: "グリフィン", cost: "3.0" },
  { name: "ヒカリ", cost: "3.0" },
  { name: "エルフィン", cost: "3.0" },
  { name: "ケルビム", cost: "3.0" },
  { name: "シュウウ", cost: "3.0" },
  { name: "スズラン", cost: "3.0" },
  { name: "キャヴァリー", cost: "3.0" },
  { name: "ラジエル", cost: "3.0" },
  { name: "影", cost: "3.0" },
  { name: "ライン", cost: "3.0" },
  { name: "ロタ", cost: "3.0" },
  { name: "イーザー", cost: "3.0" },
  { name: "秋雲", cost: "3.0" },
  { name: "ベータ-ロンギヌス", cost: "3.0" },
  { name: "キャミィ", cost: "3.0" },
  { name: "セイレン", cost: "3.0" },
  { name: "無銘", cost: "3.0" },
  { name: "アカツキ", cost: "3.0" },
  { name: "ヴォイドセーバー", cost: "3.0" },

  { name: "フリード", cost: "2.5" },
  { name: "カゼ", cost: "2.5" },
  { name: "シャオリン", cost: "2.5" },
  { name: "シャープ", cost: "2.5" },
  { name: "アリス", cost: "2.5" },
  { name: "スカイセーバー", cost: "2.5" },
  { name: "十八号", cost: "2.5" },
  { name: "シグナス", cost: "2.5" },
  { name: "アンジェリス", cost: "2.5" },
  { name: "ヴァルキア", cost: "2.5" },
  { name: "エヴァ", cost: "2.5" },
  { name: "轟雷改", cost: "2.5" },
  { name: "稲", cost: "2.5" },
  { name: "バーゼラルド", cost: "2.5" },
  { name: "ノーラ", cost: "2.5" },
  { name: "ランスロット", cost: "2.5" },
  { name: "サンダーボルト・OTOME", cost: "2.5" },
  { name: "ガラハッド・暁", cost: "2.5" },
  { name: "デッド・アライブ", cost: "2.5" },
  { name: "ハルカ", cost: "2.5" },
  { name: "ドラグナー", cost: "2.5" },
  { name: "レキ", cost: "2.5" },
  { name: "ブラック★ロックシューター", cost: "2.5" },
  { name: "デッドマスター", cost: "2.5" },

  { name: "ベータ", cost: "2.0" },
  { name: "デュカリオン", cost: "2.0" },
  { name: "セラフィム", cost: "2.0" },
  { name: "アイーダ", cost: "2.0" },
  { name: "パラス", cost: "2.0" },
  { name: "スコーピオン", cost: "2.0" },
  { name: "ヴァーチェ", cost: "2.0" },
  { name: "ザハロワ", cost: "2.0" },
  { name: "咲迦", cost: "2.0" },
  { name: "チンニ", cost: "2.0" },
  { name: "ダークスター", cost: "2.0" },
  { name: "ヒビキ", cost: "2.0" },
  { name: "スティレット", cost: "2.0" },
  { name: "ボルゾイ", cost: "2.0" },
  { name: "キャッティ", cost: "2.0" },
  { name: "ブリーカー", cost: "2.0" },
  { name: "ガラハッド", cost: "2.0" },
  { name: "フランカー", cost: "2.0" },
  { name: "アイスリン", cost: "2.0" },
  { name: "クリスタ", cost: "2.0" },
  { name: "タチアナ", cost: "2.0" },
  { name: "フィービー", cost: "2.0" },

  { name: "オーキッド", cost: "1.5" },
  { name: "スノーウォル", cost: "1.5" },
  { name: "カタリナ", cost: "1.5" },
  { name: "ローランド", cost: "1.5" },
  { name: "ヤミン", cost: "1.5" }
];

let characters = [];
let enabled = {};
let favorites = {};
let historyList = [];
let lastPickNames = [];
let editingName = null;
let themeIndex = 0;

const themes = ["", "light", "neon"];

const resultText = document.getElementById("resultText");
const cardsElement = document.getElementById("cards");
const statusElement = document.getElementById("status");
const costStatsElement = document.getElementById("costStats");
const historyElement = document.getElementById("history");
const toastElement = document.getElementById("toast");

const searchBox = document.getElementById("searchBox");
const costFilter = document.getElementById("costFilter");
const showFilter = document.getElementById("showFilter");
const poolMode = document.getElementById("poolMode");
const costLimit = document.getElementById("costLimit");
const avoidHistory = document.getElementById("avoidHistory");
const noSamePair = document.getElementById("noSamePair");

const charNameInput = document.getElementById("charNameInput");
const charCostInput = document.getElementById("charCostInput");

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (saved && Array.isArray(saved.characters)) {
      characters = saved.characters;
      enabled = saved.enabled || {};
      favorites = saved.favorites || {};
      historyList = saved.historyList || [];
      themeIndex = saved.themeIndex || 0;
    } else {
      resetToDefault(false);
    }
  } catch (e) {
    resetToDefault(false);
  }

  characters.forEach((character) => {
    if (enabled[character.name] === undefined) {
      enabled[character.name] = true;
    }

    if (favorites[character.name] === undefined) {
      favorites[character.name] = false;
    }
  });

  applyTheme();
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      characters,
      enabled,
      favorites,
      historyList,
      themeIndex
    }));
  } catch (e) {
    console.log("保存できませんでした", e);
  }
}

function resetToDefault(shouldSave = true) {
  characters = defaultCharacters.map((character) => ({ ...character }));
  enabled = {};
  favorites = {};
  historyList = [];
  lastPickNames = [];
  editingName = null;

  characters.forEach((character) => {
    enabled[character.name] = true;
    favorites[character.name] = false;
  });

  if (shouldSave) {
    saveData();
  }
}

function applyTheme() {
  document.body.className = themes[themeIndex];
}

function changeTheme() {
  themeIndex++;

  if (themeIndex >= themes.length) {
    themeIndex = 0;
  }

  applyTheme();
  saveData();
}

function showToast(message) {
  toastElement.textContent = message;
  toastElement.classList.add("show");

  setTimeout(() => {
    toastElement.classList.remove("show");
  }, 1800);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getPickMode() {
  return document.querySelector('input[name="pickMode"]:checked').value;
}

function costNumber(character) {
  return Number(character.cost);
}

function getBasePool() {
  const mode = poolMode.value;
  let pool = characters.slice();

  if (mode === "enabled") {
    pool = pool.filter((character) => enabled[character.name]);
  }

  if (mode === "favorite") {
    pool = pool.filter((character) => favorites[character.name]);
  }

  if (avoidHistory.checked) {
    const recentNames = historyList
      .slice(0, 10)
      .flatMap((item) => {
        if (item.type === "pair") {
          return item.names;
        }

        return [item.name];
      });

    pool = pool.filter((character) => !recentNames.includes(character.name));
  }

  return pool;
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function makePairs(pool) {
  const pairs = [];
  const limitValue = costLimit.value === "none" ? Infinity : Number(costLimit.value);

  for (let i = 0; i < pool.length; i++) {
    for (let j = noSamePair.checked ? i + 1 : i; j < pool.length; j++) {
      if (noSamePair.checked && i === j) {
        continue;
      }

      const total = costNumber(pool[i]) + costNumber(pool[j]);

      if (total <= limitValue) {
        pairs.push([pool[i], pool[j]]);
      }
    }
  }

  return pairs;
}

function renderCards() {
  const keyword = searchBox.value.trim().toLowerCase();
  const costValue = costFilter.value;
  const showValue = showFilter.value;

  cardsElement.innerHTML = "";

  const visibleCharacters = characters.filter((character) => {
    const matchKeyword = character.name.toLowerCase().includes(keyword);
    const matchCost = costValue === "all" || character.cost === costValue;

    let matchShow = true;

    if (showValue === "in") {
      matchShow = enabled[character.name];
    }

    if (showValue === "out") {
      matchShow = !enabled[character.name];
    }

    if (showValue === "favorite") {
      matchShow = favorites[character.name];
    }

    return matchKeyword && matchCost && matchShow;
  });

  visibleCharacters.forEach((character) => {
    const card = document.createElement("div");
    card.className = `card cost-${character.cost.replace(".", "-")} ${enabled[character.name] ? "" : "out"}`;

    card.innerHTML = `
      <div class="card-top">
        <div class="name">${escapeHtml(character.name)}</div>
        <button class="star-btn" title="お気に入り">${favorites[character.name] ? "★" : "☆"}</button>
      </div>

      <div class="cost">Cost ${character.cost}</div>

      <div class="badge-row">
        <span class="badge inout">${enabled[character.name] ? "IN" : "OUT"}</span>
        ${favorites[character.name] ? '<span class="badge favorite">★Favorite</span>' : ""}
      </div>

      <div class="card-actions">
        <button class="mini-btn toggle">IN/OUT</button>
        <button class="mini-btn edit">編集</button>
        <button class="mini-btn delete">削除</button>
      </div>
    `;

    card.querySelector(".star-btn").addEventListener("click", (event) => {
      event.stopPropagation();
      favorites[character.name] = !favorites[character.name];
      saveData();
      renderAll();
    });

    card.querySelector(".toggle").addEventListener("click", (event) => {
      event.stopPropagation();
      enabled[character.name] = !enabled[character.name];
      saveData();
      renderAll();
    });

    card.querySelector(".edit").addEventListener("click", (event) => {
      event.stopPropagation();
      editingName = character.name;
      charNameInput.value = character.name;
      charCostInput.value = character.cost;
      charNameInput.focus();
      showToast("編集モードにしました");
    });

    card.querySelector(".delete").addEventListener("click", (event) => {
      event.stopPropagation();
      deleteCharacter(character.name);
    });

    card.addEventListener("click", () => {
      enabled[character.name] = !enabled[character.name];
      saveData();
      renderAll();
    });

    cardsElement.appendChild(card);
  });

  renderStatus();
}

function renderStatus() {
  const enabledCount = characters.filter((character) => enabled[character.name]).length;
  const favoriteCount = characters.filter((character) => favorites[character.name]).length;

  statusElement.textContent =
    `抽選対象：${enabledCount} / ${characters.length}人　お気に入り：${favoriteCount}人　表示中：${cardsElement.children.length}人`;

  const costs = ["3.0", "2.5", "2.0", "1.5"];

  costStatsElement.innerHTML = costs.map((cost) => {
    const total = characters.filter((character) => character.cost === cost).length;
    const inCount = characters.filter((character) => {
      return character.cost === cost && enabled[character.name];
    }).length;

    return `
      <div class="stat">
        Cost ${cost}
        <small>${inCount} / ${total} IN</small>
      </div>
    `;
  }).join("");
}

function renderHistory() {
  if (historyList.length === 0) {
    historyElement.textContent = "なし";
    return;
  }

  historyElement.innerHTML = historyList.map((item, index) => {
    if (item.type === "pair") {
      return `${index + 1}. ${escapeHtml(item.names[0])} + ${escapeHtml(item.names[1])}（合計Cost ${item.totalCost}）`;
    }

    return `${index + 1}. ${escapeHtml(item.name)}（Cost ${item.cost}）`;
  }).join("<br>");
}

function renderAll() {
  renderCards();
  renderHistory();
}

function startRoulette(finalText, callback) {
  const pool = getBasePool();

  if (pool.length === 0) {
    resultText.textContent = "抽選対象がいません";
    return;
  }

  let count = 0;
  resultText.classList.add("rolling");

  const timer = setInterval(() => {
    const temp = randomItem(pool);
    resultText.textContent = temp.name;
    count++;

    if (count >= 18) {
      clearInterval(timer);
      resultText.textContent = finalText;
      resultText.classList.remove("rolling");
      callback();
    }
  }, 65);
}

function pickCharacter() {
  const mode = getPickMode();
  const pool = getBasePool();

  if (mode === "single") {
    pickSingle(pool);
  } else {
    pickPair(pool);
  }
}

function pickSingle(pool) {
  if (pool.length === 0) {
    resultText.textContent = "抽選対象がいません";
    return;
  }

  let usablePool = pool;

  if (usablePool.length >= 2 && lastPickNames.length > 0) {
    const filtered = usablePool.filter((character) => {
      return !lastPickNames.includes(character.name);
    });

    if (filtered.length > 0) {
      usablePool = filtered;
    }
  }

  const chosen = randomItem(usablePool);
  const finalText = `${chosen.name} / Cost ${chosen.cost}`;

  startRoulette(finalText, () => {
    lastPickNames = [chosen.name];

    historyList.unshift({
      type: "single",
      name: chosen.name,
      cost: chosen.cost
    });

    historyList = historyList.slice(0, 20);
    saveData();
    renderHistory();
  });
}

function pickPair(pool) {
  if (pool.length < 2 && noSamePair.checked) {
    resultText.textContent = "2人抽選には2キャラ以上必要です";
    return;
  }

  const pairs = makePairs(pool);

  if (pairs.length === 0) {
    resultText.textContent = "条件に合う組み合わせがありません";
    return;
  }

  const pair = randomItem(pairs);
  const total = costNumber(pair[0]) + costNumber(pair[1]);

  const finalText =
    `P1：${pair[0].name} / P2：${pair[1].name} / 合計Cost ${total.toFixed(1)}`;

  startRoulette(finalText, () => {
    lastPickNames = [pair[0].name, pair[1].name];

    historyList.unshift({
      type: "pair",
      names: [pair[0].name, pair[1].name],
      totalCost: total.toFixed(1)
    });

    historyList = historyList.slice(0, 20);
    saveData();
    renderHistory();
  });
}

function allIn() {
  characters.forEach((character) => {
    enabled[character.name] = true;
  });

  saveData();
  renderAll();
}

function allOut() {
  characters.forEach((character) => {
    enabled[character.name] = false;
  });

  saveData();
  renderAll();
}

function reverseInOut() {
  characters.forEach((character) => {
    enabled[character.name] = !enabled[character.name];
  });

  saveData();
  renderAll();
}

function onlyCost(cost) {
  characters.forEach((character) => {
    enabled[character.name] = character.cost === cost;
  });

  saveData();
  renderAll();
}

function clearFavorites() {
  characters.forEach((character) => {
    favorites[character.name] = false;
  });

  saveData();
  renderAll();
}

function resetHistory() {
  historyList = [];
  lastPickNames = [];
  resultText.textContent = "抽選ボタンを押してね";
  saveData();
  renderAll();
}

function resetData() {
  if (!confirm("キャラ追加・IN/OUT・お気に入り・履歴を初期化します。いいですか？")) {
    return;
  }

  resetToDefault(true);
  resultText.textContent = "初期化しました";
  renderAll();
}

function addOrUpdateCharacter() {
  const name = charNameInput.value.trim();
  const cost = charCostInput.value;

  if (name === "") {
    showToast("キャラ名を入力してください");
    return;
  }

  const existing = characters.find((character) => character.name === name);

  if (editingName !== null) {
    const target = characters.find((character) => character.name === editingName);

    if (target) {
      const oldName = target.name;

      target.name = name;
      target.cost = cost;

      enabled[name] = enabled[oldName] ?? true;
      favorites[name] = favorites[oldName] ?? false;

      if (oldName !== name) {
        delete enabled[oldName];
        delete favorites[oldName];
      }

      historyList = historyList.map((item) => renameHistoryItem(item, oldName, name));

      editingName = null;
      showToast("更新しました");
    }
  } else if (existing) {
    existing.cost = cost;
    showToast("同名キャラのCostを更新しました");
  } else {
    characters.push({ name, cost });
    enabled[name] = true;
    favorites[name] = false;
    showToast("追加しました");
  }

  charNameInput.value = "";
  charCostInput.value = "2.5";

  sortCharacters();
  saveData();
  renderAll();
}

function renameHistoryItem(item, oldName, newName) {
  if (item.type === "single" && item.name === oldName) {
    return { ...item, name: newName };
  }

  if (item.type === "pair") {
    return {
      ...item,
      names: item.names.map((name) => {
        return name === oldName ? newName : name;
      })
    };
  }

  return item;
}

function clearEdit() {
  editingName = null;
  charNameInput.value = "";
  charCostInput.value = "2.5";
}

function deleteCharacter(name) {
  if (!confirm(`${name} を削除しますか？`)) {
    return;
  }

  characters = characters.filter((character) => character.name !== name);
  delete enabled[name];
  delete favorites[name];

  historyList = historyList.filter((item) => {
    if (item.type === "single") {
      return item.name !== name;
    }

    return !item.names.includes(name);
  });

  saveData();
  renderAll();
}

function sortCharacters() {
  const costOrder = {
    "3.0": 1,
    "2.5": 2,
    "2.0": 3,
    "1.5": 4
  };

  characters.sort((a, b) => {
    if (costOrder[a.cost] !== costOrder[b.cost]) {
      return costOrder[a.cost] - costOrder[b.cost];
    }

    return a.name.localeCompare(b.name, "ja");
  });
}

async function exportSettings() {
  const data = {
    characters,
    enabled,
    favorites,
    historyList
  };

  const text = JSON.stringify(data);

  try {
    await navigator.clipboard.writeText(text);
    showToast("設定をコピーしました");
  } catch (e) {
    prompt("この設定をコピーしてください", text);
  }
}

function importSettings() {
  const text = prompt("設定データを貼り付けてください");

  if (!text) {
    return;
  }

  try {
    const data = JSON.parse(text);

    if (!Array.isArray(data.characters)) {
      throw new Error("charactersがありません");
    }

    characters = data.characters;
    enabled = data.enabled || {};
    favorites = data.favorites || {};
    historyList = data.historyList || [];

    characters.forEach((character) => {
      if (enabled[character.name] === undefined) {
        enabled[character.name] = true;
      }

      if (favorites[character.name] === undefined) {
        favorites[character.name] = false;
      }
    });

    sortCharacters();
    saveData();
    renderAll();
    showToast("設定を読み込みました");
  } catch (e) {
    alert("読み込みに失敗しました。設定データを確認してください。");
  }
}

document.getElementById("pickBtn").addEventListener("click", pickCharacter);
document.getElementById("themeBtn").addEventListener("click", changeTheme);

document.getElementById("allInBtn").addEventListener("click", allIn);
document.getElementById("allOutBtn").addEventListener("click", allOut);
document.getElementById("reverseBtn").addEventListener("click", reverseInOut);
document.getElementById("favClearBtn").addEventListener("click", clearFavorites);

document.getElementById("cost3Btn").addEventListener("click", () => onlyCost("3.0"));
document.getElementById("cost25Btn").addEventListener("click", () => onlyCost("2.5"));
document.getElementById("cost2Btn").addEventListener("click", () => onlyCost("2.0"));
document.getElementById("cost15Btn").addEventListener("click", () => onlyCost("1.5"));

document.getElementById("historyResetBtn").addEventListener("click", resetHistory);
document.getElementById("dataResetBtn").addEventListener("click", resetData);
document.getElementById("exportBtn").addEventListener("click", exportSettings);
document.getElementById("importBtn").addEventListener("click", importSettings);

document.getElementById("addCharBtn").addEventListener("click", addOrUpdateCharacter);
document.getElementById("clearEditBtn").addEventListener("click", clearEdit);

searchBox.addEventListener("input", renderCards);
costFilter.addEventListener("change", renderCards);
showFilter.addEventListener("change", renderCards);

poolMode.addEventListener("change", saveData);
costLimit.addEventListener("change", saveData);
avoidHistory.addEventListener("change", saveData);
noSamePair.addEventListener("change", saveData);

loadData();
sortCharacters();
renderAll();
