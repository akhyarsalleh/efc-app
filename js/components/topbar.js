// js/components/topbar.js - Redesigned Persistent Mini Top Bar

export const topbarHTML = `
<!-- REDESIGNED MINI TOP BAR -->
<div id="persistent-topbar" 
     class="fixed top-0 left-0 right-0 h-12 bg-blue-950 text-white border-b border-blue-900 shadow-lg z-40 transform -translate-y-full opacity-0 will-change-transform transition-all duration-300">
  
  <div class="max-w-md mx-auto h-full flex items-center justify-between px-3">
    
    <!-- Left Group: Mini Home + Thin Vertical Separator + Left-Aligned Compact Logo -->
    <div class="flex items-center gap-2.5">
      <!-- Mini Home Button -->
      <button onclick="if(window.showScannerView) window.showScannerView();" 
              class="p-1.5 hover:bg-white/10 active:scale-95 rounded-md transition-all text-white flex items-center justify-center cursor-pointer" 
              aria-label="Home">
        <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" clip-rule="evenodd" />
        </svg>
      </button>

      <!-- Thin Vertical Line Separator -->
      <div class="w-px h-4 bg-white/20"></div>

      <!-- Compact Logo (Tightened Gap Between ™ and Wau Logo) -->
      <div class="flex items-center gap-0.5 font-semibold italic text-xs tracking-tight pointer-events-none">
        <span class="leading-none">
          CertiFly<span class="align-super text-[6px] font-bold ml-0.5">™</span>
        </span>
        <svg class="h-3.5 w-auto fill-current text-white shrink-0" viewBox="0 0 98 72" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.144,35.354L9.8,36.674C9.8,36.674 14.131,36.602 15.877,36.602C19.875,36.598 22.309,36.964 22.577,39.398C22.814,41.038 22.053,42.614 21.614,44.162C21.191,45.664 20.807,47.105 20.39,48.588C19.95,50.152 19.476,51.531 18.64,52.587C17.688,53.785 16.472,54.58 15.227,54.884C13.512,55.303 6.502,55.055 4.55,55.055C4.331,55.605 4.2,56.245 4.024,56.84C9.708,57.13 15.186,56.748 21.003,56.925C22.889,56.983 24.762,57.183 26.427,56.84C28.966,56.321 30.801,54.574 31.59,52.245C32.371,49.951 33.078,47.278 33.779,44.844C34.163,43.51 34.409,42.25 35.003,41.185C35.57,40.169 36.318,39.378 37.278,38.631C39.04,37.266 41.91,36.117 44.63,37.441C45.971,38.092 46.75,39.176 46.731,41.185C46.715,42.914 46.134,44.337 45.681,45.949C44.325,50.762 43.13,54.852 41.83,59.564C41.403,61.11 41.074,62.768 40.518,64.074C39.439,66.61 37.064,68.684 33.955,69.179C31.349,69.593 28.385,69.265 25.64,69.265L0.613,69.265C0.613,69.265 0.186,70.495 0,71.137C10.984,71.292 22.305,71.22 32.992,71.22C35.903,71.22 38.599,71.298 41.131,71.051C48.391,70.344 54.817,68.307 60.12,65.435C68.938,60.661 75.866,53.998 80.948,45.44C83.874,40.509 88.767,36.753 96.812,36.753C97.043,36.141 97.16,35.875 97.35,35.354L10.144,35.354L10.144,35.354Z" />
          <path d="M97.674,34.461C91.512,34.598 86.903,31.955 86.462,26.379C86.372,25.254 86.47,24.202 86.374,23.231C86.071,20.148 85.407,17.72 84.36,15.317C80.344,6.093 72.42,1.014 59.683,0L20.128,0C20.052,0.692 19.743,1.157 19.69,1.872L45.243,1.872C48.033,1.872 51.129,1.493 53.469,2.127C54.98,2.536 56.823,3.895 56.707,6.55C56.648,7.912 56.012,9.361 55.568,10.891C54.344,15.126 53.293,19.321 52.069,23.57C51.272,26.331 50.706,29.272 49.005,31.313C47.464,33.164 44.67,34.974 41.304,34.036C40.08,33.694 39.313,33.263 38.768,32.42C37.447,30.385 38.661,27.255 39.293,25.017C39.638,23.789 40.016,22.65 40.341,21.527C40.654,20.448 41.19,19.152 41.216,17.869C41.261,15.895 40.004,14.878 38.768,14.464C37.3,13.977 35.183,14.21 33.253,14.21C27.62,14.21 21.544,14.14 16.101,14.295C15.985,14.89 15.76,15.38 15.664,15.997C20.565,15.997 28.44,15.382 28.44,19.401C28.452,20.339 28.113,21.388 27.827,22.378C27.306,24.191 26.76,25.985 26.253,27.825C25.996,28.758 25.82,29.719 25.466,30.548C24.534,32.732 23.549,34.461 19.952,34.461L10.372,34.461L10.143,35.354L97.349,35.354C97.484,34.956 97.558,34.761 97.674,34.461" />
        </svg>
      </div>
    </div>

    <!-- Right: Preference Toggles Box (Wider Horizontal Padding) -->
    <div class="flex items-center border border-white/20 rounded-lg overflow-hidden h-8">
      <!-- Text Size Toggle -->
      <button id="topbar-text-btn" 
              class="px-3.5 py-1.5 hover:bg-white/10 active:bg-white/20 transition-colors border-r border-white/20 flex items-center justify-center cursor-pointer" 
              aria-label="Toggle Text Size">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 18l3-7 3 7M5 15h4" />
          <path d="M13 18l4-11 4 11M14 14h6" />
          <path d="M11 5l1-1 1 1" />
        </svg>
      </button>

      <!-- Theme / Appearance Toggle -->
      <button id="topbar-theme-btn" 
              class="px-3.5 py-1.5 hover:bg-white/10 active:bg-white/20 transition-colors flex items-center justify-center cursor-pointer" 
              aria-label="Toggle Appearance">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3v2.25m0 13.5V21m8.966-8.966h-2.25m-13.5 0H3m15.364-6.364l-1.591 1.591M6.758 17.242l-1.591 1.591m12.728 0l-1.591-1.591M6.758 6.758L5.167 5.167M12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" />
        </svg>
      </button>
    </div>

  </div>
</div>
`;
