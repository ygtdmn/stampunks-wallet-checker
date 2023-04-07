const punks = require("./punksIssuances.json");
const fs = require("fs");
const addressPunkCountMap = new Map();

for (const punk of punks) {
	const { issuer, quantity } = punk;
	const currentCount = addressPunkCountMap.get(issuer) || 0;
	addressPunkCountMap.set(issuer, currentCount + Number(quantity));
}

const addressPunkCountArray = Array.from(addressPunkCountMap.entries()).map(
	([address, count]) => ({ address, count })
);

addressPunkCountArray.sort((a, b) => b.count - a.count);

console.log(addressPunkCountArray);

fs.writeFileSync("addressPunkCount.json", JSON.stringify(addressPunkCountArray));
