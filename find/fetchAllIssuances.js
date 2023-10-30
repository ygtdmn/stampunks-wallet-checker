const fs = require("fs");
const path = require("path");

(async () => {
	const startBlock = 784361;
	const endBlock = 814456;
	const concurrentFetches = 10;
	const resultsPerPage = 100;

	// Read the existing data from the file
	const allIssuancesPath = path.join(__dirname, "allIssuances.json");
	const existingData = fs.existsSync(allIssuancesPath)
		? JSON.parse(fs.readFileSync(allIssuancesPath, "utf-8"))
		: [];

	let allIssuances = existingData;

	const fetchBlock = async (block, page) => {
		console.log(`Fetching block ${block}, page ${page}...`);
		const url = `https://xchain.io/api/issuances/${block}/${page}/${resultsPerPage}`;
		const response = await fetch(url);
		const data = await response.json();
		return data.data;
	};

	const fetchAllBlockPages = async (block) => {
		let currentPage = 1;
		let fetchedIssuances = [];
		let hasNextPage = true;

		while (hasNextPage) {
			const blockData = await fetchBlock(block, currentPage);
			hasNextPage = blockData.length === resultsPerPage;
			fetchedIssuances = fetchedIssuances.concat(blockData);
			currentPage++;
		}

		return fetchedIssuances;
	};

	for (let i = startBlock; i <= endBlock; i += concurrentFetches) {
		const fetchPromises = [];

		for (let j = 0; j < concurrentFetches && i + j <= endBlock; j++) {
			fetchPromises.push(fetchAllBlockPages(i + j));
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

	fs.writeFileSync(allIssuancesPath, JSON.stringify(uniqueIssuances, null, 2));
	console.log("Updated issuances saved to allIssuances.json");
})();
