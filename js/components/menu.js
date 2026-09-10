// js/components/menu.js
export const menuHTML = `


<!-- DIMMED BACKDROP OVERLAY -->
<div id="bottom-sheet-overlay" 
     class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 hidden opacity-0 transition-opacity duration-300"></div>

<!-- BOTTOM SHEET CONTAINER -->
<div id="bottom-sheet-menu" 
     class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-t-[32px] shadow-2xl transform translate-y-full transition-transform duration-300 ease-out max-w-md mx-auto border-t border-slate-100 dark:border-slate-800 overflow-hidden min-h-[380px] max-h-[85vh] flex flex-col">
  
  <!-- Drag Handle -->
  <div class="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto my-3 shrink-0"></div>

  <!-- SLIDING PANES VIEWPORT -->
  <div class="relative w-full flex-1 overflow-x-hidden overflow-y-auto pb-6 px-6">
    
    <!-- PANE 1: MAIN CATEGORIES -->
    <div id="pane-main" class="w-full transition-transform duration-300 ease-in-out">
      <div class="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
        CertiFly Menu
      </div>

      <div class="flex flex-col gap-2.5">
        <!-- Category 1: History -->
        <button class="nav-item-btn w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 active:scale-[0.98] transition-all"
                data-target="pane-history">
          <div class="flex items-center gap-3.5">
            <div class="p-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="text-left">
              <div class="text-xs font-bold text-slate-800 dark:text-slate-100">Scan History & Logs</div>
              <div class="text-[10px] text-slate-400">Past license checks & MAB sync</div>
            </div>
          </div>
          <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg>
        </button>

        <!-- Category 2: Tools -->
        <button class="nav-item-btn w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 active:scale-[0.98] transition-all"
                data-target="pane-tools">
          <div class="flex items-center gap-3.5">
            <div class="p-2.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.67 2.67 0 0021 17.25l-5.83-5.83M11.42 15.17l2.496-3.03c.317-.384.74-.664 1.208-.802l2.368-.701a2.67 2.67 0 00-1.851-5.07l-2.368.701c-.468.138-.891.418-1.208.802l-2.496 3.03M11.42 15.17l-4.655 5.653a2.67 2.67 0 01-3.776-3.776l5.653-4.655"></path>
              </svg>
            </div>
            <div class="text-left">
              <div class="text-xs font-bold text-slate-800 dark:text-slate-100">Pilot Tools</div>
              <div class="text-[10px] text-slate-400">Expiry calculator & manual URL input</div>
            </div>
          </div>
          <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg>
        </button>

        <!-- Category 3: Preferences -->
        <button class="nav-item-btn w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 active:scale-[0.98] transition-all"
                data-target="pane-settings">
          <div class="flex items-center gap-3.5">
            <div class="p-2.5 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-xl">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              </svg>
            </div>
            <div class="text-left">
              <div class="text-xs font-bold text-slate-800 dark:text-slate-100">Preferences</div>
              <div class="text-[10px] text-slate-400">Dark mode & text size toggles</div>
            </div>
          </div>
          <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg>
        </button>

        <!-- Category 4: Help -->
        <button class="nav-item-btn w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 active:scale-[0.98] transition-all"
                data-target="pane-help">
          <div class="flex items-center gap-3.5">
            <div class="p-2.5 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-xl">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="text-left">
              <div class="text-xs font-bold text-slate-800 dark:text-slate-100">Help & Portals</div>
              <div class="text-[10px] text-slate-400">Guides, CAAM & MAB links</div>
            </div>
          </div>
          <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
    </div>

    <!-- SUB-PANE 1: HISTORY -->
    <div id="pane-history" class="sub-pane absolute top-0 left-0 w-full transform translate-x-full transition-transform duration-300 ease-in-out hidden px-6">
      <button class="back-btn flex items-center gap-1.5 text-xs font-extrabold text-blue-600 dark:text-blue-400 mb-4">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg> Back
      </button>
      <h3 class="text-xs font-black text-slate-800 dark:text-slate-100 mb-3">Scan History & Logs</h3>
      <div id="sub-history-list" class="flex flex-col gap-2 max-h-[220px] overflow-y-auto mb-4"></div>
      <button id="sub-clear-history-btn" class="w-full p-3 text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-100 dark:border-rose-900/50">
        Clear Local History
      </button>
    </div>

    <!-- SUB-PANE 2: PILOT TOOLS -->
    <div id="pane-tools" class="sub-pane absolute top-0 left-0 w-full transform translate-x-full transition-transform duration-300 ease-in-out hidden px-6">
      <button class="back-btn flex items-center gap-1.5 text-xs font-extrabold text-blue-600 dark:text-blue-400 mb-4">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg> Back
      </button>
      <h3 class="text-xs font-black text-slate-800 dark:text-slate-100 mb-3">Validity Expiry Calculator</h3>
      <div class="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60 flex flex-col gap-3">
        <div>
          <label class="text-[10px] font-bold text-slate-400 uppercase">Check/Test Date</label>
          <input type="date" id="calc-base-date" class="w-full p-2.5 mt-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100">
        </div>
        <div>
          <label class="text-[10px] font-bold text-slate-400 uppercase">Validity Period</label>
          <div class="grid grid-cols-3 gap-2 mt-1">
            <button class="calc-duration-btn p-2 text-xs font-bold bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 active:bg-blue-600 active:text-white" data-months="6">+6 Mo</button>
            <button class="calc-duration-btn p-2 text-xs font-bold bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 active:bg-blue-600 active:text-white" data-months="12">+12 Mo</button>
            <button class="calc-duration-btn p-2 text-xs font-bold bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 active:bg-blue-600 active:text-white" data-months="24">+24 Mo</button>
          </div>
        </div>
        <div id="calc-result-box" class="mt-2 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-center border border-blue-100 dark:border-blue-900/40 hidden">
          <div class="text-[10px] text-blue-500 font-bold uppercase">Calculated Expiry Date</div>
          <div id="calc-result-date" class="text-sm font-black text-blue-900 dark:text-blue-200 mt-0.5">--</div>
        </div>
      </div>
    </div>

    <!-- SUB-PANE 3: PREFERENCES -->
    <div id="pane-settings" class="sub-pane absolute top-0 left-0 w-full transform translate-x-full transition-transform duration-300 ease-in-out hidden px-6">
      <button class="back-btn flex items-center gap-1.5 text-xs font-extrabold text-blue-600 dark:text-blue-400 mb-4">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg> Back
      </button>
      <h3 class="text-xs font-black text-slate-800 dark:text-slate-100 mb-3">Preferences</h3>
      <div class="grid grid-cols-2 gap-3">
        <button id="dark-mode-toggle" class="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 active:scale-95 transition-all">
          <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Theme</span>
          <div class="p-2 bg-amber-100 dark:bg-slate-700 text-amber-600 dark:text-amber-300 rounded-xl">
            <svg id="icon-sun" class="w-5 h-5 block dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m0 13.5V21m8.966-8.966h-2.25m-13.5 0H3m15.364-6.364l-1.591 1.591M6.758 17.242l-1.591 1.591m12.728 0l-1.591-1.591M6.758 6.758L5.167 5.167M12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z"></path></svg>
            <svg id="icon-moon" class="w-5 h-5 hidden dark:block" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"></path></svg>
          </div>
        </button>
        <button id="text-size-toggle" class="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 active:scale-95 transition-all">
          <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Text Size</span>
          <div class="p-2 bg-blue-100 dark:bg-slate-700 text-blue-600 dark:text-blue-300 rounded-xl">
            <svg id="icon-text-normal" class="w-5 h-5 block" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.25h12M9 3.75v16.5"></path></svg>
            <svg id="icon-text-bigger" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path></svg>
          </div>
        </button>
      </div>
    </div>

    <!-- SUB-PANE 4: HELP -->
    <div id="pane-help" class="sub-pane absolute top-0 left-0 w-full transform translate-x-full transition-transform duration-300 ease-in-out hidden px-6">
      <button class="back-btn flex items-center gap-1.5 text-xs font-extrabold text-blue-600 dark:text-blue-400 mb-4">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg> Back
      </button>
      <h3 class="text-xs font-black text-slate-800 dark:text-slate-100 mb-3">Help & Aviation Portals</h3>
      <div class="flex flex-col gap-2">
        <a href="https://www.caam.gov.my" target="_blank" rel="noopener noreferrer" class="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 text-xs font-bold text-slate-700 dark:text-slate-200 block">CAAM eCLIPSE Portal ↗</a>
        <a href="https://portal.mab-academy.com" target="_blank" rel="noopener noreferrer" class="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 text-xs font-bold text-slate-700 dark:text-slate-200 block">MAB TMS Portal ↗</a>
      </div>
    </div>

  </div>
</div>
`;
