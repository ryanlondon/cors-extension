import '../../css/style.css'
import domains from './domains'

document.addEventListener('DOMContentLoaded', () => {
  const textFieldIds = ['domains', 'request-headers', 'response-headers']
  const checkboxId = 'enabled'

  document.getElementById(checkboxId).addEventListener('click', handleCheckboxChange)
  loadSavedCheckboxValue(checkboxId)

  textFieldIds.forEach(fieldId => {
    document.getElementById(fieldId).addEventListener('keyup', handleTextFieldChange)
    loadSavedTextFieldValue(fieldId)
  })

  document.getElementById('download-config').addEventListener('click', handleDownloadConfig)
  document.getElementById('upload-config').addEventListener('click', handleUploadConfig)
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
    path: `cors-extension-${iconStatus}-64.png`,
  })
}

function loadSavedTextFieldValue(key) {
  chrome.storage.local.get(key, result => {
    document.getElementById(key).value = result[key]
  })
}

function loadSavedCheckboxValue(key) {
  chrome.storage.local.get(key, result => {
    document.getElementById(key).checked = result[key]
  })
}

function handleDownloadConfig() {
  console.log('handle download config')
}

function handleUploadConfig() {
  console.log('handle upload config')
}
