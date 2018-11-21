document.addEventListener('DOMContentLoaded', () => {
	const inputs = Array.from(document.getElementsByClassName('input'))
	inputs.forEach((input) => input.addEventListener('keyup', handleInputChange))
})

function handleInputChange(e) {
	// TODO: maybe persist inputs in localstorage?
	chrome.runtime.sendMessage({ [e.target.id]: e.target.value })
}
