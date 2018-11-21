const userInputs = {
	headers: [],
	domains: [],
}

chrome.runtime.onInstalled.addListener(function() {
	console.log('The CORS extension has loaded')
})

chrome.runtime.onMessage.addListener((message) => {
	const key = Object.keys(message)[0]
	const arr = message[key].split('\n')
	userInputs[key] = arr
	console.log(userInputs)
})

// TODO: make this work
chrome.webRequest.onBeforeSendHeaders.addListener(
	function(details) {
		console.log('sending headers', details)
	},
	{ urls: userInputs.domains },
	['blocking', 'requestHeaders']
)
