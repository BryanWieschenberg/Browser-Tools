const SITES = ["linkedin", "youtube"];

const SITE_HOSTS = {
  linkedin: "*://*.linkedin.com/*",
  youtube: "*://*.youtube.com/*",
};

chrome.storage.local.get({ sites: {} }, (data) => {
  for (const site of SITES) {
    const toggle = document.getElementById(`toggle-${site}`);
    toggle.checked = data.sites[site] !== false;
  }
});

for (const site of SITES) {
  const toggle = document.getElementById(`toggle-${site}`);
  toggle.addEventListener("change", () => {
    const enabled = toggle.checked;

    chrome.storage.local.get({ sites: {} }, (data) => {
      data.sites[site] = enabled;
      chrome.storage.local.set({ sites: data.sites });
    });

    chrome.tabs.query({ url: SITE_HOSTS[site] }, (tabs) => {
      for (const tab of tabs) {
        chrome.tabs.sendMessage(tab.id, { type: "toggle", site, enabled });
      }
    });
  });
}
