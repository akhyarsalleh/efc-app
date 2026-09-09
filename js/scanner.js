// js/scanner.js - Nimiq QR Scanner Hardware Stream Controller

let qrScanner = null;

if (typeof QrScanner !== 'undefined') {
  QrScanner.WORKER_PATH = 'js/qr-scanner-worker.min.js';
}

export function startScanner(onDecodeCallback, onErrorCallback) {
  const errorMsg = document.getElementById("error-message");
  if (errorMsg) errorMsg.innerText = "";

  const qrContainer = document.getElementById("qr-reader-container");
  if (qrContainer) qrContainer.classList.remove("hidden");

  const historyWrapper = document.getElementById("history-card-wrapper");
  if (historyWrapper) historyWrapper.classList.add("hidden");

  const customDivider = document.getElementById("cust_div");
  if (customDivider) customDivider.classList.add("hidden");

  const manForm = document.getElementById("manual_form");
  if (manForm) manForm.classList.add("hidden");

  const startBtn = document.getElementById("start-scan-btn");
  if (startBtn) startBtn.classList.add("hidden");

  const stopBtn = document.getElementById("stop-scan-btn");
  if (stopBtn) stopBtn.classList.remove("hidden");

  const videoElem = document.getElementById("qr-video");
  if (!videoElem) {
    if (onErrorCallback) onErrorCallback("Camera feed element not found.");
    return;
  }

  qrScanner = new QrScanner(
    videoElem,
    result => {
      const decodedText = typeof result === 'object' ? result.data : result;
      const cleanScannedText = (decodedText || "").trim();
      if (onDecodeCallback) onDecodeCallback(cleanScannedText);
    },
    {
      highlightScanRegion: true,
      highlightCodeOutline: true,
      maxScansPerSecond: 25,
      preferredCamera: 'environment',
      calculateScanRegion: (video) => {
        const smallerDimension = Math.min(video.videoWidth, video.videoHeight);
        const scanRegionSize = Math.round(smallerDimension * 0.85);
        return {
          x: Math.round((video.videoWidth - scanRegionSize) / 2),
          y: Math.round((video.videoHeight - scanRegionSize) / 2),
          width: scanRegionSize,
          height: scanRegionSize,
          downScaledWidth: 800,
          downScaledHeight: 800
        };
      }
    }
  );

  qrScanner.start().catch(err => {
    if (onErrorCallback) onErrorCallback("Camera Access Failed: " + err);
  });
}

export function stopScanner() {
  if (qrScanner) {
    qrScanner.destroy();
    qrScanner = null;

    const qrContainer = document.getElementById("qr-reader-container");
    if (qrContainer) qrContainer.classList.add("hidden");

    const historyWrapper = document.getElementById("history-card-wrapper");
    if (historyWrapper) historyWrapper.classList.remove("hidden");

    const customDivider = document.getElementById("cust_div");
    if (customDivider) customDivider.classList.remove("hidden");

    const manForm = document.getElementById("manual_form");
    if (manForm) manForm.classList.remove("hidden");

    const startBtn = document.getElementById("start-scan-btn");
    if (startBtn) startBtn.classList.remove("hidden");

    const stopBtn = document.getElementById("stop-scan-btn");
    if (stopBtn) stopBtn.classList.add("hidden");
  }

  return Promise.resolve();
}
