const https = require("https");

function getLatestBitcoinBlock() {
	return new Promise((resolve, reject) => {
		https
			.get("https://xchain.io/api/network", (resp) => {
				let data = "";

				resp.on("data", (chunk) => {
					data += chunk;
				});

				resp.on("end", () => {
					const jsonData = JSON.parse(data);
					const blockHeight = jsonData.network_info.mainnet.block_height;
					resolve(blockHeight);
				});
			})
			.on("error", (err) => {
				reject(err);
			});
	});
}

module.exports = getLatestBitcoinBlock;
