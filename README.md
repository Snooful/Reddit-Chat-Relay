# Reddit Chat Relay

[![Travis (.com)](https://img.shields.io/travis/com/Snooful/Reddit-Chat-Relay.svg?style=popout)](https://travis-ci.com/Snooful/Reddit-Chat-Relay)

A Matterbridge relay for Reddit Chat.

## Configuration

Reddit Chat Relay can be configured in the following locations:

* `config.json`
* `.redditchatrelayrc`
* `.redditchatrelayrc.json`
* `.redditchatrelayrc.yaml",`
* `.redditchatrelayrc.yml",`
* `.redditchatrelayrc.js",`
* `redditchatrelay.config.js`

## Format

Key | Type | Description
--- | --- | ---
`apiHost` | string | The host for the Matterbridge API. If the Matterbridge API's `BindAddress` is `127.0.0.1:4242` and Reddit Relay is on the same server, the host would be `http://127.0.0.1:4242`.
`apiToken` | string | The `Token` field set for the Matterbridge API.
`credentials` | [Snoowrap credentials object](https://not-an-aardvark.github.io/snoowrap/snoowrap.html#snoowrap__anchor) | The credentials to the Reddit account.

## Example Config

Here is an example configuration:

```json
{
	"apiHost": "http://127.0.0.1:4242",
	"apiToken": "AYaRgTXx8RQWtYPKZvqJhkFY",
	"credentials": {
		"clientId": "nUl7pMOrIWEbCA",
		"clientSecret": "i6NyJE4fgkgTErCp32vaL2mgwPI",
		"password": "mmc39jiNKr6BZLuKBxpVsyf9",
		"username": "Reddit-Chat-Relay"
	}
}
```
