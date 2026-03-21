// Redirect patterns per site
const FEED_PATTERNS = [
  { site: "linkedin", pattern: /^https:\/\/www\.linkedin\.com\/feed\/?(\?.*)?$/, redirect: "https://www.linkedin.com/mynetwork/" },
  { site: "youtube", pattern: /^https:\/\/www\.youtube\.com\/?(\?.*)?$/, redirect: "https://www.youtube.com/feed/subscriptions" },
];

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) {
    checkAndRedirect(tabId, changeInfo.url);
  }
});

chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.tabs.get(tabId, (tab) => {
    if (tab.url) {
      checkAndRedirect(tabId, tab.url);
    }
  });
});

function checkAndRedirect(tabId, url) {
  chrome.storage.local.get({ sites: {} }, (data) => {
    for (const { site, pattern, redirect } of FEED_PATTERNS) {
      // Skip if this site is explicitly disabled
      if (data.sites[site] === false) continue;

      if (pattern.test(url)) {
        chrome.tabs.update(tabId, { url: redirect });
        return;
      }
    }
  });
}
