const fs = require("fs");
const XLSX = require("xlsx");
const punks = require("../punksIssuances.json");
const allPunks = require("../allPunksIssuances.json");
const allIssuances = require("../allIssuances.json");

// findInvalidPunks
const invalidPunks = [];
const invalidLockedPunks = [];

for (let i = 0; i < allPunks.length; i++) {
	const punk = allPunks[i];
	if (punk.quantity === "1" && !punk.divisible) continue;
	if (punks.find((p) => p.asset === punk.asset)) continue;
	if (punks.find((p) => p.punkId === punk.punkId)) continue;

	invalidPunks.push({
		asset: punk.asset,
		punkId: punk.punkId,
		issuer: punk.issuer,
	});

	for (let i = 0; i < allIssuances.length; i++) {
		const issuance = allIssuances[i];
		if (issuance.asset !== punk.asset) continue;
		if (issuance.locked) {
			invalidLockedPunks.push({
				asset: punk.asset,
				punkId: punk.punkId,
				issuer: punk.issuer,
			});
			break;
		}
	}
}

// findLockedValidPunks
const lockedPunks = [];

for (let i = 0; i < punks.length; i++) {
	const punk = punks[i];

	for (let i = 0; i < allIssuances.length; i++) {
		const issuance = allIssuances[i];
		if (issuance.asset !== punk.asset) continue;
		if (issuance.locked) {
			lockedPunks.push({
				asset: punk.asset,
				punkId: punk.punkId,
				issuer: punk.issuer,
			});
			break;
		}
	}
}

// findValidPunks
const validPunksList = [];

for (let i = 0; i < punks.length; i++) {
	const punk = punks[i];
	validPunksList.push({
		asset: punk.asset,
		punkId: punk.punkId,
		issuer: punk.issuer,
	});
}

// mapAddressPunk
const addressPunkCountMap = new Map();

for (const punk of punks) {
	const { issuer, quantity } = punk;
	const currentCount = addressPunkCountMap.get(issuer) || 0;
	addressPunkCountMap.set(issuer, currentCount + Number(quantity));
}

const addressPunkCountArray = Array.from(addressPunkCountMap.entries()).map(
	([address, count]) => ({ address, count })
);

// Sort addressPunkCountArray by count
addressPunkCountArray.sort((a, b) => b.count - a.count);

// Create Excel workbook
const workbook = XLSX.utils.book_new();

// Add sheets to the workbook
XLSX.utils.book_append_sheet(
	workbook,
	XLSX.utils.json_to_sheet(addressPunkCountArray),
	"Address Punk Count"
);
XLSX.utils.book_append_sheet(
	workbook,
	XLSX.utils.json_to_sheet(lockedPunks),
	"Valid Locked Punks"
);
XLSX.utils.book_append_sheet(
	workbook,
	XLSX.utils.json_to_sheet(validPunksList),
	"Valid Punks"
);
XLSX.utils.book_append_sheet(
	workbook,
	XLSX.utils.json_to_sheet(invalidPunks),
	"Invalid Punks"
);
XLSX.utils.book_append_sheet(
	workbook,
	XLSX.utils.json_to_sheet(invalidLockedPunks),
	"Invalid Locked Punks"
);

// Write the Excel file to disk
XLSX.writeFile(workbook, "./data/data.xlsx");
