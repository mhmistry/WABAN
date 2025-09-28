const powerBtn = document.getElementById("powerBtn");
const saveBtn = document.getElementById("saveBtn");
const chipContainer = document.getElementById("chipContainer");
const patternInput = document.getElementById("patternInput");

let enabled = false;
let patterns = [];
let changed = false;

function renderChips() {
  chipContainer.innerHTML = "";
  patterns.forEach((word, index) => {
    const chip = document.createElement("div");
    chip.className = "chip";

    const text = document.createElement("span");
    text.textContent = word;

    const removeBtn = document.createElement("div");
    removeBtn.className = "remove";
    removeBtn.textContent = "x";
    removeBtn.onclick = () => {
      patterns.splice(index, 1);
      changed = true;
      saveBtn.disabled = false;
      renderChips();
    };

    chip.appendChild(text);
    chip.appendChild(removeBtn);
    chipContainer.appendChild(chip);
  });
}

patternInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && patternInput.value.trim()) {
    patterns.push(patternInput.value.trim());
    patternInput.value = "";
    changed = true;
    saveBtn.disabled = false;
    renderChips();
  }
});

saveBtn.addEventListener("click", () => {
  chrome.storage.local.set({ patterns });
  changed = false;
  saveBtn.disabled = true;
  powerBtn.disabled = false;
});

powerBtn.addEventListener("click", () => {
  enabled = !enabled;
  chrome.storage.local.set({ enabled });
  powerBtn.style.background = enabled ? "var(--wa-green)" : "white";
});

chrome.storage.local.get(["enabled", "patterns"], (data) => {
  enabled = data.enabled ?? false;
  patterns = data.patterns ?? [];
  powerBtn.style.background = enabled ? "var(--wa-green)" : "white";
  renderChips();
});
