const DEFAULTS = {
  darkmode_gdocs: false,
  darkmode_gsheets: false,
  darkmode_gslides: false,
  darkmode_canvas: false,
};

const toggles = document.querySelectorAll("[data-tool]");

chrome.storage.sync.get(DEFAULTS, (settings) => {
  toggles.forEach((input) => {
    const key = input.dataset.tool;
    input.checked = settings[key];
  });
});

toggles.forEach((input) => {
  input.addEventListener("change", () => {
    const key = input.dataset.tool;
    const value = input.checked;
    chrome.storage.sync.set({ [key]: value });
    chrome.runtime.sendMessage({
      type: "tool_toggled",
      tool: key,
      enabled: value,
    });
  });
});
