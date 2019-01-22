const userInputs = {
	enabled: false,
	headers: [],
	domains: [],
}

chrome.runtime.onInstalled.addListener(function() {
	console.log('The CORS extension has loaded')
})

chrome.runtime.onMessage.addListener((message) => {
	const [key, value] = Object.entries(message)[0]
	chrome.storage.local.set({ [key]: value })
	if (typeof value === 'string') {
		const lines = value.split('\n')
		userInputs[key] = lines
	} else {
		userInputs[key] = value
	}
})

// TODO: make this work
// chrome.webRequest.onSendHeaders.addListener(
// 	function(details) {
// 		console.log('sending headers', details)
// 	},
// 	{ urls: ['<all_urls>'], types: ['xmlhttprequest'] },
// 	['requestHeaders']
// )
