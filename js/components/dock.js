// js/components/dock.js
export const dockHTML = `
<!-- PERSISTENT FULL-WIDTH BOTTOM NAVIGATION BAR -->
<div id="persistent-dock" 
     class="fixed bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 shadow-lg z-40 transition-transform duration-300 ease-in-out transform translate-y-0">
  
  <!-- Centered Proportionate 4-Column Grid -->
  <div class="max-w-md mx-auto h-full grid grid-cols-4 items-center justify-items-center px-2">
    
    <!-- 1. Credentials (CAAM + MAB Folder Tabs) -->
    <button id="dock-creds-btn" class="flex flex-col items-center justify-center gap-1 text-blue-600 dark:text-blue-400 p-2 active:scale-95 transition-transform w-full">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"></path>
      </svg>
      <span class="text-[9px] font-extrabold tracking-tight">Credentials</span>
    </button>

    <!-- 2. History Shortcut -->
    <button id="dock-history-btn" class="flex flex-col items-center justify-center gap-1 text-slate-500 dark:text-slate-400 p-2 active:scale-95 transition-transform w-full">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span class="text-[9px] font-bold tracking-tight">History</span>
    </button>

    <!-- 3. Pilot Tools Shortcut -->
    <button id="dock-tools-btn" class="flex flex-col items-center justify-center gap-1 text-slate-500 dark:text-slate-400 p-2 active:scale-95 transition-transform w-full">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.67 2.67 0 0021 17.25l-5.83-5.83M11.42 15.17l2.496-3.03c.317-.384.74-.664 1.208-.802l2.368-.701a2.67 2.67 0 00-1.851-5.07l-2.368.701c-.468.138-.891.418-1.208.802l-2.496 3.03M11.42 15.17l-4.655 5.653a2.67 2.67 0 01-3.776-3.776l5.653-4.655"></path>
      </svg>
      <span class="text-[9px] font-bold tracking-tight">Tools</span>
    </button>

    <!-- 4. Main Menu Toggle -->
    <button id="dock-menu-btn" class="flex flex-col items-center justify-center gap-1 text-slate-500 dark:text-slate-400 p-2 active:scale-95 transition-transform w-full">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>
      </svg>
      <span class="text-[9px] font-bold tracking-tight">Menu</span>
    </button>

  </div>
</div>
`;  </button>

</div>
`;
