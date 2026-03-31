(function () {
  "use strict";

  const TOOL_KEY = "darkmode_youtube";
  const STYLE_ID = "browser-tools-youtube-darkmode";

  const DARK_CSS = `
    .html5-video-player video {
      filter: invert(1) hue-rotate(180deg) !important;
    }
  `;

  let enabled = false;

  function injectDarkMode() {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(style);
    }
    style.textContent = DARK_CSS;
  }

  function removeDarkMode() {
    const style = document.getElementById(STYLE_ID);
    if (style) style.remove();
  }

  function apply() {
    if (enabled) {
      injectDarkMode();
    } else {
      removeDarkMode();
    }
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "tool_toggled" && msg.tool === TOOL_KEY) {
      enabled = msg.enabled;
      apply();
    }
  });

  function init() {
    chrome.storage.sync.get({ [TOOL_KEY]: false }, (settings) => {
      enabled = settings[TOOL_KEY];
      apply();
    });
  }

  init();
})();
