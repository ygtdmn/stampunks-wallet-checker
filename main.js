document
	.getElementById("wallet-form")
	.addEventListener("submit", async (event) => {
		event.preventDefault();
		const walletAddress = document.getElementById("wallet-address").value;
		const submitButton = event.target.querySelector("button");
		submitButton.disabled = true;
		displayLoadingBar();

		const nfts = await getNfts(walletAddress);
		displayNfts(nfts);

		const totalPunks = getTotalPunks(nfts);
		displayTotalPunks(totalPunks);

		submitButton.disabled = false;
		hideLoadingBar();
	});

function displayLoadingBar() {
	const loadingBar = document.createElement("div");
	loadingBar.classList.add("progress", "my-3");
	loadingBar.innerHTML = `
    <div
      class="progress-bar progress-bar-striped progress-bar-animated"
      role="progressbar"
      aria-valuenow="100"
      aria-valuemin="0"
      aria-valuemax="100"
      style="width: 100%"
    ></div>
  `;
	loadingBar.id = "loading-bar";
	const walletForm = document.getElementById("wallet-form");
	walletForm.parentNode.insertBefore(loadingBar, walletForm.nextSibling);
}

function hideLoadingBar() {
	const loadingBar = document.getElementById("loading-bar");
	loadingBar.parentNode.removeChild(loadingBar);
}

async function fetchPunksIssuances() {
	const response = await fetch("find/punksIssuances.json");
	const data = await response.json();
	return data;
}

async function getNfts(walletAddress) {
	const punksIssuances = await fetchPunksIssuances();
	const url = `https://xchain.io/api/balances/${walletAddress}`;
	const response = await fetch(url);
	const data = await response.json();
	console.log("Balances API response:", data);

	let nfts = data.data.filter((asset) => {
		return punksIssuances.some(
			(punkIssuance) => punkIssuance.asset === asset.asset
		);
	});

	nfts = nfts.map((nft) => {
		const punk = punksIssuances.find((punk) => punk.asset === nft.asset);
		nft.punkId = punk.punkId;
		nft.tx_hash = punk.tx_hash;
		return nft;
	});

	return nfts;
}

function displayNfts(nfts) {
	const nftContainer = document.getElementById("nft-container");
	nftContainer.innerHTML = "";

	nfts.forEach((nft) => {
		const imageBase64 = nft.description.replace(/STAMP\:/i, "");
		const imgElement = document.createElement("img");
		imgElement.src = `data:image/png;base64,${imageBase64}`;
		imgElement.alt = `${nft.asset}`;
		imgElement.classList.add("nft-image");

		const punkId = document.createElement("a");
		punkId.textContent = `Punk ID: ${nft.punkId}`;
		punkId.href = `https://xchain.io/asset/${nft.asset}`;
		punkId.target = "_blank";
		punkId.classList.add("punk-id");

		const txHash = document.createElement("p");
		txHash.textContent = `TX Hash: ${nft.tx_hash}`;
		txHash.classList.add("tx-hash");

		const checkLockedBtn = document.createElement("button");
		checkLockedBtn.textContent = "Check locked";
		checkLockedBtn.classList.add("btn", "btn-primary", "check-locked-btn");
		checkLockedBtn.onclick = async (event) => {
			await checkLockedStatus(nft, checkLockedBtn, event);
		};
		const nftWrapper = document.createElement("div");
		nftWrapper.classList.add("nft-wrapper");
		nftWrapper.appendChild(imgElement);
		nftWrapper.appendChild(punkId);
		// nftWrapper.appendChild(txHash);
		nftWrapper.appendChild(checkLockedBtn);

		nftContainer.appendChild(nftWrapper);
	});
}

async function checkLockedStatus(nft, button, event) {
	event.preventDefault();
	button.disabled = true;
	const loader = document.createElement("div");
	loader.classList.add(
		"spinner-border",
		"spinner-border-sm",
		"text-primary",
		"ml-2"
	);
	button.parentElement.appendChild(loader);

	const issuanceUrl = `https://xchain.io/api/issuances/${nft.asset}`;
	const issuanceResponse = await fetch(issuanceUrl);
	const issuanceData = await issuanceResponse.json();
	console.log("Issuance API response:", issuanceData);

	if (issuanceData.total > 0) {
		const issuance = issuanceData.data[0];
		const lockedText = document.createElement("p");
		lockedText.classList.add("locked-text");
		if (!issuance.locked) {
			lockedText.textContent = "Non-locked";
		} else {
			lockedText.textContent = "Locked";
		}

		const nftWrappers = document.querySelectorAll(".nft-wrapper");
		nftWrappers.forEach((nftWrapper) => {
			const displayedPunkId = nftWrapper.querySelector(".punk-id");

			if (displayedPunkId && displayedPunkId.textContent.includes(nft.punkId)) {
				const existingLockedText = nftWrapper.querySelector(".locked-text");
				if (existingLockedText) {
					existingLockedText.remove();
				}
				nftWrapper.appendChild(lockedText);
			}
		});
	}

	button.disabled = false;
	loader.remove();
}

function getTotalPunks(nfts) {
	let totalPunks = 0;
	nfts.forEach((nft) => {
		totalPunks += 1;
	});
	return totalPunks;
}

function displayTotalPunks(totalPunks) {
	const totalPunksElement = document.getElementById("total-punks");
	if (totalPunksElement) {
		totalPunksElement.textContent = `Total Punks: ${totalPunks}`;
	} else {
		const totalPunksDiv = document.createElement("div");
		totalPunksDiv.id = "total-punks";
		totalPunksDiv.textContent = `Total Punks: ${totalPunks}`;
		totalPunksDiv.classList.add("mt-3");
		const nftContainer = document.getElementById("nft-container");
		nftContainer.parentNode.insertBefore(totalPunksDiv, nftContainer);
	}
}
