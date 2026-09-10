// js/components/dock.js
export const dockHTML = `
<!-- PERSISTENT FULL-WIDTH BOTTOM NAVIGATION BAR -->
<div id="persistent-dock" 
     class="fixed bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 shadow-lg z-40 transition-transform duration-300 ease-in-out transform translate-y-0">
  
  <!-- 5-Column Centered Equal Grid -->
  <div class="max-w-md mx-auto h-full grid grid-cols-5 items-center justify-items-center px-1">
    
    <!-- 1. Credentials Button -->
    <button id="dock-creds-btn" class="flex flex-col items-center justify-center gap-1 text-slate-500 dark:text-slate-400 p-1.5 active:scale-95 transition-transform w-full">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"></path>
      </svg>
      <span class="text-[9px] font-bold tracking-tight">Credentials</span>
    </button>

    <!-- 2. History Button -->
    <button id="dock-history-btn" class="flex flex-col items-center justify-center gap-1 text-slate-500 dark:text-slate-400 p-1.5 active:scale-95 transition-transform w-full">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span class="text-[9px] font-bold tracking-tight">History</span>
    </button>

    <!-- 3. CENTER THREADS-STYLE SCAN BUTTON -->
    <button id="dock-scan-btn" class="flex flex-col items-center justify-center gap-1 text-blue-600 dark:text-blue-400 bg-blue-100/70 dark:bg-blue-900/40 px-2 py-1 rounded-xl active:scale-95 transition-all w-[88%] my-auto">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
      </svg>
      <span class="text-[9px] font-extrabold tracking-tight">Scan</span>
    </button>

    <!-- 4. Tools Button (Updated Calculator Icon) -->
    <button id="dock-tools-btn" class="flex flex-col items-center justify-center gap-1 text-slate-500 dark:text-slate-400 p-1.5 active:scale-95 transition-transform w-full">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" />
      </svg>
      <span class="text-[9px] font-bold tracking-tight">Tools</span>
    </button>

    <!-- 5. Menu Button -->
    <button id="dock-menu-btn" class="flex flex-col items-center justify-center gap-1 text-slate-500 dark:text-slate-400 p-1.5 active:scale-95 transition-transform w-full">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>
      </svg>
      <span class="text-[9px] font-bold tracking-tight">Menu</span>
    </button>

  </div>
</div>
`;
