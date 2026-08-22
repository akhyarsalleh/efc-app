// app.js - License Scanner App Client

// Configuration - Replace with your deployed Vercel URL
const PROXY_URL = '/api/proxy'; // Relative path if hosted on same domain, or external URL e.g. 'https://my-proxy.vercel.app/api/proxy'
const DEFAULT_THRESHOLD = 30; // Days warning threshold

// Global state
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
}

function showScannerView() {
  stopScanner();
  document.getElementById("error-message").innerText = "";
  document.getElementById("manual-url-input").value = "";
  showView("scanner-view");
}

function showLoading(msg = "Fetching digital license...") {
  document.getElementById("loading-text").innerText = msg;
  showView("loading-view");
}

function showError(msg) {
  stopScanner();
  const errMsg = document.getElementById("error-message");
  if (errMsg) {
    errMsg.innerText = msg;
  } else {
    alert(msg);
  }
  showView("scanner-view");
}

// -----------------------------------------
// QR Scanner Controller
// -----------------------------------------

function startScanner() {
  document.getElementById("error-message").innerText = "";
  const qrContainer = document.getElementById("qr-reader-container");
  qrContainer.classList.remove("hidden");
  
  document.getElementById("start-scan-btn").classList.add("hidden");
  document.getElementById("stop-scan-btn").classList.remove("hidden");

  // Initialize html5-qrcode
  html5QrcodeScanner = new Html5Qrcode("qr-reader");
  
  const qrCodeSuccessCallback = (decodedText, decodedResult) => {
    // Valid URL scanned
    if (decodedText.startsWith("http://") || decodedText.startsWith("https://")) {
      processLicenseUrl(decodedText);
    } else {
      showError("Invalid QR Content. Scanned text is not a URL: " + decodedText);
    }
  };

  const config = { fps: 10, qrbox: { width: 250, height: 250 } };

  html5QrcodeScanner.start(
    { facingMode: "environment" },
    config,
    qrCodeSuccessCallback,
    (errorMessage) => {
      // Direct scanning logs are chatty and can be ignored
    }
  ).catch(err => {
    showError("Camera Access Failed: " + err);
  });
}

function stopScanner() {
  if (html5QrcodeScanner) {
    html5QrcodeScanner.stop().then(() => {
      html5QrcodeScanner = null;
      document.getElementById("qr-reader-container").classList.add("hidden");
      document.getElementById("start-scan-btn").classList.remove("hidden");
      document.getElementById("stop-scan-btn").classList.add("hidden");
    }).catch(err => {
      console.warn("Failed to stop scanner cleanly:", err);
    });
  }
}

function handleManualUrl() {
  const urlInput = document.getElementById("manual-url-input").value.trim();
  if (!urlInput) {
    showError("Please enter a valid URL.");
    return;
  }
  if (!urlInput.startsWith("http://") && !urlInput.startsWith("https://")) {
    showError("The URL must start with http:// or https://");
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
  stopScanner();
  showLoading("Fetching digital license via proxy...");

  try {
    const fetchUrl = `${PROXY_URL}?url=${encodeURIComponent(url)}`;
    const response = await fetch(fetchUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch license content (Status ${response.status})`);
    }

    const htmlContent = await response.text();
    showLoading("Parsing license qualifications...");
    
    // Parse using DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    
    const results = parseLicenseDOM(doc);
    renderResults(results);
  } catch (error) {
    console.error("Processing error:", error);
    showError(`Error processing digital license: ${error.message}. Please verify proxy is active.`);
  }
}

// -----------------------------------------
// UI Rendering of Results
// -----------------------------------------

function renderResults(results) {
  // Set Pilot profile details
  document.getElementById("pilot-name").innerText = results.pilotDetails.name || "N/A";
  document.getElementById("licence-type").innerText = results.pilotDetails.licenseType || "N/A";
  document.getElementById("licence-number").innerText = results.pilotDetails.licenseNo || "N/A";

  // Set Overall Status Badge & Title Styling
  const statusBadge = document.getElementById("overall-status-badge");
  const resultHeader = document.getElementById("result-header");
  const overallMsg = document.getElementById("overall-message");

  statusBadge.className = "status-badge font-bold uppercase rounded px-4 py-2 text-white inline-block text-lg mt-2";
  
  if (results.overallStatus === "EXPIRED") {
    statusBadge.innerText = "DO NOT FLY!";
    statusBadge.classList.add("bg-red-600");
    resultHeader.style.color = "#dc2626";
    overallMsg.innerText = "Qualification Expired / Invalid. One or more mandatory requirements have lapsed.";
  } else if (results.overallStatus === "EXPIRING_SOON") {
    statusBadge.innerText = "FLY WITH CAUTION!";
    statusBadge.classList.add("bg-amber-500");
    resultHeader.style.color = "#d97706";
    overallMsg.innerText = "Qualification Expiring Soon. Take action on soon-to-expire credentials.";
  } else {
    statusBadge.innerText = "HAVE A SAFE FLIGHT!";
    statusBadge.classList.add("bg-green-600");
    resultHeader.style.color = "#16a34a";
    overallMsg.innerText = "All licence qualifications and medical checks are valid.";
  }

  // Populate list of qualifications
  const container = document.getElementById("qualifications-list");
  container.innerHTML = "";

  if (results.qualifications.length === 0) {
    container.innerHTML = `
      <div class="text-center text-slate-500 py-6">
        No qualifications found on the scanned digital license.
      </div>`;
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
    return el.closest('#pg2') !== null;
  }
  let curr = el;
  while (curr) {
    if (curr.id === 'pg2') return true;
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
  
  // Extract Pilot Name
  for (let i = 0; i < allElements.length; i++) {
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

  // Extract License Type & License Number
  for (let i = 0; i < allElements.length; i++) {
    const text = allElements[i].textContent.trim();
    if (text === "II") {
      const tr = allElements[i].closest('tr');
      if (tr) {
        const tds = tr.querySelectorAll('td, th');
        if (tds.length > 1) {
          for (let j = 0; j < tds.length; j++) {
            if (tds[j] !== allElements[i] && tds[j].textContent.trim()) {
              licenseType = tds[j].textContent.trim().replace(/\s+/g, ' ');
              break;
            }
          }
        } else {
          const nextTr = tr.nextElementSibling;
          if (nextTr) {
            licenseType = nextTr.textContent.trim().replace(/\s+/g, ' ');
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

  if (!licenseNo) {
    for (let i = 0; i < allElements.length; i++) {
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
    
    if (cardText.includes('MEDICAL EXPIRY DATE') || cardText.includes('TARIKH TAMAT TEMPOH PERUBATAN') ||
        cardText.includes('LICENCE TYPE') || cardText.includes('VALIDITY EXPIRY DATE')) {
      continue;
    }
    
    const cardNormalized = cardText.replace(/\s+/g, '');
    if (cardNormalized.includes('CLASS1(SC)') || cardNormalized.includes('CLASS1SC') || cardNormalized.includes('CLASS1(S.C.)')) {
      continue;
    }
    
    const titleEl = card.querySelector('.col-sm-12 .bg-gray-300') ||
                    card.querySelector('div[style*="font-weight: 500"]') ||
                    card.querySelector('.fs-5');
    const labelText = titleEl ? titleEl.textContent.trim() : "";
    
    const dateEl = card.querySelector('.text-uppercase b') ||
                   card.querySelector('.fs-4 b, .fs-3 b');
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
          const titleEl = card.querySelector('.col-sm-12 .bg-gray-300') ||
                          card.querySelector('div[style*="font-weight: 500"]') ||
                          card.querySelector('.fs-5');
          if (titleEl) labelText = titleEl.textContent.trim();
          const dateEl = card.querySelector('.text-uppercase b') ||
                         card.querySelector('.fs-4 b, .fs-3 b');
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
      name: pilotName || "Unknown Pilot",
      licenseType: licenseType || "Unknown Licence Type",
      licenseNo: licenseNo || "Unknown Licence No"
    },
    qualifications: qualificationsList,
    overallStatus,
    expiredCount,
    expiringSoonCount
  };
}
