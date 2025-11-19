let stations = [];

// --- CSV を読み込む ---
fetch("data.csv")
  .then(response => response.text())
  .then(text => {
    stations = parseCSV(text);
  });

// --- CSV を配列に変換 ---
function parseCSV(text) {
  const lines = text.trim().split("\n");
  return lines.map(line => {
    const [abbr, name, yomi] = line.split(",");
    return { abbr, name, yomi };
  });
}

// --- Enterキー または ボタン押下で検索 ---
function executeSearch() {
  const keyword = document.getElementById("searchBox").value.trim();
  const resultArea = document.getElementById("resultArea");

  if (keyword === "") {
    resultArea.innerHTML = "";
    return;
  }

  const result = stations.filter(item =>
    item.abbr.includes(keyword) ||
    item.name.includes(keyword) ||
    item.yomi.includes(keyword)
  );

  if (result.length === 0) {
    resultArea.innerHTML = "<p>該当する駅がありません</p>";
    return;
  }

  resultArea.innerHTML = result
    .map(item =>
      `<div class="resultItem">
         <strong>${item.name}</strong>（${item.yomi}）  
         <br>電報略号：<span class="abbr">${item.abbr}</span>
       </div>`
    )
    .join("");
}

// --- ボタン押下 ---
document.getElementById("searchButton").addEventListener("click", executeSearch);

// --- Enterキー ---
document.getElementById("searchBox").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    executeSearch();
  }
});
