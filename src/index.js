const cosmic = require("cosmiconfig");
const explorer = cosmic.cosmiconfigSync("redditchatrelay", {
	searchPlaces: [
		"package.json",
		"config.json",
		".redditchatrelayrc",
		".redditchatrelayrc.json",
		".redditchatrelayrc.yaml",
		".redditchatrelayrc.yml",
		".redditchatrelayrc.js",
		"redditchatrelay.config.js",
	],
});
const config = explorer.search().config;

const { version } = require("../package.json");

const Snoowrap = require("snoowrap");
const reddit = new Snoowrap(Object.assign(config.credentials, {
	userAgent: `Reddit Chat Relay v${version}`,
}));

const Sendbird = require("sendbird");
const sb = new Sendbird({
	appId: "2515BDA8-9D3A-47CF-9325-330BC37ADA13",
});

const FormData = require("form-data");
const { CookieJar } = require("tough-cookie");

const got = require("got");
const matterbridgeGot = got.extend({
	headers: {
		Authorization: config.apiToken ? "Bearer " + config.apiToken : "",
	},
	prefixUrl: config.apiHost,
});

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

/**
 * Launch the relay.
 */
async function launch() {
	const form = new FormData();
	form.append("user", config.credentials.username);
	form.append("passwd", config.credentials.password);
	form.append("api_type", "json");

	const res = await got.post({
		body: form,
		responseType: "json",
		url: "https://ssl.reddit.com/api/login",
	});

	const cookieJar = new CookieJar();
	cookieJar.setCookieSync("reddit_session=" + encodeURIComponent(res.body.json.data.cookie), "https://s.reddit.com");

	const sbRes = await got({
		cookieJar,
		url: "https://s.reddit.com/api/v1/sendbird/me",
	});
	const sbInfo = JSON.parse(sbRes.body);
	const id = await reddit.getMe().id;

	sb.connect("t2_" + id, sbInfo.sb_access_token, self => {
		const handler = new sb.ChannelHandler();
		handler.onMessageReceived = (channel, message) => {
			if (channel.url !== config.channel) return;
			if (message.sender.nickname === self.nickname) return;

			const prefix = getSnoomojiURL(message);

			matterbridgeGot.post({
				json: {
					gateway: config.apiGateway,
					text: prefix + message.message,
					username: message.sender.nickname,
				},
				url: "api/message",
			}).catch(() => {
				// It's ok if this fails
			});
		};
		sb.addChannelHandler("handler", handler);

		sb.GroupChannel.getChannel(config.channel, (channel, err) => {
			if (err) throw err;

			setInterval(async () => {
				try {
					const msgRes = await matterbridgeGot({
						responseType: "json",
						url: "api/messages",
					});
					msgRes.body.forEach(message => {
						if (message.event != "" || message.gateway !== config.apiGateway) return;
						channel.sendUserMessage(message.username + message.text, () => {
							// Required callback
						});
					});
				} catch (error) {
					// It's ok if this fails
				}
			}, 500);
		});
	});
}
launch();