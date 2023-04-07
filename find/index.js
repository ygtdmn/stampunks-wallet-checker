const specificDescription =
	"STAMP:iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAl0lEQVR42mNgGAUUgP9QjEv8Px41eA3FZxA+w4my7D+FmIHWFtDcEsoNv72xAYzJsYBoQ3FYQnLyRDEMF6Y4iECGLMvTAWNkg2Fi5FjAgG4BiL40NwHD5SAxegYR8Rb8v6lGlOHkWsCAzwc4UhJFhR3VXU9OjqaOBW0RcnBMFQvwFAnUs4AISxgotoDcwo0cC6hbJ1PDAgCCwo+SyzKV0gAAAABJRU5ErkJggg=="; // Replace with the desired description

const fs = require("fs");

(() => {
	const allIssuances = JSON.parse(
		fs.readFileSync("allIssuances.json", "utf-8")
	);

	const filteredIssuances = allIssuances.filter(
		(issuance) =>
			issuance.description === specificDescription &&
			issuance.divisible === false
	);

	fs.writeFileSync(
		"filteredIssuances.json",
		JSON.stringify(filteredIssuances, null, 2)
	);
	console.log("Filtered issuances saved to filteredIssuances.json");
})();
