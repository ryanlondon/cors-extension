import '../../img/cors-extension-disabled-64.png'
import '../../img/cors-extension-enabled-64.png'

const userInputs = {
  enabled: false,
  headers: [],
  'request-headers': [],
  'response-headers': [],
}

const updateUserInputs = ([key, value]) => {
  switch (key) {
    case 'enabled':
      const iconStatus = value ? 'enabled' : 'disabled'
      chrome.browserAction.setIcon({
        path: `cors-extension-${iconStatus}-64.png`,
      })
      userInputs[key] = value
      break
    default:
      const lines = value.split('\n')
      userInputs[key] = lines
      break
  }
}

const initialize = () => {
  chrome.storage.local.get(null, result => {
    console.log('reading from local storage', result)
    Object.entries(result).forEach(updateUserInputs)
  })
}

const isInitiatorInDomain = ({ initiator }) => {
  if (!initiator) return false
  const lowerCasedInitiator = initiator ? initiator.toUpperCase() : null

  return userInputs.domains.findIndex(url => url.toUpperCase() === lowerCasedInitiator) >= 0
}

const parseHeaders = headers => {
  return headers.map(header => {
    const split = header.split(':')
    return {
      name: split[0].trim(),
      value: split[1].trim(),
    }
  })
}

const addOrReplaceHeaders = (target, headersToAdd) => {
  const headerMap = target.reduce((acc, header) => {
    acc[header.name.toUpperCase()] = header
    return acc
  }, {})
  headersToAdd.forEach(header => {
    headerMap[header.name.toUpperCase()] = header
  })
  return Object.values(headerMap)
}

chrome.runtime.onInstalled.addListener(() => {
  initialize()
})

chrome.runtime.onStartup.addListener(() => {
  initialize()
})

chrome.runtime.onMessage.addListener(message => {
  const [key, value] = Object.entries(message)[0]
  chrome.storage.local.set({ [key]: value })
  updateUserInputs([key, value])
})

chrome.webRequest.onBeforeSendHeaders.addListener(
  details => {
    if (!userInputs.enabled || !isInitiatorInDomain(details)) return
    const headersToAdd = parseHeaders(userInputs['request-headers'])
    return {
      requestHeaders: addOrReplaceHeaders(details.requestHeaders, headersToAdd),
    }
  },
  { urls: ['<all_urls>'] },
  ['requestHeaders', 'blocking']
)

chrome.webRequest.onHeadersReceived.addListener(
  details => {
    if (!userInputs.enabled || !isInitiatorInDomain(details)) return
    const headersToAdd = parseHeaders(userInputs['response-headers'])
    return {
      responseHeaders: addOrReplaceHeaders(details.responseHeaders, headersToAdd),
    }
  },
  { urls: ['<all_urls>'] },
  ['responseHeaders', 'blocking', 'extraHeaders']
)
