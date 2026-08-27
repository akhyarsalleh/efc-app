// app.js - Licence Scanner App Client

// Configuration - Replace with your deployed Vercel URL
const PROXY_URL = 'https://efc-app.vercel.app/api/proxy';
const DEFAULT_THRESHOLD = 30; // Days warning threshold

// Global state
let scanHistory = JSON.parse(localStorage.getItem("scan_history")) || [];
let html5QrcodeScanner = null;
let lastScannedUrl = "";

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  const startScanBtn = document.getElementById("start-scan-btn");
  const stopScanBtn = document.getElementById("stop-scan-btn");
  const submitUrlBtn = document.getElementById("submit-url-btn");
  const scanNewBtn = document.getElementById("scan-new-btn");
  const openOriginalBtn = document.getElementById("open-original-btn");

  if (startScanBtn) startScanBtn.addEventListener("click", startScanner);
  if (stopScanBtn) stopScanBtn.addEventListener("click", stopScanner);
  if (submitUrlBtn) submitUrlBtn.addEventListener("click", handleManualUrl);
  if (scanNewBtn) scanNewBtn.addEventListener("click", showScannerView);
  if (openOriginalBtn) openOriginalBtn.addEventListener("click", openOriginalLicense);

  // --- NEW: Close history accordion when clicking anywhere outside of it ---
  document.addEventListener("click", (event) => {
    const historyDetails = document.getElementById("history-details");
    const historyWrapper = document.getElementById("history-card-wrapper");
    
    // Check if the history card exists and is currently open
    if (historyDetails && historyDetails.hasAttribute("open")) {
      // If the clicked element is NOT inside the history card wrapper, close it
      if (historyWrapper && !historyWrapper.contains(event.target)) {
        historyDetails.removeAttribute("open");
      }
    }
  });


  // Initial render of cached list
  renderHistoryList();
}

// -----------------------------------------
// UI Navigation / View State Management
// -----------------------------------------
function showView(viewId) {
  document.querySelectorAll(".app-view").forEach(view => {
    view.classList.add("hidden");
  });
  const targetView = document.getElementById(viewId);
  if (targetView) targetView.classList.remove("hidden");

  // Toggle history card visibility: Only display it when on the primary scanner-view page
  const historyWrapper = document.getElementById("history-card-wrapper");
  if (historyWrapper) {
    if (viewId === "scanner-view") {
      historyWrapper.classList.remove("hidden");
    } else {
      historyWrapper.classList.add("hidden");
    }
  }

  // Auto-close history tab on every navigation
  const historyDetails = document.getElementById("history-details");
  if (historyDetails) historyDetails.removeAttribute("open");
}

function showScannerView() {
  stopScanner();
  const errorMsg = document.getElementById("error-message");
  if (errorMsg) errorMsg.innerText = "";
  const manualInput = document.getElementById("manual-url-input");
  if (manualInput) manualInput.value = "";
  
  // Reset body background to original default Slate-50 when returning to scanner
  document.body.classList.remove("bg-green-100", "bg-orange-100", "bg-red-100");
  document.body.classList.add("bg-slate-50");

  renderHistoryList();
  showView("scanner-view");
}

function showLoading(msg = "Fetching digital license...") {
  const loadingText = document.getElementById("loading-text");
  if (loadingText) loadingText.innerText = msg;
  showView("loading-view");
}

function showError(msg) {
  stopScanner();
  const errMsg = document.getElementById("error-message");
  if (errMsg) {
    errMsg.innerHTML = msg;
  } else {
    alert(msg);
  }
  showView("scanner-view");
}

// -----------------------------------------
// Scan History Controllers
// -----------------------------------------
function saveToHistory(results, originalUrl) {
  // Extract only the 24H clock time from scanTime (e.g., "14:30")
  const timeOnly = results.scanTime
    ? results.scanTime.split(' ').pop()
    : new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });

  const record = {
    id: results.pilotDetails.licenseNo || Date.now().toString(),
    name: results.pilotDetails.name,
    licenseType: results.pilotDetails.licenseType,
    overallStatus: results.overallStatus,
    url: originalUrl,
    resultsData: results,
    timestamp: timeOnly
  };

  scanHistory = scanHistory.filter(item => item.id !== record.id);
  scanHistory.unshift(record);
  if (scanHistory.length > 10) scanHistory.pop();
  localStorage.setItem("scan_history", JSON.stringify(scanHistory));
  renderHistoryList();
}

function renderHistoryList() {
  const container = document.getElementById("history-list");
  if (!container) return;
  if (scanHistory.length === 0) {
    container.innerHTML = `<div class="text-[10px] text-slate-400 italic py-4 text-center">No recent scans on this device.</div>`;
    return;
  }

  container.innerHTML = scanHistory.map(item => {
    const dotColor = item.overallStatus === "EXPIRED" ? "bg-red-500" : (item.overallStatus === "EXPIRING_SOON" ? "bg-amber-500" : "bg-green-600");
    const safeId = item.id.replace(/'/g, "\\'");
    return `
      <div onclick="loadHistoricalRecord('${safeId}')" class="py-1.5 px-2 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
        <div class="flex flex-col text-left">
          <span class="text-[11px] font-semibold text-slate-800 leading-tight">${item.name}</span>
          <span class="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">${item.licenseType} • Scanned at ${item.timestamp} LT</span>
        </div>
        <span class="w-2 h-2 rounded-full ${dotColor} shrink-0 ml-2"></span>
      </div>
    `;
  }).join('');
}

window.loadHistoricalRecord = function(id) {
  const match = scanHistory.find(item => item.id === id);
  if (match) {
    lastScannedUrl = match.url; // Ensures "Open Original" button works
    renderResults(match.resultsData);
  }
};

window.clearHistory = function() {
  if (confirm("Are you sure you want to clear all recent compliance checks from this device?")) {
    scanHistory = [];
    localStorage.removeItem("scan_history");
    renderHistoryList();
  }
};

// -----------------------------------------
// QR Scanner Controller
// -----------------------------------------
function startScanner() {
  const errorMsg = document.getElementById("error-message");
  if (errorMsg) errorMsg.innerText = "";
  const qrContainer = document.getElementById("qr-reader-container");
  if (qrContainer) qrContainer.classList.remove("hidden");

  const startBtn = document.getElementById("start-scan-btn");
  if (startBtn) startBtn.classList.add("hidden");
  const stopBtn = document.getElementById("stop-scan-btn");
  if (stopBtn) stopBtn.classList.remove("hidden");

  // Initialize html5-qrcode
  html5QrcodeScanner = new Html5Qrcode("qr-reader");

  const qrCodeSuccessCallback = (decodedText) => {
    if (decodedText.startsWith("http://eclipse.caam.gov.my") || decodedText.startsWith("https://eclipse.caam.gov.my")) {
      processLicenseUrl(decodedText);
    } else {
      showError("Invalid Eclipse QR code. Please try again.");
    }
  };

  const config = { fps: 30, experimentalFeatures: { useBarCodeDetectorIfSupported: true } };

  html5QrcodeScanner.start(
    { facingMode: "environment" },
    config,
    qrCodeSuccessCallback,
    () => { /* Ignore chatty scanning streams */ }
  ).catch(err => {
    showError("Camera Access Failed: " + err);
  });
}

function stopScanner() {
  if (html5QrcodeScanner) {
    return html5QrcodeScanner.stop().then(() => {
      html5QrcodeScanner = null;
      const qrContainer = document.getElementById("qr-reader-container");
      if (qrContainer) qrContainer.classList.add("hidden");
      const startBtn = document.getElementById("start-scan-btn");
      if (startBtn) startBtn.classList.remove("hidden");
      const stopBtn = document.getElementById("stop-scan-btn");
      if (stopBtn) stopBtn.classList.add("hidden");
    }).catch(err => {
      console.warn("Failed to stop scanner cleanly:", err);
    });
  }
  return Promise.resolve();
}

function handleManualUrl() {
  const urlInput = document.getElementById("manual-url-input").value.trim();
  if (!urlInput) {
    showError("Please enter a valid https://eclipse.caam.gov.my/ URL");
    return;
  }
  if (!urlInput.startsWith("http://eclipse.caam.gov.my/ELICENSING/userprofileqr.do?") && !urlInput.startsWith("https://eclipse.caam.gov.my/ELICENSING/userprofileqr.do?")) {
    showError("Please enter a valid https://eclipse.caam.gov.my/ URL");
    return;
  }
  processLicenseUrl(urlInput);
}

function openOriginalLicense() {
  if (lastScannedUrl) {
    window.open(lastScannedUrl, "_blank");
  }
}

// -----------------------------------------
// License Fetch & Proxy Integration
// -----------------------------------------
async function processLicenseUrl(url) {
  lastScannedUrl = url;
  await stopScanner();
  showLoading("Fetching digital license via proxy...");
// Capture local date & time in 24-hour format
  const scanTime = new Date().toLocaleString('en-GB', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  }).replace(', ', ', ')    // Replaces standard comma separator (Chrome/Firefox) with " - "
    .replace(' at ', ', ')  // Replaces Safari's "at" separator with " - "
    .replace(',', ', ');    // Fallback safety separator

  
  try {
    const fetchUrl = `${PROXY_URL}?url=${encodeURIComponent(url)}`;
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch license page (Status: ${response.status})`);
    }
    const htmlText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");
    const results = parseLicenseDOM(doc, DEFAULT_THRESHOLD);
    
    // Attach the timestamp to the results object so renderResults can see it
    results.scanTime = scanTime; 
    
    saveToHistory(results, url);
    renderResults(results);
  } catch (error) {
    console.error("Processing error:", error);
    showError(`Error processing digital license: ${error.message}.`);
  }
}

// -----------------------------------------
// UI Rendering of Results
// -----------------------------------------
function renderResults(results) {
  // Render the last scanned date/time on the results page
  const timeEl = document.getElementById("scan-timestamp");
  if (timeEl) {
    //timeEl.innerText = results.scanTime || "N/A";
    timeEl.innerText = results.scanTime ? `${results.scanTime} LT` : "N/A";
  }
  
  // Set Pilot profile details
  document.getElementById("pilot-name").innerText = results.pilotDetails.name || "N/A";
  document.getElementById("licence-type").innerText = results.pilotDetails.licenseType || "N/A";
  document.getElementById("licence-number").innerText = results.pilotDetails.licenseNo || "N/A";

  // --- SORT QUALIFICATIONS DYNAMICALLY ---
  if (results.qualifications && results.qualifications.length > 0) {
    results.qualifications.sort((a, b) => {
      const getRank = (nameStr) => {
        const name = (nameStr || "").toUpperCase().trim();
        if ((name.includes("VALIDITY") && !name.includes("ISSUE")) || name.includes("ATPL") || name.includes("CPL") || name.includes("PPL") || name.includes("MPL")) return 1;
        if (name.includes("CLASS 1") || name.includes("CLASS I") || name.includes("MEDICAL 1") || name.includes("MEDICAL I")) return 2;
        if (name.includes("CLASS 2") || name.includes("CLASS II") || name.includes("MEDICAL 2") || name.includes("MEDICAL II")) return 3;
        if (name.includes("RTOL") || name.includes("RADIOTELEPHONY") || name.includes("R/T") || name.includes("RADIO") || name.includes("TELEPHONY")) return 4;
        if (name.includes("ELP") || name.includes("ENGLISH") || name.includes("LANGUAGE") || name.includes("PROFICIENCY")) return 5;
        if (name.includes("INSTRUMENT RATING") || name.includes("INSTRUMENT") || name === "IR") return 7;
        return 6;
      };
      return getRank(a.name) - getRank(b.name);
    });
  }

  // Set Overall Status Badge & Title Styling
  const statusBadge = document.getElementById("overall-status-badge");
  const resultHeader = document.getElementById("result-header");
  const overallMsg = document.getElementById("overall-message");
  statusBadge.className = "status-badge font-bold uppercase rounded px-4 py-2 text-white inline-block text-lg mt-2";

  // Reset previous background colors
  document.body.classList.remove("bg-green-100", "bg-orange-100", "bg-red-100");

  if (results.overallStatus === "EXPIRED") {
    statusBadge.innerText = "DO NOT FLY!";
    statusBadge.classList.add("bg-red-600");
    resultHeader.style.color = "#dc2626";
    resultHeader.innerText = "Validity Expired / Invalid";
    document.body.classList.add("bg-red-100");
    overallMsg.innerHTML = "One or more qualifications have lapsed. Kindly contact Fleet Captains / SIPs.";
  } else if (results.overallStatus === "EXPIRING_SOON") {
    statusBadge.innerText = "FLY WITH CAUTION!";
    statusBadge.classList.add("bg-amber-500");
    resultHeader.style.color = "#d97706";
    resultHeader.innerText = "Validity Expiring Soon";
    document.body.classList.add("bg-orange-100");
    overallMsg.innerHTML = "Some qualifications will expire soon. Ensure they remain valid throughout the duty period.";
  } else {
    resultHeader.innerText = "Licence Valid";
    statusBadge.innerText = "HAVE A SAFE FLIGHT!";
    statusBadge.classList.add("bg-green-600");
    resultHeader.style.color = "#16a34a";
    document.body.classList.add("bg-green-100");
    overallMsg.innerHTML = "All qualifications and medical checks are valid.";
  }

  // Populate list of qualifications
  const container = document.getElementById("qualifications-list");
  container.innerHTML = "";

  if (results.qualifications.length === 0) {
    container.innerHTML = `<div class="text-center text-slate-500 py-6"> No qualifications found on the scanned digital license. </div>`;
  } else {
    results.qualifications.forEach(q => {
      const qRow = document.createElement("div");
      qRow.className = "border-b border-slate-100 last:border-b-0 py-3 flex items-center justify-between";

      let statusHtml = "";
      if (q.status === "EXPIRED") {
        statusHtml = `<span class="bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded font-bold uppercase">Expired</span>`;
      } else if (q.status === "EXPIRING_SOON") {
        const daysLeft = q.daysRemaining === 1 ? "1 day left" : `${q.daysRemaining} days left`;
        statusHtml = `<span class="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded font-bold uppercase">${daysLeft}</span>`;
      } else {
        statusHtml = `<span class="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded font-bold uppercase">Valid</span>`;
      }

      qRow.innerHTML = `
        <div class="flex-grow pr-4">
          <div class="font-semibold text-slate-800 text-sm md:text-base">${q.name}</div>
          <div class="text-xs text-slate-500">Expiry: ${q.dateText || "No Expiry"}</div>
        </div>
        <div class="flex-shrink-0 text-right">
          ${statusHtml}
        </div>
      `;

      container.appendChild(qRow);
    });
  }

  // Switch UI view to results (Matches container id "result-view" in index_test.html)
  showView("result-view");
}

// -----------------------------------------
// Core Parsing Engine (Adapted from checker.js)
// -----------------------------------------
function parseLicenseDate(dateStr) {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();
  if (trimmed.toUpperCase() === 'NO EXPIRY' || trimmed.toUpperCase() === 'NIL' || trimmed.toUpperCase() === 'NA') {
    return null;
  }
  const match = trimmed.match(/^(\d{1,2})\s+([a-zA-Z]{3,10})\s+(\d{4})$/);
  if (!match) return null;
  const day = parseInt(match[1], 10);
  const monthStr = match[2].toUpperCase();
  const year = parseInt(match[3], 10);
  
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const monthsMalay = ["JAN", "FEB", "MAC", "APR", "MEI", "JUN", "JUL", "OGOS", "SEP", "OKT", "NOV", "DIS"];
  
  let monthIdx = months.indexOf(monthStr);
  if (monthIdx === -1) {
    monthIdx = monthsMalay.indexOf(monthStr);
  }
  if (monthIdx === -1) return null;
  return new Date(year, monthIdx, day);
}

function isUnderPg2(el) {
  if (!el) return false;
  if (typeof el.closest === 'function') {
    const pgEl = el.closest('[id^="pg"]');
    if (pgEl) {
      const match = pgEl.id.match(/^pg(\d+)$/);
      if (match) {
        const pgNum = parseInt(match[1], 10);
        if (pgNum >= 2) return true;
      }
    }
  }
  let curr = el;
  while (curr) {
    if (curr.id && typeof curr.id === 'string') {
      const match = curr.id.match(/^pg(\d+)$/);
      if (match) {
        const pgNum = parseInt(match[1], 10);
        if (pgNum >= 2) return true;
      }
    }
    curr = curr.parentElement;
  }
  return false;
}

function getDirectChildCells(tr) {
  const cells = [];
  if (tr && tr.children) {
    for (let i = 0; i < tr.children.length; i++) {
      const child = tr.children[i];
      const tagName = child.tagName.toUpperCase();
      if (tagName === 'TD' || tagName === 'TH') {
        cells.push(child);
      }
    }
  }
  if (cells.length === 0 && tr) {
    const qcells = tr.querySelectorAll('td, th');
    for (let j = 0; j < qcells.length; j++) {
      cells.push(qcells[j]);
    }
  }
  return cells;
}

function getLabelFromRow(tr) {
  const tds = getDirectChildCells(tr);
  for (let i = 0; i < tds.length; i++) {
    const text = tds[i].textContent.replace('•', '').trim();
    if (!text) continue;
    const isDatePattern = /^\d{1,2}\s+[a-zA-Z]{3,10}\s+\d{4}$/.test(text) || text.toUpperCase() === 'NO EXPIRY';
    if (!isDatePattern) {
      return text;
    }
  }
  return "";
}

function shouldIgnore(el) {
  if (!el) return true;
  if (isUnderPg2(el)) return true;
  const text = el.textContent.trim();
  if (!text) return true;
  const upperText = text.toUpperCase();

  if (upperText.includes("INITIAL GRANT") || upperText.includes("INITIAL_GRANT")) {
    return true;
  }
  if (upperText.includes("7 DECEMBER 1944") || upperText.includes("7 DISEMBER 1944") || 
      upperText.includes("DECEMBER 1944") || upperText.includes("DISEMBER 1944")) {
    return true;
  }
  if (/\d{1,2}:\d{2}:\d{2}/.test(text)) {
    return true;
  }

  let curr = el;
  for (let i = 0; i < 5; i++) {
    if (!curr) break;
    const tagName = curr.tagName.toUpperCase();
    if (['TABLE', 'TBODY', 'THEAD', 'BODY', 'HTML', 'TR', 'TFOOT'].includes(tagName)) {
      break;
    }
    if (tagName === 'DIV') {
      const className = (curr.className || '').toLowerCase();
      if (className.includes('row') || className.includes('container') || 
          className.includes('col-') || className.includes('card')) {
        break;
      }
    }
    const currText = curr.textContent.toUpperCase();
    if (currText.includes("DATE OF BIRTH") || currText.includes("TARIKH LAHIR")) {
      return true;
    }
    if (currText.includes("SIGNATURE OF ISSUING OFFICER") || currText.includes("TANDATANGAN PEGAWAI")) {
      return true;
    }
    if (currText.includes("LAST SYNCHRONIZATION") || currText.includes("PENYELARASAN TERAKHIR")) {
      return true;
    }
    if (currText.includes("INITIAL GRANT")) {
      return true;
    }
    if (currText.includes("CHICAGO CONVENTION") || currText.includes("ANNEX 1") || currText.includes("ANEKS 1")) {
      return true;
    }
    curr = curr.parentElement;
  }

  const tr = el.closest('tr');
  if (tr) {
    const rowText = tr.textContent.toUpperCase();
    if (rowText.includes("VALIDITY ISSUE DATE") || rowText.includes("TARIKH KELUARAN")) {
      return true;
    }
    const tds = getDirectChildCells(tr);
    if (tds.length === 3) {
      const table = tr.closest('table');
      let hasIssueDateHeader = false;
      if (table) {
        const tableText = table.textContent.toUpperCase();
        if (tableText.includes("VALIDITY ISSUE DATE") || tableText.includes("TARIKH KELUARAN")) {
          hasIssueDateHeader = true;
        }
      }
      if (hasIssueDateHeader && (tds[1] === el || tds[1].contains(el))) {
        return true;
      }
    }
  }
  return false;
}

function isRedOrExpired(el) {
  if (!el) return false;
  const text = el.textContent.trim().toUpperCase();
  if (text === 'EXPIRED') return true;

  const inlineStyle = (el.getAttribute('style') || '').toLowerCase();
  if (inlineStyle.includes('color: red') ||
      inlineStyle.includes('color:red') ||
      inlineStyle.includes('color: #ff0000') ||
      inlineStyle.includes('background: #ff0000') ||
      inlineStyle.includes('background:#ff0000') ||
      inlineStyle.includes('background: red') ||
      inlineStyle.includes('background-color: red') ||
      inlineStyle.includes('color: rgb(239, 68, 68)') ||
      inlineStyle.includes('color: #ef4444')) {
    return true;
  }
  return false;
}

function parseLicenseDOM(doc, daysThreshold = DEFAULT_THRESHOLD) {
  const refDate = new Date();
  const qualificationData = {};
  
  function processQualification(labelText, dateText, parsedDate, isVisuallyExpired) {
    const name = labelText || "Qualification";
    const key = name.toUpperCase().replace(/\s+/g, '');
    
    if (key.includes('CLASS1(SC)') || key.includes('CLASS1SC') || key.includes('CLASS1(S.C.)')) {
      return;
    }
    
    const cleanName = name.replace('•', '').trim();
    let status = "VALID";
    let daysRemaining = null;
    
    if (isVisuallyExpired) {
      status = "EXPIRED";
    } else if (parsedDate) {
      const timeDiff = parsedDate.getTime() - refDate.getTime();
      daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      
      if (daysRemaining < 0) {
        status = "EXPIRED";
      } else if (daysRemaining <= daysThreshold) {
        status = "EXPIRING_SOON";
      }
    }
    
    if (qualificationData[key] && qualificationData[key].status === "EXPIRED") {
      return;
    }
    
    qualificationData[key] = {
      name: cleanName,
      dateText: dateText,
      parsedDate: parsedDate,
      daysRemaining: daysRemaining,
      status: status
    };
  }


  // --- Extract Pilot Details ---
  let pilotName = "";
  let licenseType = "";
  let licenseNo = "";
  const allElements = doc.querySelectorAll('td, th, b, span, div, p');

  for (let i = 0; i < allElements.length; i++) {
    if (isUnderPg2(allElements[i])) continue;
    const text = allElements[i].textContent.toUpperCase();
    if (text.includes("FULL NAME OF HOLDER") || text.includes("NAMA PENUH PEMEGANG")) {
      const tr = allElements[i].closest('tr');
      if (tr) {
        const nextTr = tr.nextElementSibling;
        if (nextTr) {
          pilotName = nextTr.textContent.replace(/•/g, '').trim().replace(/\s+/g, ' ');
          break;
        }
        const tds = tr.querySelectorAll('td, th');
        if (tds.length > 1) {
          for (let j = 0; j < tds.length; j++) {
            if (tds[j] !== allElements[i] && tds[j].textContent.trim()) {
              pilotName = tds[j].textContent.replace(/•/g, '').trim().replace(/\s+/g, ' ');
              break;
            }
          }
        }
      }
    }
  }

  let extractedFullType = "";
  for (let i = 0; i < allElements.length; i++) {
    if (isUnderPg2(allElements[i])) continue;
    const text = allElements[i].textContent.trim();
    if (text === "II") {
      const tr = allElements[i].closest('tr');
      if (tr) {
        const tds = tr.querySelectorAll('td, th');
        if (tds.length > 1) {
          for (let j = 0; j < tds.length; j++) {
            if (tds[j] !== allElements[i] && tds[j].textContent.trim()) {
              extractedFullType = tds[j].textContent.trim().replace(/\s+/g, ' ');
              break;
            }
          }
        } else {
          const nextTr = tr.nextElementSibling;
          if (nextTr) {
            extractedFullType = nextTr.textContent.trim().replace(/\s+/g, ' ');
          }
        }
      }
    }
    if (text === "III") {
      const tr = allElements[i].closest('tr');
      if (tr) {
        const tds = tr.querySelectorAll('td, th');
        if (tds.length > 1) {
          for (let j = 0; j < tds.length; j++) {
            if (tds[j] !== allElements[i] && tds[j].textContent.trim()) {
              licenseNo = tds[j].textContent.replace(/LICENCE NO/gi, '').replace(/NOMBOR LESEN/gi, '').trim().replace(/\s+/g, ' ');
              break;
            }
          }
        } else {
          const nextTr = tr.nextElementSibling;
          if (nextTr) {
            licenseNo = nextTr.textContent.replace(/LICENCE NO/gi, '').replace(/NOMBOR LESEN/gi, '').trim().replace(/\s+/g, ' ');
          }
        }
      }
    }
  }

  function mapLicenseType(fullType) {
    if (!fullType) return "";
    const upper = fullType.toUpperCase().trim();
    if (upper.includes("AIRLINE TRANSPORT PILOT LICENCE (A)") || upper === "ATPL(A)") return "ATPL(A)";
    if (upper.includes("AIRLINE TRANSPORT PILOT LICENCE (H)") || upper === "ATPL(H)") return "ATPL(H)";
    if (upper.includes("AIRLINE TRANSPORT PILOT LICENCE") || upper === "ATPL") return "ATPL";
    if (upper.includes("COMMERCIAL PILOT LICENCE (A)") || upper === "CPL(A)") return "CPL(A)";
    if (upper.includes("COMMERCIAL PILOT LICENCE (H)") || upper === "CPL(H)") return "CPL(H)";
    if (upper.includes("COMMERCIAL PILOT LICENCE") || upper === "CPL") return "CPL";
    if (upper.includes("PRIVATE PILOT LICENCE (A)") || upper === "PPL(A)") return "PPL(A)";
    if (upper.includes("PRIVATE PILOT LICENCE (H)") || upper === "PPL(H)") return "PPL(H)";
    if (upper.includes("PRIVATE PILOT LICENCE") || upper === "PPL") return "PPL";
    if (upper.includes("MULTI-CREW PILOT LICENCE (A)") || upper === "MPL(A)") return "MPL(A)";
    return fullType;
  }

  let shortLicenseType = "";
  const tables = doc.querySelectorAll('table');
  for (let t = 0; t < tables.length; t++) {
    const table = tables[t];
    if (isUnderPg2(table)) continue;
    const headers = table.querySelectorAll('th, td');
    let isFclTable = false;
    let licenceTypeColIndex = -1;
    for (let h = 0; h < headers.length; h++) {
      const headerText = headers[h].textContent.toUpperCase();
      if (headerText.includes('LICENCE TYPE') || headerText.includes('JENIS LESEN')) {
        isFclTable = true;
        const tr = headers[h].closest('tr');
        if (tr) {
          const cells = Array.from(tr.querySelectorAll('td, th'));
          licenceTypeColIndex = cells.indexOf(headers[h]);
        }
        break;
      }
    }
    if (isFclTable && licenceTypeColIndex !== -1) {
      const rows = table.querySelectorAll('tr');
      for (let r = 0; r < rows.length; r++) {
        const row = rows[r];
        const cells = Array.from(row.querySelectorAll('td, th'));
        if (cells.length > licenceTypeColIndex) {
          const cellText = cells[licenceTypeColIndex].textContent.trim();
          const upperCellText = cellText.toUpperCase();
          if (upperCellText.includes('LICENCE TYPE') || upperCellText.includes('JENIS LESEN')) {
            continue;
          }
          if (cellText && cellText.length < 15) {
            shortLicenseType = cellText;
            break;
          }
        }
      }
    }
    if (shortLicenseType) break;
  }

  licenseType = shortLicenseType || mapLicenseType(extractedFullType);

  if (!licenseNo) {
    for (let i = 0; i < allElements.length; i++) {
      if (isUnderPg2(allElements[i])) continue;
      const text = allElements[i].textContent.toUpperCase();
      if (text.includes("NOMBOR LESEN BARU") || text.includes("NEW LICENCE NO")) {
        const nextTr = allElements[i].closest('tr')?.nextElementSibling;
        if (nextTr) {
          licenseNo = nextTr.textContent.trim().replace(/\s+/g, ' ');
        }
      }
    }
  }

  // --- Pass 1: Card Extraction ---
  const cards = doc.querySelectorAll('.card');
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    if (isUnderPg2(card)) continue;
    const cardText = card.textContent.toUpperCase();
    if (cardText.includes('MEDICAL EXPIRY DATE') || cardText.includes('TARIKH TAMAT TEMPOH PERUBATAN') || cardText.includes('LICENCE TYPE') || cardText.includes('VALIDITY EXPIRY DATE')) {
      continue;
    }
    const cardNormalized = cardText.replace(/\s+/g, '');
    if (cardNormalized.includes('CLASS1(SC)') || cardNormalized.includes('CLASS1SC') || cardNormalized.includes('CLASS1(S.C.)')) {
      continue;
    }
    const titleEl = card.querySelector('.col-sm-12 .bg-gray-300') || card.querySelector('div[style*="font-weight: 500"]') || card.querySelector('.fs-5');
    const labelText = titleEl ? titleEl.textContent.trim() : "";
    const dateEl = card.querySelector('.text-uppercase b') || card.querySelector('.fs-4 b, .fs-3 b');
    const dateText = dateEl ? dateEl.textContent.trim() : "";
    if (labelText && dateText) {
      if (shouldIgnore(dateEl)) continue;
      const parsedDate = parseLicenseDate(dateText);
      const isVisExpired = isRedOrExpired(dateEl) || cardText.includes('EXPIRED');
      processQualification(labelText, dateText, parsedDate, isVisExpired);
    }
  }

  // --- Pass 2: Table Extraction ---
  const rows = doc.querySelectorAll('tr');
  for (let i = 0; i < rows.length; i++) {
    const tr = rows[i];
    if (isUnderPg2(tr)) continue;
    const rowText = tr.textContent.toUpperCase();
    const rowNormalized = rowText.replace(/\s+/g, '');
    if (rowNormalized.includes('CLASS1(SC)') || rowNormalized.includes('CLASS1SC') || rowNormalized.includes('CLASS1(S.C.)')) {
      continue;
    }
    if (rowText.includes('LICENCE TYPE') || rowText.includes('VALIDITY EXPIRY DATE')) continue;
    if (rowText.includes('MEDICAL CLASS') || rowText.includes('KELAS PERUBATAN')) continue;
    if (rowText.includes('MEDICAL EXPIRY DATE') || rowText.includes('TARIKH TAMAT TEMPOH PERUBATAN')) continue;

    const labelText = getLabelFromRow(tr);
    if (!labelText) continue;

    const tds = getDirectChildCells(tr);
    for (let j = 0; j < tds.length; j++) {
      const tdText = tds[j].textContent.trim();
      const isDatePattern = /^\d{1,2}\s+[a-zA-Z]{3,10}\s+\d{4}$/.test(tdText) || tdText.toUpperCase() === 'NO EXPIRY';
      if (isDatePattern) {
        if (shouldIgnore(tds[j])) continue;
        const parsedDate = parseLicenseDate(tdText);
        const isVisExpired = isRedOrExpired(tds[j]) || isRedOrExpired(tr) || rowText.includes('EXPIRED');
        processQualification(labelText, tdText, parsedDate, isVisExpired);
      }
    }
  }

  // --- Pass 3: Fallbacks ---
  const elements = doc.querySelectorAll('b, span, td, div, p, font, strong');
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    if (isUnderPg2(el)) continue;
    if (el.children.length === 0 && el.textContent.trim().length > 0) {
      if (shouldIgnore(el)) continue;
      if (isRedOrExpired(el)) {
        let labelText = "";
        let dateText = el.textContent.trim();
        const tr = el.closest('tr');
        const card = el.closest('.card');
        if (tr) {
          const rowNormalized = tr.textContent.toUpperCase().replace(/\s+/g, '');
          if (rowNormalized.includes('CLASS1(SC)') || rowNormalized.includes('CLASS1SC') || rowNormalized.includes('CLASS1(S.C.)')) continue;
          const labelTd = tr.querySelector('.text-left') || tr.querySelector('td');
          if (labelTd) {
            labelText = labelTd.textContent.replace('•', '').trim();
          }
        } else if (card) {
          const cardNormalized = card.textContent.toUpperCase().replace(/\s+/g, '');
          if (cardNormalized.includes('CLASS1(SC)') || cardNormalized.includes('CLASS1SC') || cardNormalized.includes('CLASS1(S.C.)')) continue;
          const titleEl = card.querySelector('.col-sm-12 .bg-gray-300') || card.querySelector('div[style*="font-weight: 500"]') || card.querySelector('.fs-5');
          if (titleEl) labelText = titleEl.textContent.trim();
          const dateEl = card.querySelector('.text-uppercase b') || card.querySelector('.fs-4 b, .fs-3 b');
          if (dateEl) dateText = dateEl.textContent.trim();
        }
        if (!labelText) labelText = "Qualification";
        const key = labelText.toUpperCase().replace(/\s+/g, '');
        if (!qualificationData[key]) {
          const parsedDate = parseLicenseDate(dateText);
          processQualification(labelText, dateText, parsedDate, true);
        } else {
          qualificationData[key].status = "EXPIRED";
        }
      }
    }
  }

  // Compile lists & overall status
  const qualificationsList = Object.values(qualificationData);
  let overallStatus = "VALID";
  let expiredCount = 0;
  let expiringSoonCount = 0;

  qualificationsList.forEach(item => {
    if (item.status === "EXPIRED") {
      expiredCount++;
    } else if (item.status === "EXPIRING_SOON") {
      expiringSoonCount++;
    }
  });

  if (expiredCount > 0) {
    overallStatus = "EXPIRED";
  } else if (expiringSoonCount > 0) {
    overallStatus = "EXPIRING_SOON";
  }

  return {
    pilotDetails: {
      name: pilotName || "-",
      licenseType: licenseType || "-",
      licenseNo: licenseNo || "-"
    },
    qualifications: qualificationsList,
    overallStatus,
    expiredCount,
    expiringSoonCount
  };
}
