// Validates CAAM Digital Licence URLs: Not too strict (ignores parameter order & casing) 
// and not too loose (guarantees the official domain, path, and key structures are correct)
function isValidLicenseUrl(url) {
  if (!url) return false;
  
  const cleanUrl = url.trim();

  // 1. Check the domain and path (Case-Insensitive)
  const basePattern = /^https?:\/\/eclipse\.caam\.gov\.my\/elicensing\/userprofileqr\.do\?/i;
  if (!basePattern.test(cleanUrl)) return false;

  // 2. Parse parameters to ensure it's "not too strict" about parameter order, 
  // but "not too loose" about key credential components
  try {
    const urlObj = new URL(cleanUrl);
    const params = urlObj.searchParams;

    const m = params.get('m');
    const personid = params.get('personid');
    const key = params.get('key');

    // Confirm essential credentials are present and correctly formatted:
    const hasCorrectMethod = m && m.toLowerCase() === 'viewmydigitallicenseqr';
    const hasNumericPersonId = personid && /^\d+$/.test(personid); // Digits only
    const has32HexKey = key && /^[a-f0-9]{32}$/i.test(key);       // 32-character hex key

    return !!(hasCorrectMethod && hasNumericPersonId && has32HexKey);
  } catch (e) {
    // Fallback loose check if URL parsing fails on legacy browsers
    const lowerUrl = cleanUrl.toLowerCase();
    return lowerUrl.includes("eclipse.caam.gov.my") && 
           lowerUrl.includes("viewmydigitallicenseqr") &&
           lowerUrl.includes("personid=") &&
           lowerUrl.includes("key=");
  }
}
