const fs = require("fs");

(async () => {
	const startBlock = 779652;
	let currentBlock = startBlock;
	let allIssuances = [];

	while (true) {
		console.log(`Fetching block ${currentBlock}...`);
		const url = `https://xchain.io/api/issuances/${currentBlock}`;
		const response = await fetch(url);
		const data = await response.json();

		if (data.data.length !== 0) {
			allIssuances = allIssuances.concat(data.data);
		}

		currentBlock++;

		if (currentBlock > 784323) {
			break;
		}
	}

	fs.writeFileSync("allIssuances.json", JSON.stringify(allIssuances, null, 2));
	console.log("All issuances saved to allIssuances.json");
})();
