const fs = require("fs");
const path = require("path");

(() => {
	const punksPath = path.join(__dirname, "punks.json");
	const allIssuancesPath = path.join(__dirname, "allIssuances.json");
	const punksIssuancesPath = path.join(__dirname, "allPunksIssuances.json");

	const punks = JSON.parse(fs.readFileSync(punksPath, "utf-8"));
	const allIssuances = JSON.parse(fs.readFileSync(allIssuancesPath, "utf-8"));

	// sort all issuances by tx index
	allIssuances.sort((a, b) => a.tx_index - b.tx_index);

	const punksIssuances = punks
		.map((punk, index) => {
			const punkDescription = `STAMP:${punk}`;
			const punkDescriptionLower = `stamp:${punk}`;
			const matchingIssuance = allIssuances.find(
				(issuance) =>
					issuance.description === punkDescription ||
					issuance.description === punkDescriptionLower
			);

			if (matchingIssuance) {
				return {
					...matchingIssuance,
					punkId: index,
				};
			}
			return null;
		})
		.filter((item) => item !== null);

	fs.writeFileSync(punksIssuancesPath, JSON.stringify(punksIssuances, null, 2));
	console.log("Punks issuances saved to allPunksIssuances.json");
})();
