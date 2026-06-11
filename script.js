document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "hoshiSimplePickerV1";

  const characters = [
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

  let enabled = {};
  let favorites = {};
  let historyList = [];
  let lastPickNames = [];
  let isLight = false;

  const resultText = document.getElementById("resultText");
  const cardsElement = document.getElementById("cards");
  const statusElement = document.getElementById("status");
  const historyElement = document.getElementById("history");

  const searchBox = document.getElementById("searchBox");
  const costFilter = document.getElementById("costFilter");
  const showFilter = document.getElementById("showFilter");
  const poolMode = document.getElementById("poolMode");
  const costLimit = document.getElementById("costLimit");
  const avoidRecent = document.getElementById("avoidRecent");

  function loadData() {
    characters.forEach((character) => {
      enabled[character.name] = true;
      favorites[character.name] = false;
    });

    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

      if (saved) {
        enabled = saved.enabled || enabled;
        favorites = saved.favorites || favorites;
        historyList = saved.historyList || [];
        isLight = saved.isLight || false;
      }
    } catch (e) {
      console.log(e);
    }

    if (isLight) {
      document.body.classList.add("light");
      document.getElementById("themeBtn").textContent = "☀";
    }
  }

  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        enabled,
        favorites,
        historyList,
        isLight
      }));
    } catch (e) {
      console.log(e);
    }
  }

  function getPickMode() {
    return document.querySelector('input[name="pickMode"]:checked').value;
  }

  function getPool() {
    let pool = characters.slice();

    if (poolMode.value === "enabled") {
      pool = pool.filter((character) => enabled[character.name]);
    }

    if (poolMode.value === "favorite") {
      pool = pool.filter((character) => favorites[character.name]);
    }

    if (avoidRecent.checked) {
      const recentNames = historyList
        .slice(0, 5)
        .flatMap((item) => item.names);

      pool = pool.filter((character) => !recentNames.includes(character.name));
    }

    return pool;
  }

  function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
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
          <div class="name">${character.name}</div>
          <button class="star-btn" type="button">${favorites[character.name] ? "★" : "☆"}</button>
        </div>

        <div class="cost">Cost ${character.cost}</div>

        <div class="badge-row">
          <span class="badge inout">${enabled[character.name] ? "IN" : "OUT"}</span>
          ${favorites[character.name] ? '<span class="badge favorite">★</span>' : ""}
        </div>
      `;

      card.addEventListener("click", () => {
        enabled[character.name] = !enabled[character.name];
        saveData();
        renderAll();
      });

      const starButton = card.querySelector(".star-btn");

      starButton.addEventListener("click", (event) => {
        event.stopPropagation();
        favorites[character.name] = !favorites[character.name];
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
  }

  function renderHistory() {
    if (historyList.length === 0) {
      historyElement.textContent = "なし";
      return;
    }

    historyElement.innerHTML = historyList.map((item, index) => {
      if (item.type === "pair") {
        return `${index + 1}. ${item.names[0]} + ${item.names[1]}（合計Cost ${item.totalCost}）`;
      }

      return `${index + 1}. ${item.names[0]}（Cost ${item.cost}）`;
    }).join("<br>");
  }

  function renderAll() {
    renderCards();
    renderHistory();
  }

  function startRoulette(finalText, callback) {
    const pool = getPool();

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

      if (count >= 16) {
        clearInterval(timer);
        resultText.textContent = finalText;
        resultText.classList.remove("rolling");
        callback();
      }
    }, 60);
  }

  function pick() {
    const mode = getPickMode();

    if (mode === "single") {
      pickSingle();
    } else {
      pickPair();
    }
  }

  function pickSingle() {
    let pool = getPool();

    if (pool.length === 0) {
      resultText.textContent = "抽選対象がいません";
      return;
    }

    if (pool.length >= 2 && lastPickNames.length > 0) {
      const filtered = pool.filter((character) => !lastPickNames.includes(character.name));

      if (filtered.length > 0) {
        pool = filtered;
      }
    }

    const chosen = randomItem(pool);
    const finalText = `${chosen.name} / Cost ${chosen.cost}`;

    startRoulette(finalText, () => {
      lastPickNames = [chosen.name];

      historyList.unshift({
        type: "single",
        names: [chosen.name],
        cost: chosen.cost
      });

      historyList = historyList.slice(0, 10);
      saveData();
      renderHistory();
    });
  }

  function pickPair() {
    const pool = getPool();

    if (pool.length < 2) {
      resultText.textContent = "2人抽選には2キャラ以上必要です";
      return;
    }

    const pairs = [];
    const limit = costLimit.value === "none" ? Infinity : Number(costLimit.value);

    for (let i = 0; i < pool.length; i++) {
      for (let j = i + 1; j < pool.length; j++) {
        const total = Number(pool[i].cost) + Number(pool[j].cost);

        if (total <= limit) {
          pairs.push([pool[i], pool[j]]);
        }
      }
    }

    if (pairs.length === 0) {
      resultText.textContent = "条件に合う組み合わせがありません";
      return;
    }

    const pair = randomItem(pairs);
    const total = Number(pair[0].cost) + Number(pair[1].cost);
    const finalText = `P1：${pair[0].name} / P2：${pair[1].name} / 合計Cost ${total.toFixed(1)}`;

    startRoulette(finalText, () => {
      lastPickNames = [pair[0].name, pair[1].name];

      historyList.unshift({
        type: "pair",
        names: [pair[0].name, pair[1].name],
        totalCost: total.toFixed(1)
      });

      historyList = historyList.slice(0, 10);
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

  function onlyCost(cost) {
    characters.forEach((character) => {
      enabled[character.name] = character.cost === cost;
    });

    saveData();
    renderAll();
  }

  function changeTheme() {
    isLight = !isLight;
    document.body.classList.toggle("light", isLight);
    document.getElementById("themeBtn").textContent = isLight ? "☀" : "☾";
    saveData();
  }

  document.getElementById("pickBtn").addEventListener("click", pick);
  document.getElementById("themeBtn").addEventListener("click", changeTheme);

  document.getElementById("allInBtn").addEventListener("click", allIn);
  document.getElementById("allOutBtn").addEventListener("click", allOut);
  document.getElementById("cost3Btn").addEventListener("click", () => onlyCost("3.0"));
  document.getElementById("cost25Btn").addEventListener("click", () => onlyCost("2.5"));
  document.getElementById("cost2Btn").addEventListener("click", () => onlyCost("2.0"));
  document.getElementById("cost15Btn").addEventListener("click", () => onlyCost("1.5"));

  searchBox.addEventListener("input", renderCards);
  costFilter.addEventListener("change", renderCards);
  showFilter.addEventListener("change", renderCards);

  poolMode.addEventListener("change", saveData);
  costLimit.addEventListener("change", saveData);
  avoidRecent.addEventListener("change", saveData);

  loadData();
  renderAll();
});
