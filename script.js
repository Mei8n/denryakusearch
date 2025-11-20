let stations = [];

//CSVを読み込む
fetch("data.csv")
	.then(response => response.text())
	.then(text => {
		stations = parseCSV(text);
	});

//CSVを配列に変換
function parseCSV(text) {
	text = text.replace(/^\uFEFF/, "");
	const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
	return lines.map(line => {
		const parts = line.split(",");
		while (parts.length < 3) {
			parts.push("");
		}
		const abbr = parts[0].trim();
		const name = parts[1].trim();
		const yomi = parts[2].trim();
		return { abbr, name, yomi };
	});
}

//Enterまたはボタン押下で検索
function executeSearch() {
	const keyword = document.getElementById("searchBox").value.trim();
	const resultArea = document.getElementById("resultArea");

	if (keyword === "") {
		resultArea.innerHTML = "";
		return;
	}

	// 括弧付き駅名 → 括弧削除バージョンを作る関数
	const normalize = (str) => str.replace(/\(.*?\)/g, "");

	const result = stations.filter(item => {
		const nameNormalized = normalize(item.name);

		return (
			item.abbr === keyword ||
			item.name === keyword ||
			item.yomi === keyword ||
			nameNormalized === keyword
		);
	});

	if (result.length === 0) {
		resultArea.innerHTML = "<p>該当する駅がありません</p>";
		return;
	}

	resultArea.innerHTML = result
		.map(item =>
			`<div class="resultItem">
         <strong>${item.name}</strong>(${item.yomi})
         <br>電報略号：<span class="abbr">${item.abbr}</span>
       </div>`
		)
		.join("");
}

//ボタン押下
document.getElementById("searchButton").addEventListener("click", executeSearch);

//Enterキー
document.getElementById("searchBox").addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		executeSearch();
	}
});
