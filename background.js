const userInputs = {
  enabled: false,
  headers: [],
  domains: []
};

const updateUserInputs = ([key, value]) => {
  switch (key) {
    case "enabled":
      const iconStatus = value ? "enabled" : "disabled";
      chrome.browserAction.setIcon({
        path: `icons/cors-extension-${iconStatus}-64.png`
      });
      break;
      userInputs[key] = value;
    default:
      const lines = value.split("\n");
      userInputs[key] = lines;
      break;
  }
  console.log(userInputs);
};

const initialize = () => {
  chrome.storage.local.get(null, result => {
    console.log("reading from local storage", result);
    Object.entries(result).forEach(updateUserInputs);
  });
};

chrome.runtime.onInstalled.addListener(() => {
  console.log("The CORS extension has loaded");
  initialize();
});

chrome.runtime.onStartup.addListener(() => {
  initialize();
});

chrome.runtime.onMessage.addListener(message => {
  const [key, value] = Object.entries(message)[0];
  chrome.storage.local.set({ [key]: value });
  updateUserInputs([key, value]);
});

chrome.webRequest.onBeforeSendHeaders.addListener(
  details => {
    console.log("before sending headers", details);
    if (userInputs.enabled) {
      console.log("adding header!", userInputs.headers);
      details.requestHeaders.push({
        name: "Access-Control-Allow-Origin",
        value: "*"
      });
    }
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["<all_urls>"] },
  ["requestHeaders", "blocking"]
);

// TODO: make this work
chrome.webRequest.onSendHeaders.addListener(
  details => {
    // console.log("sending headers", details);
    if (!userInputs.enabled) return;
    console.log("sending headers", details);
  },
  { urls: ["<all_urls>"] },
  ["requestHeaders"]
);
