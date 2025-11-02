// background service worker: handle initial settings and simple messaging
chrome.runtime.onInstalled.addListener(() => {
  // default settings
  chrome.storage.local.get(['enabled_sites'], (res) => {
    if (!res.enabled_sites) {
      // default: enabled on youtube/facebook/instagram
      chrome.storage.local.set({
        enabled_sites: {
          "youtube.com": true,
          "facebook.com": true,
          "instagram.com": true
        }
      });
    }
  });
  console.log("Ad-Quiet Power installed");
});

// listener to toggle rules at runtime (if needed in future)
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === 'getEnabledSites') {
    chrome.storage.local.get('enabled_sites', (res) => sendResponse(res.enabled_sites || {}));
    return true;
  }
});
