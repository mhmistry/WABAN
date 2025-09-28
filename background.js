chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: false, patterns: [] });
});

// Badge indicator (green/red dot)
function updateBadge(enabled) {
  chrome.action.setBadgeText({ text: " " });
  chrome.action.setBadgeBackgroundColor({ color: enabled ? "green" : "red" });
}

chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    updateBadge(changes.enabled.newValue);
  }
});

chrome.storage.local.get("enabled", (data) => {
  updateBadge(data.enabled ?? false);
});
