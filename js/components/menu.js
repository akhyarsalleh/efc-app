// js/components/menu.js
export const menuHTML = `
<!-- DIMMED BACKDROP OVERLAY -->
<div id="bottom-sheet-overlay" 
     class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 hidden opacity-0 transition-opacity duration-300"></div>

<!-- BOTTOM SHEET CONTAINER -->
<div id="bottom-sheet-menu" 
     class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-t-[32px] shadow-2xl transform translate-y-full transition-transform duration-300 ease-out max-w-md mx-auto border-t border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col hidden min-h-[250px] max-h-[85vh]">
  
  <!-- Drag Handle -->
  <div class="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto my-3 shrink-0"></div>

  <!-- CONTAINER CONTENT AREA -->
  <div id="sheet-content" class="w-full flex-1 overflow-y-auto pb-6 px-6">
    <!-- Dynamic submenu contents render here -->
  </div>
</div>
`;
