const userInputs = {
	enabled: false,
	headers: [],
	domains: [],
}

chrome.runtime.onInstalled.addListener(() => {
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
chrome.webRequest.onSendHeaders.addListener(
	(details) => {
		if (!userInputs.enabled) return
		console.log('sending headers', details)
	},
	{ urls: ['<all_urls>'] },
	[]
)
