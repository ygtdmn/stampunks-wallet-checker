const fs = require("fs");
const punks = require("./punksIssuances.json");

const validPunks = [];

for (let i = 0; i < punks.length; i++) {
	const punk = punks[i];
	if (Number(punk.quantity > 1)) {
		validPunks.push({
			asset: punk.asset,
			punkId: punk.punkId,
			issuer: punk.issuer,
		});
	}
}

fs.writeFileSync("invalidQuantity.json", JSON.stringify(validPunks));
