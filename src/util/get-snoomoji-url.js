const snoomojiPrefix = "https://www.redditstatic.com/desktop2x/img/snoomoji/";

/**
 * Gets a snoomoji URL prefix from a message.
 * @param {SendBird.UserMessage} message The message to get the snoomoji URL prefix from.
 * @returns {string} The snoomoji URL prefix for the message.
 */
function getSnoomojiURL(message) {
	try {
		const data = JSON.parse(message.data);
		if (data && data.v1 && data.v1.snoomoji) {
			const extension = data.v1.snoomoji === "partyparrot" ? "gif" : "png";
			return snoomojiPrefix + data.v1.snoomoji + "." + extension + " ";
		}

		return "";
	} catch (error) {
		return "";
	}
}
module.exports = getSnoomojiURL;