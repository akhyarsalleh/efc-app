// js/ui.js - View State and Connection UI Controller

import { stopScanner } from './scanner.js';
import { renderHistoryList } from './storage.js';
import { menuHTML } from './components/menu.js';
import { dockHTML } from './components/dock.js';


//-----------------------------------------------------------------

export function updateNetworkStatus() {
  const isOnline = navigator.onLine;
  const overlay = document.getElementById("offline-overlay");
  const startScanBtn = document.getElementById("start-scan-btn");
  const submitUrlBtn = document.getElementById("submit-url-btn");
  const manualInput = document.getElementById("manual-url-input");
  const openOriginalBtn = document.getElementById("open-original-btn");
  const checkerBadge = document.getElementById("checker-status-badge");

  if (overlay) {
    if (isOnline) {
      overlay.classList.add("hidden");
    } else {
      overlay.classList.remove("hidden");
      stopScanner();
    }
  }

  if (checkerBadge) {
    if (isOnline) {
      checkerBadge.innerText = "Checker Active";
      checkerBadge.className = "text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-bold uppercase transition-all duration-300 ease-in-out";
    } else {
      checkerBadge.innerText = "Cached View";
      checkerBadge.className = "text-[10px] text-gray-50 bg-gray-500 px-2 py-0.5 rounded-md font-bold uppercase transition-all duration-300 ease-in-out";
    }
  }

  if (startScanBtn) {
    startScanBtn.disabled = !isOnline;
    startScanBtn.classList.toggle("opacity-50", !isOnline);
    startScanBtn.classList.toggle("cursor-not-allowed", !isOnline);
  }

  if (submitUrlBtn) {
    submitUrlBtn.disabled = !isOnline;
    submitUrlBtn.classList.toggle("opacity-50", !isOnline);
    submitUrlBtn.classList.toggle("cursor-not-allowed", !isOnline);
  }

  if (manualInput) {
    manualInput.disabled = !isOnline;
  }

  if (openOriginalBtn) {
    openOriginalBtn.disabled = !isOnline;
    openOriginalBtn.classList.toggle("opacity-50", !isOnline);
    openOriginalBtn.classList.toggle("cursor-not-allowed", !isOnline);
  }
}

export function showView(viewId) {
  document.querySelectorAll(".app-view").forEach(view => {
    view.classList.add("hidden");
  });

  const targetView = document.getElementById(viewId);
  if (targetView) targetView.classList.remove("hidden");

  const historyWrapper = document.getElementById("history-card-wrapper");
  if (historyWrapper) {
    if (viewId === "scanner-view") {
      historyWrapper.classList.remove("hidden");
    } else {
      historyWrapper.classList.add("hidden");
    }
  }

  const historyDetails = document.getElementById("history-details");
  if (historyDetails) historyDetails.removeAttribute("open");
}

export function showScannerView() {
  stopScanner();
  const errorMsg = document.getElementById("error-message");
  if (errorMsg) errorMsg.innerText = "";

  const manualInput = document.getElementById("manual-url-input");
  if (manualInput) manualInput.value = "";

  document.body.classList.remove("bg-green-100", "bg-orange-100", "bg-red-100");
  document.body.classList.add("bg-slate-50");

  renderHistoryList();
  showView("scanner-view");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function showLoading(msg = "Fetching digital license...") {
  const loadingText = document.getElementById("loading-text");
  if (loadingText) loadingText.innerText = msg;
  showView("loading-view");
}

export function showError(msg) {
  stopScanner();
  const errMsg = document.getElementById("error-message");
  if (errMsg) {
    errMsg.innerHTML = msg;
  } else {
    alert(msg);
  }

  const manualInput = document.getElementById("manual-url-input");
  if (manualInput) manualInput.value = "";

  showView("scanner-view");
}

// Bind showScannerView to window for inline HTML header onclick compatibility
window.showScannerView = showScannerView;

// ==========================================
// DOCK & MENU INITIALIZATION LOGIC
// ==========================================

export function initBottomSheetMenu() {
  if (!document.getElementById("bottom-sheet-menu")) {
    document.body.insertAdjacentHTML('beforeend', menuHTML);
  }

  
  const overlay = document.getElementById("bottom-sheet-overlay");
  const menu = document.getElementById("bottom-sheet-menu");
  const mainPane = document.getElementById("pane-main");
  const navButtons = document.querySelectorAll(".nav-item-btn");
  const backButtons = document.querySelectorAll(".back-btn");

  if (!overlay || !menu) return;

 const closeSheet = () => {
    menu.classList.add("translate-y-full");
    overlay.classList.add("opacity-0");
    setTimeout(() => {
      overlay.classList.add("hidden");
      resetToMainPane();
    }, 300);
  };

  overlay.addEventListener("click", closeSheet);

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const targetPane = document.getElementById(targetId);

      if (targetPane) {
        mainPane.classList.add("-translate-x-full");
        targetPane.classList.remove("hidden");
        setTimeout(() => targetPane.classList.remove("translate-x-full"), 10);
      }
    });
  });

  backButtons.forEach(btn => {
    btn.addEventListener("click", resetToMainPane);
  });

  function resetToMainPane() {
    mainPane.classList.remove("-translate-x-full");
    document.querySelectorAll(".sub-pane").forEach(pane => {
      pane.classList.add("translate-x-full");
      setTimeout(() => pane.classList.add("hidden"), 300);
    });
  }

  initPreferenceToggles();
  initExpiryCalculator();
}

export function initDockBar() {
  if (!document.getElementById("persistent-dock")) {
    document.body.insertAdjacentHTML('beforeend', dockHTML);
  }

  const dock = document.getElementById("persistent-dock");
  if (!dock) return;

  // 1. Instantly align dock position with initial scroll position (no animation on load)
  let lastScrollY = window.scrollY;
  if (lastScrollY > 25) {
    dock.classList.add("translate-y-[150%]");
  } else {
    dock.classList.remove("translate-y-[150%]");
  }

  const scrollThreshold = 10;

  // 2. Listen for scroll events
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;

    if (currentScrollY < 25) {
      dock.classList.remove("translate-y-[150%]");
      lastScrollY = currentScrollY;
      return;
    }

    if (Math.abs(scrollDelta) > scrollThreshold) {
      if (scrollDelta > 0) {
        dock.classList.add("translate-y-[150%]");
      } else {
        dock.classList.remove("translate-y-[150%]");
      }
      lastScrollY = currentScrollY;
    }
  }, { passive: true });

  bindDockActions();
}

function bindDockActions() {
  const credsBtn = document.getElementById("dock-creds-btn");
  const historyBtn = document.getElementById("dock-history-btn");
  const toolsBtn = document.getElementById("dock-tools-btn");
  const menuBtn = document.getElementById("dock-menu-btn");

  if (credsBtn) {
    credsBtn.addEventListener("click", () => window.showScannerView());
  }

  if (historyBtn) {
    historyBtn.addEventListener("click", () => openSheetSubPane("pane-history"));
  }

  if (toolsBtn) {
    toolsBtn.addEventListener("click", () => openSheetSubPane("pane-tools"));
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      const overlay = document.getElementById("bottom-sheet-overlay");
      const menu = document.getElementById("bottom-sheet-menu");
      if (overlay && menu) {
        overlay.classList.remove("hidden");
        setTimeout(() => {
          overlay.classList.remove("opacity-0");
          menu.classList.remove("translate-y-full");
        }, 10);
      }
    });
  }
}

function openSheetSubPane(paneId) {
  const overlay = document.getElementById("bottom-sheet-overlay");
  const menu = document.getElementById("bottom-sheet-menu");
  const mainPane = document.getElementById("pane-main");
  const targetPane = document.getElementById(paneId);

  if (overlay && menu && targetPane) {
    mainPane.classList.add("-translate-x-full");
    targetPane.classList.remove("hidden");
    targetPane.classList.remove("translate-x-full");

    overlay.classList.remove("hidden");
    setTimeout(() => {
      overlay.classList.remove("opacity-0");
      menu.classList.remove("translate-y-full");
    }, 10);
  }
}

function initPreferenceToggles() {
  const darkBtn = document.getElementById("dark-mode-toggle");
  const textBtn = document.getElementById("text-size-toggle");

  if (darkBtn) {
    darkBtn.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle("dark");
      localStorage.setItem("certifly_theme", isDark ? "dark" : "light");
    });
  }

  if (textBtn) {
    textBtn.addEventListener("click", () => {
      const mainContent = document.querySelector("main");
      if (mainContent) {
        const isBigger = mainContent.classList.toggle("text-scale-large");
        const iconNormal = document.getElementById("icon-text-normal");
        const iconBigger = document.getElementById("icon-text-bigger");
        if (iconNormal && iconBigger) {
          iconNormal.classList.toggle("hidden", isBigger);
          iconBigger.classList.toggle("hidden", !isBigger);
        }
        localStorage.setItem("certifly_font_size", isBigger ? "large" : "normal");
      }
    });
  }
}

export function loadSavedPreferences() {
  const savedTheme = localStorage.getItem("certifly_theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  }

  const savedFontSize = localStorage.getItem("certifly_font_size");
  if (savedFontSize === "large") {
    const mainContent = document.querySelector("main");
    if (mainContent) mainContent.classList.add("text-scale-large");
  }
}

function initExpiryCalculator() {
  const baseDateInput = document.getElementById("calc-base-date");
  const durationBtns = document.querySelectorAll(".calc-duration-btn");
  const resultBox = document.getElementById("calc-result-box");
  const resultDate = document.getElementById("calc-result-date");

  if (!baseDateInput) return;

  baseDateInput.valueAsDate = new Date();

  durationBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const months = parseInt(btn.getAttribute("data-months"), 10);
      const baseDate = new Date(baseDateInput.value);

      if (isNaN(baseDate.getTime())) return;

      baseDate.setMonth(baseDate.getMonth() + months);

      const formatted = baseDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }).toUpperCase();

      if (resultDate) resultDate.textContent = formatted;
      if (resultBox) resultBox.classList.remove("hidden");
    });
  });
}
