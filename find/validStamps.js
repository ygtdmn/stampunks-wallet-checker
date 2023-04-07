const fs = require("fs");
const punks = require("./punksIssuances.json");

const validPunks = [];

for (let i = 0; i < punks.length; i++) {
	const punk = punks[i];
	validPunks.push({ asset: punk.asset, punkId: punk.punkId });
}

fs.writeFileSync("validPunks.json", JSON.stringify(validPunks));
