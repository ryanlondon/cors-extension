document.addEventListener('DOMContentLoaded', () => {
	const textFields = ['domains', 'request-headers', 'response-headers']
	const checkbox = 'enabled'

	const enabled = document.getElementById(checkbox)
	enabled.addEventListener('click', handleCheckboxChange)
	loadSavedCheckboxValue(checkbox)

	textFields.forEach((fieldName) => {
		document.getElementById(fieldName).addEventListener('keyup', handleTextFieldChange)
		loadSavedTextFieldValue(fieldName)
	})
})

function handleTextFieldChange(e) {
	const key = e.target.id
	chrome.runtime.sendMessage({ [key]: e.target.value })
}

function handleCheckboxChange(e) {
	const key = e.target.id
	const iconStatus = e.target.checked ? 'enabled' : 'disabled'
	chrome.runtime.sendMessage({ [key]: e.target.checked })
	chrome.browserAction.setIcon({
		path: `icons/cors-extension-${iconStatus}-64.png`,
	})
}

function loadSavedTextFieldValue(key) {
	chrome.storage.local.get(key, (result) => {
		document.getElementById(key).value = result[key]
	})
}

function loadSavedCheckboxValue(key) {
	chrome.storage.local.get(key, (result) => {
		document.getElementById(key).checked = result[key]
	})
}
