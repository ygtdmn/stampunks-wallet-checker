const address = "";

const allIssuances = require("./allIssuances.json");
const punksIssuances = require("./punksIssuances.json");

const assets = punksIssuances
	.filter((issuance) => issuance.issuer === address)
	.map((issuance) => issuance.asset);
const allAssets = allIssuances
	.filter(
		(issuance) => issuance.issuer === address && Number(issuance.quantity) === 1
	)
	.map((issuance) => issuance.asset);

// find the difference between the two arrays
const difference = allAssets.filter((x) => !assets.includes(x));
console.log(difference);
