// js/ui.js - View State, Navigation, and Network Controller

import { stopScanner } from './scanner.js';
import { renderHistoryList } from './storage.js';
import { topbarHTML } from './components/topbar.js';
import { dockHTML } from './components/dock.js';

// ----------------------------------------------------
// 1. DUAL NAVIGATION BARS (Redesigned Top Bar + Dock)
// ----------------------------------------------------
export function initNavigationBars() {
  // Inject Top Bar if not present
  if (!document.getElementById("persistent-topbar")) {
    document.body.insertAdjacentHTML('afterbegin', topbarHTML);
  }

  // Inject Bottom Dock if not present
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

  // Synchronized Dual-Scroll Motion Listener
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

  // Connect Top Bar toggle buttons to menu controls
  document.getElementById("topbar-text-btn")?.addEventListener("click", () => {
    document.getElementById("text-size-toggle")?.click();
  });

  document.getElementById("topbar-theme-btn")?.addEventListener("click", () => {
    document.getElementById("dark-mode-toggle")?.click();
  });
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
