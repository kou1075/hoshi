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

const enabled = {};
const historyList = [];
let lastPick = null;

characters.forEach((character) => {
  enabled[character.name] = true;
});

const cardsElement = document.getElementById("cards");
const resultElement = document.getElementById("result");
const statusElement = document.getElementById("status");
const historyElement = document.getElementById("history");
const searchBox = document.getElementById("searchBox");

function renderCards() {
  const keyword = searchBox.value.trim().toLowerCase();

  cardsElement.innerHTML = "";

  const filteredCharacters = characters.filter((character) => {
    return character.name.toLowerCase().includes(keyword);
  });

  filteredCharacters.forEach((character) => {
    const card = document.createElement("div");

    if (enabled[character.name]) {
      card.className = "card";
    } else {
      card.className = "card out";
    }

    card.innerHTML = `
      <div class="name">${character.name}</div>
      <div class="cost">Cost ${character.cost}</div>
      <div class="badge">${enabled[character.name] ? "IN" : "OUT"}</div>
    `;

    card.addEventListener("click", () => {
      enabled[character.name] = !enabled[character.name];
      renderCards();
    });

    cardsElement.appendChild(card);
  });

  const enabledCount = characters.filter((character) => {
    return enabled[character.name];
  }).length;

  statusElement.textContent = `抽選対象：${enabledCount} / ${characters.length}人`;
}

function pickCharacter() {
  let pool = characters.filter((character) => {
    return enabled[character.name];
  });

  if (pool.length === 0) {
    resultElement.textContent = "抽選対象がいません";
    return;
  }

  // 2人以上いる場合は、直前と同じキャラを出にくくする
  if (pool.length >= 2 && lastPick !== null) {
    pool = pool.filter((character) => {
      return character.name !== lastPick.name;
    });
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  const chosen = pool[randomIndex];

  lastPick = chosen;

  resultElement.textContent = `${chosen.name} / Cost ${chosen.cost}`;

  historyList.unshift(`${chosen.name}（Cost ${chosen.cost}）`);

  if (historyList.length > 10) {
    historyList.pop();
  }

  historyElement.textContent = historyList.join(" → ");
}

function allIn() {
  characters.forEach((character) => {
    enabled[character.name] = true;
  });

  renderCards();
}

function allOut() {
  characters.forEach((character) => {
    enabled[character.name] = false;
  });

  renderCards();
}

function reverse() {
  characters.forEach((character) => {
    enabled[character.name] = !enabled[character.name];
  });

  renderCards();
}

function onlyCost(cost) {
  characters.forEach((character) => {
    enabled[character.name] = character.cost === cost;
  });

  renderCards();
}

function resetHistory() {
  historyList.length = 0;
  lastPick = null;
  historyElement.textContent = "なし";
  resultElement.textContent = "抽選ボタンを押してね";
}

document.getElementById("pickBtn").addEventListener("click", pickCharacter);
document.getElementById("allInBtn").addEventListener("click", allIn);
document.getElementById("allOutBtn").addEventListener("click", allOut);
document.getElementById("reverseBtn").addEventListener("click", reverse);
document.getElementById("resetBtn").addEventListener("click", resetHistory);

document.getElementById("cost3Btn").addEventListener("click", () => {
  onlyCost("3.0");
});

document.getElementById("cost25Btn").addEventListener("click", () => {
  onlyCost("2.5");
});

document.getElementById("cost2Btn").addEventListener("click", () => {
  onlyCost("2.0");
});

document.getElementById("cost15Btn").addEventListener("click", () => {
  onlyCost("1.5");
});

searchBox.addEventListener("input", renderCards);

renderCards();