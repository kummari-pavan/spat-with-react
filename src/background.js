let adBlockerEnabled = false;
let customFilters = [];
let blockedAdsCount = 0;
let productivityStats = {};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(
    { adBlockerEnabled: false, customFilters: [], blockedAdsCount: 0, productivityStats: {} },
    (result) => {
      adBlockerEnabled = result.adBlockerEnabled;
      customFilters = result.customFilters;
      blockedAdsCount = result.blockedAdsCount;
      productivityStats = result.productivityStats;
      updateAdBlocker();
    }
  );
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.adBlockerEnabled) {
    adBlockerEnabled = changes.adBlockerEnabled.newValue;
    updateAdBlocker();
  }
  if (changes.customFilters) {
    customFilters = changes.customFilters.newValue;
    updateAdBlocker();
  }
});

function updateAdBlocker() {
  if (adBlockerEnabled) {
    const rules = customFilters.map((filter, index) => ({
      id: index + 2,
      priority: 1,
      action: { type: "block" },
      condition: {
        urlFilter: `||${filter}`,
        resourceTypes: ["script", "image", "xmlhttprequest", "sub_frame", "stylesheet"],
      },
    }));

    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: rules.map((rule) => rule.id),
      addRules: rules,
    });
  } else {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: customFilters.map((_, index) => index + 2),
    });
  }
}

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url && tab.url.startsWith("http")) {
      const url = new URL(tab.url);
      const domain = url.hostname;
      const startTime = Date.now();

      const listener = (tabId, changeInfo) => {
        if (tabId === activeInfo.tabId && changeInfo.status === "complete") {
          const endTime = Date.now();
          const timeSpent = (endTime - startTime) / 1000;

          chrome.storage.sync.get({ productivityStats: {} }, (result) => {
            const stats = result.productivityStats;
            stats[domain] = (stats[domain] || 0) + timeSpent;
            chrome.storage.sync.set({ productivityStats: stats });
          });

          chrome.tabs.onUpdated.removeListener(listener);
        }
      };

      chrome.tabs.onUpdated.addListener(listener);
    }
  });
});