// js/components/dock.js
export const dockHTML = `
<!-- PERSISTENT FULL-WIDTH BOTTOM NAVIGATION BAR -->
<div id="persistent-dock" 
     class="fixed bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 shadow-lg z-40 transition-transform duration-300 ease-in-out transform translate-y-0">
  
  <!-- 5-Column Centered Equal Grid -->
  <div class="max-w-md mx-auto h-full grid grid-cols-5 items-center justify-items-center px-1">
    
    <!-- 1. Credentials Button -->
    <button id="dock-creds-btn" class="flex flex-col items-center justify-center gap-1 text-slate-500 dark:text-slate-400 p-1.5 active:scale-95 transition-transform w-full">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"></path>
      </svg>
      <span class="text-[9px] font-bold tracking-tight">Credentials</span>
    </button>

    <!-- 2. History Button -->
    <button id="dock-history-btn" class="flex flex-col items-center justify-center gap-1 text-slate-500 dark:text-slate-400 p-1.5 active:scale-95 transition-transform w-full">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span class="text-[9px] font-bold tracking-tight">History</span>
    </button>

    <!-- 3. CENTER THREADS-STYLE SCAN BUTTON -->
    <button id="dock-scan-btn" class="flex flex-col items-center justify-center gap-1 text-blue-600 dark:text-blue-400 bg-blue-100/70 dark:bg-blue-900/40 px-2 py-1 rounded-xl active:scale-95 transition-all w-[88%] my-auto">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <!-- <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /> -->
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
      </svg>
      <span class="text-[9px] font-extrabold tracking-tight">Scan</span>
    </button>

    <!-- 4. Tools Button -->
    <button id="dock-tools-btn" class="flex flex-col items-center justify-center gap-1 text-slate-500 dark:text-slate-400 p-1.5 active:scale-95 transition-transform w-full">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.67 2.67 0 0021 17.25l-5.83-5.83M11.42 15.17l2.496-3.03c.317-.384.74-.664 1.208-.802l2.368-.701a2.67 2.67 0 00-1.851-5.07l-2.368.701c-.468.138-.891.418-1.208.802l-2.496 3.03M11.42 15.17l-4.655 5.653a2.67 2.67 0 01-3.776-3.776l5.653-4.655"></path>
      </svg>
      <span class="text-[9px] font-bold tracking-tight">Tools</span>
    </button>

    <!-- 5. Menu Button -->
    <button id="dock-menu-btn" class="flex flex-col items-center justify-center gap-1 text-slate-500 dark:text-slate-400 p-1.5 active:scale-95 transition-transform w-full">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>
      </svg>
      <span class="text-[9px] font-bold tracking-tight">Menu</span>
    </button>

  </div>
</div>
`;
