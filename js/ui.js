// js/ui.js - View State, Navigation, and Network Controller

import { stopScanner } from './scanner.js';
import { renderHistoryList } from './storage.js';
import { topbarHTML } from './components/topbar.js';
import { dockHTML } from './components/dock.js';

// ----------------------------------------------------
// 0. APPEARANCE 3-STATE CYCLER (Solid Mini Heroicons)
// ----------------------------------------------------
const themeSolidIcons = {
  system: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M6 3.5A1.5 1.5 0 0 1 7.5 2h5A1.5 1.5 0 0 1 14 3.5v13a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 6 16.5v-13ZM10 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd"/></svg>`,
  light: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM15.657 5.404a.75.75 0 1 0-1.06-1.06l-1.061 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM6.464 14.596a.75.75 0 1 0-1.06-1.06l-1.06 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10ZM4.25 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 4.25 10ZM14.596 15.657a.75.75 0 0 0 1.06-1.06l-1.06-1.061a.75.75 0 1 0-1.06 1.06l1.06 1.061ZM5.404 6.464a.75.75 0 0 0 1.06-1.06l-1.06-1.06a.75.75 0 1 0-1.06 1.06l1.06 1.06Z"/></svg>`,
  dark: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M7.455 2.004a.75.75 0 0 1 .868.397 6.5 6.5 0 1 0 9.277 9.277.75.75 0 0 1 1.266.697 8 8 0 1 1-11.808-10.102.75.75 0 0 1 .397-.269Z" clip-rule="evenodd"/></svg>`
};

let currentThemeMode = localStorage.getItem("app_theme_mode") || "system";

export function applyThemeMode(mode = currentThemeMode) {
  currentThemeMode = mode;
  localStorage.setItem("app_theme_mode", mode);

  const topbarBtn = document.getElementById("topbar-theme-btn");
  if (topbarBtn) {
    topbarBtn.innerHTML = themeSolidIcons[mode] || themeSolidIcons.system;
  }

  const isDark = mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", isDark);
}

export function cycleThemeMode() {
  const modes = ["system", "light", "dark"];
  const nextIndex = (modes.indexOf(currentThemeMode) + 1) % modes.length;
  applyThemeMode(modes[nextIndex]);
}

// ----------------------------------------------------
// 1. DUAL NAVIGATION BARS (Top Bar + Bottom Dock)
// ----------------------------------------------------
export function initNavigationBars() {
  if (!document.getElementById("persistent-topbar")) {
    document.body.insertAdjacentHTML('afterbegin', topbarHTML);
  }

  if (!document.getElementById("persistent-dock")) {
    document.body.insertAdjacentHTML('beforeend', dockHTML);
  }

  const topbar = document.getElementById("persistent-topbar");
  const dock = document.getElementById("persistent-dock");

  const topbarHeight = 48; // 48px height (h-12)
  const dockMaxTravel = 80;

  let currentTranslateY = 0;
  const getMaxScrollY = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  let lastClampedScrollY = Math.max(0, Math.min(window.scrollY, getMaxScrollY()));

  window.addEventListener("scroll", () => {
    const maxScrollY = getMaxScrollY();
    const clampedScrollY = Math.max(0, Math.min(window.scrollY, maxScrollY));
    const delta = clampedScrollY - lastClampedScrollY;

    if (clampedScrollY <= 2) {
      currentTranslateY = 0;
    } else if (delta !== 0) {
      currentTranslateY += delta;
      currentTranslateY = Math.max(0, Math.min(currentTranslateY, topbarHeight));
    }

    const progress = currentTranslateY / topbarHeight;

    if (dock) {
      dock.style.transform = `translateY(${progress * dockMaxTravel}px)`;
    }

    if (topbar) {
      const topbarTranslate = (1 - progress) * -100;
      topbar.style.transform = `translateY(${topbarTranslate}%)`;
      topbar.style.opacity = progress > 0.05 ? "1" : "0";
    }

    lastClampedScrollY = clampedScrollY;
  }, { passive: true });

  // Connect Top Bar toggle buttons
  document.getElementById("topbar-text-btn")?.addEventListener("click", () => {
    document.getElementById("text-size-toggle")?.click();
  });

  document.getElementById("topbar-theme-btn")?.addEventListener("click", () => {
    cycleThemeMode();
  });

  // Apply initial theme state & icon on load
  applyThemeMode(currentThemeMode);
}

// ----------------------------------------------------
// 2. NETWORK STATUS CONTROLLER
// ----------------------------------------------------
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

// ----------------------------------------------------
// 3. VIEW STATE CONTROLLER
// ----------------------------------------------------
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

export function showLoading(msg = "Fetching digital licence...") {
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

window.showScannerView = showScannerView;
