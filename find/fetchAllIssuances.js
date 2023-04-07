const fs = require("fs");

(async () => {
	const startBlock = 784347;
	const endBlock = 784361;
	const concurrentFetches = 10;
	const fileName = "allIssuances.json";

	// Read the existing data from the file
	const existingData = fs.existsSync(fileName)
		? JSON.parse(fs.readFileSync(fileName))
		: [];

	let allIssuances = existingData;

	const fetchBlock = async (block) => {
		console.log(`Fetching block ${block}...`);
		const url = `https://xchain.io/api/issuances/${block}`;
		const response = await fetch(url);
		const data = await response.json();
		return data.data;
	};

	for (let i = startBlock; i <= endBlock; i += concurrentFetches) {
		const fetchPromises = [];

		for (let j = 0; j < concurrentFetches && i + j <= endBlock; j++) {
			fetchPromises.push(fetchBlock(i + j));
		}

		const fetchedBlocks = await Promise.all(fetchPromises);

		fetchedBlocks.forEach((blockData) => {
			if (blockData.length !== 0) {
				allIssuances = allIssuances.concat(blockData);
			}
		});
	}

	// Remove duplicate issuances based on their `tx_hash`
	const uniqueIssuances = allIssuances.filter(
		(issuance, index, self) =>
			index === self.findIndex((i) => i.tx_hash === issuance.tx_hash)
	);

	fs.writeFileSync(fileName, JSON.stringify(uniqueIssuances, null, 2));
	console.log("Updated issuances saved to allIssuances.json");
})();
