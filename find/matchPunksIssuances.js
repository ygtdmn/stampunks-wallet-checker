const fs = require("fs");

(() => {
	const punks = JSON.parse(fs.readFileSync("../punks.json", "utf-8"));
	const allIssuances = JSON.parse(
		fs.readFileSync("allIssuances.json", "utf-8")
	);

	const punksIssuances = punks
		.map((punk, index) => {
			const punkDescription = `STAMP:${punk}`;
			const punkDescriptionLower = `stamp:${punk}`;
			const matchingIssuance = allIssuances.find(
				(issuance) =>
					(issuance.description === punkDescription ||
						issuance.description === punkDescriptionLower) &&
					issuance.divisible === false &&
					Number(issuance.quantity) === 1
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

	fs.writeFileSync(
		"punksIssuances.json",
		JSON.stringify(punksIssuances, null, 2)
	);
	console.log("Punks issuances saved to punksIssuances.json");
})();
