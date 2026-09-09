// js/storage.js - Scan History and Local Storage Management

let scanHistory = JSON.parse(localStorage.getItem("scan_history")) || [];

export function getScanHistory() {
  return scanHistory;
}

export function saveToHistory(results, originalUrl) {
  const fullDateTime = results.scanTime
    ? results.scanTime
    : new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
      .replace(', ', ', ')
      .replace(' at ', ', ')
      .replace(',', ', ');

  const record = {
    id: results.pilotDetails.licenseNo || Date.now().toString(),
    name: results.pilotDetails.name,
    licenseType: results.pilotDetails.licenseType,
    overallStatus: results.overallStatus,
    url: originalUrl,
    resultsData: results,
    timestamp: fullDateTime
  };

  scanHistory = scanHistory.filter(item => item.id !== record.id);
  scanHistory.unshift(record);

  if (scanHistory.length > 10) scanHistory.pop();

  localStorage.setItem("scan_history", JSON.stringify(scanHistory));
  renderHistoryList();
}

export function renderHistoryList() {
  const container = document.getElementById("history-list");
  const countBadge = document.getElementById("history-count-badge");
  const clockIcon = document.getElementById("history-clock-icon");

  if (!container) return;

  if (clockIcon && countBadge) {
    const totalScans = scanHistory.length;
    countBadge.innerText = totalScans;

    if (totalScans > 0) {
      countBadge.classList.remove("hidden");
      clockIcon.classList.add("hidden");
    } else {
      clockIcon.classList.remove("hidden");
      countBadge.classList.add("hidden");
    }
  }

  if (scanHistory.length === 0) {
    container.innerHTML = `<div class="text-[10px] text-slate-400 italic py-4 text-center">No recent scans on this device.</div>`;
    return;
  }

  container.innerHTML = scanHistory.map(item => {
    const dotColor = item.overallStatus === "EXPIRED" ? "bg-red-500" : (item.overallStatus === "EXPIRING_SOON" ? "bg-amber-500" : "bg-green-600");
    const safeId = item.id.replace(/'/g, "\\'");

    return `
      <div onclick="loadHistoricalRecord('${safeId}')" class="py-1.5 px-2 flex items-center justify-between cursor-pointer hover:bg-sky-100 transition-colors">
        <div class="flex flex-col text-left">
          <span class="text-[11px] font-semibold text-slate-800 leading-tight">${item.name}</span>
          <span class="text-[9px] text-slate-500 font-semibold uppercase tracking-normal mt-0.5">${item.licenseType}  -  ${item.timestamp} LT</span>
        </div>
        <span class="w-2 h-2 rounded-full ${dotColor} shrink-0 ml-2"></span>
      </div>
    `;
  }).join('');
}

window.clearHistory = function() {
  if (confirm("Are you sure you want to clear all recent compliance checks from this device?")) {
    scanHistory = [];
    localStorage.removeItem("scan_history");
    renderHistoryList();
  }
};
