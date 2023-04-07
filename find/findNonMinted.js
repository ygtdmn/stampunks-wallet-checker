const punks = require("./punksIssuances.json");
const fs = require("fs");
const minted = [];
const nonminted = [];

for (const punk of punks) {
	minted.push(punk.punkId);
}

for (let i = 0; i < 10000; i++) {
	if (minted.includes(i)) continue;
	nonminted.push(i);
}

fs.writeFileSync("nonMinted.json", JSON.stringify(nonminted));
