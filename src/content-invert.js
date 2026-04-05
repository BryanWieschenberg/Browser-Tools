(function () {
  "use strict";

  const TOOL_KEY = "invert_colors";
  const STYLE_ID = "browser-tools-invert-colors";

  const SKIP_DOMAINS = [
    "youtube.com",
    "google.com",
    "instructure.com",
  ];

  const host = location.hostname;
  if (SKIP_DOMAINS.some((d) => host === d || host.endsWith("." + d))) return;

  const INVERT_CSS = `
    html {
      filter: invert(1) hue-rotate(180deg) !important;
      background-color: #fff !important;
    }

    img,
    svg,
    video,
    canvas,
    picture,
    [style*="background-image"] {
      filter: invert(1) hue-rotate(180deg) !important;
    }

    ::-webkit-scrollbar {
      background: #2b2b2b;
    }
    ::-webkit-scrollbar-thumb {
      background: #555;
      border-radius: 4px;
    }
  `;

  let enabled = false;

  function injectInvert() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = INVERT_CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  function removeInvert() {
    const style = document.getElementById(STYLE_ID);
    if (style) style.remove();
  }

  function apply() {
    if (enabled) {
      injectInvert();
    } else {
      removeInvert();
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

  if (document.head) {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
