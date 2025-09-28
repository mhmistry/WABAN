let enabled = false;
let patterns = [];

// Load settings
chrome.storage.local.get(["enabled", "patterns"], (data) => {
  enabled = data.enabled ?? false;
  patterns = data.patterns ?? [];
});

// Listen for changes from popup
chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) enabled = changes.enabled.newValue;
  if (changes.patterns) patterns = changes.patterns.newValue;
});

// Replace matching messages
function filterMessages() {
  if (!enabled || !patterns.length) return;

  const messages = document.querySelectorAll("span.selectable-text.copyable-text");

  messages.forEach((msg) => {
    if (!msg.dataset.filtered) {
      const text = msg.innerText;
      if (patterns.some((p) => new RegExp(`\\b${p}\\b`, "i").test(text))) {
        msg.innerText = "[Message Hidden]";
        msg.dataset.filtered = "true";
      }
    }
  });
}

// MutationObserver only on main chat container
const chatObserver = new MutationObserver(() => filterMessages());
function startObserver() {
  const chatContainer = document.querySelector("#main");
  if (chatContainer) {
    chatObserver.observe(chatContainer, { childList: true, subtree: true });
  }
}

setInterval(filterMessages, 1500); // fallback light polling
startObserver();
