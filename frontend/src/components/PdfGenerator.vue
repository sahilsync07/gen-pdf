<template>
  <div class="flex h-screen w-full bg-slate-50 font-sans text-slate-800 overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-[480px] border-r border-slate-200 bg-white flex-shrink-0 flex flex-col h-full z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
         <div class="flex items-center gap-2">
            <h2 class="text-xl font-black text-slate-800 tracking-tight">Brands</h2>
            <span class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">{{ brands.length }}</span>
         </div>
         <button @click="selectedBrands = []" class="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors" v-if="selectedBrands.length > 0">Clear</button>
      </div>
      
      <div class="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar pb-24">
         
         <!-- Paragon Section -->
         <div v-if="groupedSidebar.paragon.length > 0" class="p-2 transition-all rounded-2xl bg-red-50/30 hover:bg-red-50/60 border border-transparent hover:border-red-100">
            <div class="flex items-center justify-between px-2 mb-3">
               <div class="flex items-center gap-2">
                  <img src="https://res.cloudinary.com/dg365ewal/image/upload/v1749667072/paragonLogo_rqk3hu.webp" alt="Paragon" class="h-6 object-contain" />
               </div>
               <input type="checkbox" :checked="isCategorySelected('paragon')" @change="toggleCategory('paragon', $event)" class="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer" />
            </div>
            <div class="grid grid-cols-2 gap-2">
               <div 
                 v-for="item in groupedSidebar.paragon" 
                 :key="item.groupName"
                 class="flex items-center gap-3 px-3 py-2 rounded-xl transition-all cursor-pointer bg-white border border-transparent hover:border-red-200 shadow-sm hover:shadow-md select-none"
                 :class="{ '!bg-red-50 !border-red-200 ring-1 ring-red-200': selectedBrands.includes(item.groupName) }"
                 @click="toggleBrand(item.groupName)"
               >
                  <input type="checkbox" :checked="selectedBrands.includes(item.groupName)" class="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-gray-300 pointer-events-none" />
                  <span class="text-sm font-semibold text-slate-700 leading-tight" :class="{ 'text-red-800': selectedBrands.includes(item.groupName) }">{{ formatProductName(item.groupName) }}</span>
               </div>
            </div>
         </div>

         <!-- Top Brands Section -->
         <div v-if="groupedSidebar.topBrands.length > 0" class="p-2 transition-all rounded-2xl bg-amber-50/30 hover:bg-amber-50/60 border border-transparent hover:border-amber-100">
            <div class="flex items-center justify-between px-2 mb-3">
               <span class="text-xs font-black text-amber-600 uppercase tracking-widest pl-1">Top Brands</span>
               <input type="checkbox" :checked="isCategorySelected('topBrands')" @change="toggleCategory('topBrands', $event)" class="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer" />
            </div>
            <div class="grid grid-cols-2 gap-2">
               <div 
                 v-for="item in groupedSidebar.topBrands" 
                 :key="item.group.groupName"
                 class="flex items-center gap-3 px-3 py-2 rounded-xl transition-all cursor-pointer bg-white border border-transparent hover:border-amber-200 shadow-sm hover:shadow-md select-none"
                 :class="{ '!bg-amber-50 !border-amber-200 ring-1 ring-amber-200': selectedBrands.includes(item.group.groupName) }"
                 @click="toggleBrand(item.group.groupName)"
               >
                  <input type="checkbox" :checked="selectedBrands.includes(item.group.groupName)" class="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-gray-300 pointer-events-none" />
                  <div class="flex items-center gap-2 overflow-hidden">
                     <div class="w-6 h-6 rounded-full bg-white border border-amber-100 p-0.5 shrink-0 overflow-hidden shadow-sm flex items-center justify-center">
                        <img v-if="item.logo" :src="item.logo" class="w-full h-full object-contain" />
                        <span v-else class="text-[8px] font-bold text-amber-600">{{ item.group.groupName[0] }}</span>
                     </div>
                     <span class="text-sm font-semibold text-slate-700 leading-tight truncate" :class="{ 'text-amber-800': selectedBrands.includes(item.group.groupName) }">{{ formatProductName(item.group.groupName) }}</span>
                  </div>
               </div>
            </div>
         </div>

         <!-- Mid Brands (Purple) -->
         <div v-if="groupedSidebar.midBrands.length > 0" class="p-2 transition-all rounded-2xl bg-purple-50/30 hover:bg-purple-50/60 border border-transparent hover:border-purple-100">
            <div class="flex items-center justify-between px-2 mb-3">
               <span class="text-xs font-black text-purple-600 uppercase tracking-widest pl-1">Mid Brands</span>
               <input type="checkbox" :checked="isCategorySelected('midBrands')" @change="toggleCategory('midBrands', $event)" class="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer" />
            </div>
            <div class="grid grid-cols-2 gap-2">
               <div 
                 v-for="item in groupedSidebar.midBrands" 
                 :key="item.groupName"
                 class="flex items-center gap-3 px-3 py-2 rounded-xl transition-all cursor-pointer bg-white border border-transparent hover:border-purple-200 shadow-sm hover:shadow-md select-none"
                 :class="{ '!bg-purple-50 !border-purple-200 ring-1 ring-purple-200': selectedBrands.includes(item.groupName) }"
                 @click="toggleBrand(item.groupName)"
               >
                  <input type="checkbox" :checked="selectedBrands.includes(item.groupName)" class="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-gray-300 pointer-events-none" />
                  <span class="text-sm font-semibold text-slate-700 leading-tight" :class="{ 'text-purple-800': selectedBrands.includes(item.groupName) }">{{ formatProductName(item.groupName) }}</span>
               </div>
            </div>
         </div>

         <!-- Socks (Cyan) -->
         <div v-if="groupedSidebar.socksGroups.length > 0" class="p-2 transition-all rounded-2xl bg-cyan-50/30 hover:bg-cyan-50/60 border border-transparent hover:border-cyan-100">
            <div class="flex items-center justify-between px-2 mb-3">
               <span class="text-xs font-black text-cyan-600 uppercase tracking-widest pl-1">Socks</span>
               <input type="checkbox" :checked="isCategorySelected('socksGroups')" @change="toggleCategory('socksGroups', $event)" class="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer" />
            </div>
            <div class="grid grid-cols-2 gap-2">
               <div 
                 v-for="item in groupedSidebar.socksGroups" 
                 :key="item.groupName"
                 class="flex items-center gap-3 px-3 py-2 rounded-xl transition-all cursor-pointer bg-white border border-transparent hover:border-cyan-200 shadow-sm hover:shadow-md select-none"
                 :class="{ '!bg-cyan-50 !border-cyan-200 ring-1 ring-cyan-200': selectedBrands.includes(item.groupName) }"
                 @click="toggleBrand(item.groupName)"
               >
                  <input type="checkbox" :checked="selectedBrands.includes(item.groupName)" class="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-gray-300 pointer-events-none" />
                  <span class="text-sm font-semibold text-slate-700 leading-tight" :class="{ 'text-cyan-800': selectedBrands.includes(item.groupName) }">{{ formatProductName(item.groupName) }}</span>
               </div>
            </div>
         </div>
         
         <!-- General & Clubs Wrapper -->
         <div class="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl space-y-6">
            
            <!-- General Items -->
            <div v-if="groupedSidebar.general.length > 0">
                <div class="flex items-center justify-between px-2 mb-3">
                   <span class="text-xs font-black text-emerald-600 uppercase tracking-widest pl-1">General</span>
                   <input type="checkbox" :checked="isCategorySelected('general')" @change="toggleCategory('general', $event)" class="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer" />
                </div>
                 <div class="grid grid-cols-2 gap-2">
                   <div 
                     v-for="item in groupedSidebar.general" 
                     :key="item.groupName"
                     class="flex items-center gap-3 px-3 py-2 rounded-xl transition-all cursor-pointer bg-white border border-transparent hover:border-emerald-200 shadow-sm hover:shadow-md select-none"
                     :class="{ '!bg-emerald-50 !border-emerald-200 ring-1 ring-emerald-200': selectedBrands.includes(item.groupName) }"
                     @click="toggleBrand(item.groupName)"
                   >
                      <input type="checkbox" :checked="selectedBrands.includes(item.groupName)" class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 pointer-events-none" />
                      <span class="text-sm font-semibold text-slate-700 leading-tight" :class="{ 'text-emerald-800': selectedBrands.includes(item.groupName) }">{{ formatProductName(item.groupName) }}</span>
                   </div>
                </div>
            </div>
            
             <!-- Bansal Club -->
            <div v-if="groupedSidebar.bansalGroups.length > 0">
                <div class="flex items-center justify-between px-2 mb-3">
                   <span class="text-xs font-black text-emerald-600 uppercase tracking-widest pl-1">BANSAL CLUB</span>
                   <input type="checkbox" :checked="isCategorySelected('bansalGroups')" @change="toggleCategory('bansalGroups', $event)" class="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer" />
                </div>
                 <div class="grid grid-cols-2 gap-2">
                   <div 
                     v-for="item in groupedSidebar.bansalGroups" 
                     :key="item.groupName"
                     class="flex items-center gap-3 px-3 py-2 rounded-xl transition-all cursor-pointer bg-white border border-transparent hover:border-emerald-200 shadow-sm hover:shadow-md select-none"
                     :class="{ '!bg-emerald-50 !border-emerald-200 ring-1 ring-emerald-200': selectedBrands.includes(item.groupName) }"
                     @click="toggleBrand(item.groupName)"
                   >
                      <input type="checkbox" :checked="selectedBrands.includes(item.groupName)" class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 pointer-events-none" />
                      <span class="text-sm font-semibold text-slate-700 leading-tight" :class="{ 'text-emerald-800': selectedBrands.includes(item.groupName) }">{{ formatProductName(item.groupName) }}</span>
                   </div>
                </div>
            </div>

            <!-- Airson Club -->
            <div v-if="groupedSidebar.airsonGroups.length > 0">
                <div class="flex items-center justify-between px-2 mb-3">
                   <span class="text-xs font-black text-emerald-600 uppercase tracking-widest pl-1">AIRSON CLUB</span>
                   <input type="checkbox" :checked="isCategorySelected('airsonGroups')" @change="toggleCategory('airsonGroups', $event)" class="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer" />
                </div>
                 <div class="grid grid-cols-2 gap-2">
                   <div 
                     v-for="item in groupedSidebar.airsonGroups" 
                     :key="item.groupName"
                     class="flex items-center gap-3 px-3 py-2 rounded-xl transition-all cursor-pointer bg-white border border-transparent hover:border-emerald-200 shadow-sm hover:shadow-md select-none"
                     :class="{ '!bg-emerald-50 !border-emerald-200 ring-1 ring-emerald-200': selectedBrands.includes(item.groupName) }"
                     @click="toggleBrand(item.groupName)"
                   >
                      <input type="checkbox" :checked="selectedBrands.includes(item.groupName)" class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 pointer-events-none" />
                      <span class="text-sm font-semibold text-slate-700 leading-tight" :class="{ 'text-emerald-800': selectedBrands.includes(item.groupName) }">{{ formatProductName(item.groupName) }}</span>
                   </div>
                </div>
            </div>

            <!-- Kohinoor Club -->
            <div v-if="groupedSidebar.kohinoorGroups.length > 0">
                <div class="flex items-center justify-between px-2 mb-3">
                   <span class="text-xs font-black text-emerald-600 uppercase tracking-widest pl-1">KOHINOOR CLUB</span>
                   <input type="checkbox" :checked="isCategorySelected('kohinoorGroups')" @change="toggleCategory('kohinoorGroups', $event)" class="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer" />
                </div>
                 <div class="grid grid-cols-2 gap-2">
                   <div 
                     v-for="item in groupedSidebar.kohinoorGroups" 
                     :key="item.groupName"
                     class="flex items-center gap-3 px-3 py-2 rounded-xl transition-all cursor-pointer bg-white border border-transparent hover:border-emerald-200 shadow-sm hover:shadow-md select-none"
                     :class="{ '!bg-emerald-50 !border-emerald-200 ring-1 ring-emerald-200': selectedBrands.includes(item.groupName) }"
                     @click="toggleBrand(item.groupName)"
                   >
                      <input type="checkbox" :checked="selectedBrands.includes(item.groupName)" class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 pointer-events-none" />
                      <span class="text-sm font-semibold text-slate-700 leading-tight" :class="{ 'text-emerald-800': selectedBrands.includes(item.groupName) }">{{ formatProductName(item.groupName) }}</span>
                   </div>
                </div>
            </div>

            <!-- Naresh Club -->
            <div v-if="groupedSidebar.nareshGroups.length > 0">
                <div class="flex items-center justify-between px-2 mb-3">
                   <span class="text-xs font-black text-emerald-600 uppercase tracking-widest pl-1">NARESH CLUB</span>
                   <input type="checkbox" :checked="isCategorySelected('nareshGroups')" @change="toggleCategory('nareshGroups', $event)" class="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer" />
                </div>
                 <div class="grid grid-cols-2 gap-2">
                   <div 
                     v-for="item in groupedSidebar.nareshGroups" 
                     :key="item.groupName"
                     class="flex items-center gap-3 px-3 py-2 rounded-xl transition-all cursor-pointer bg-white border border-transparent hover:border-emerald-200 shadow-sm hover:shadow-md select-none"
                     :class="{ '!bg-emerald-50 !border-emerald-200 ring-1 ring-emerald-200': selectedBrands.includes(item.groupName) }"
                     @click="toggleBrand(item.groupName)"
                   >
                      <input type="checkbox" :checked="selectedBrands.includes(item.groupName)" class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 pointer-events-none" />
                      <span class="text-sm font-semibold text-slate-700 leading-tight" :class="{ 'text-emerald-800': selectedBrands.includes(item.groupName) }">{{ formatProductName(item.groupName) }}</span>
                   </div>
                </div>
            </div>

         </div>

         <!-- Others -->
         <div v-if="groupedSidebar.others.length > 0" class="p-2 transition-all rounded-2xl bg-slate-50 border border-transparent hover:border-slate-200">
            <div class="flex items-center justify-between px-2 mb-3">
               <span class="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Others</span>
               <input type="checkbox" :checked="isCategorySelected('others')" @change="toggleCategory('others', $event)" class="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer" />
            </div>
            <div class="grid grid-cols-2 gap-2">
               <div 
                 v-for="item in groupedSidebar.others" 
                 :key="item.groupName"
                 class="flex items-center gap-3 px-3 py-2 rounded-xl transition-all cursor-pointer bg-white border border-transparent hover:border-slate-300 shadow-sm hover:shadow-md select-none"
                 :class="{ '!bg-slate-100 !border-slate-300 ring-1 ring-slate-300': selectedBrands.includes(item.groupName) }"
                 @click="toggleBrand(item.groupName)"
               >
                  <input type="checkbox" :checked="selectedBrands.includes(item.groupName)" class="w-4 h-4 rounded text-slate-600 focus:ring-slate-500 border-gray-300 pointer-events-none" />
                  <span class="text-sm font-semibold text-slate-700 leading-tight" :class="{ 'text-slate-900': selectedBrands.includes(item.groupName) }">{{ formatProductName(item.groupName) }}</span>
               </div>
            </div>
         </div>

      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-50/50">
       <div class="flex h-full"> 
          <!-- Settings & Actions Area -->
          <div class="flex-1 overflow-y-auto p-10">
              <header class="mb-8">
                  <h1 class="text-3xl font-black text-slate-800 tracking-tight">Generate Catalog</h1>
                  <p class="text-slate-500 font-medium">Configure your export settings</p>
              </header>

              <div v-if="serverStatus !== 'ready'" class="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-700">
                  <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Waking up server... ({{ countdown }}s)</span>
              </div>

              <div class="space-y-6 max-w-2xl">
                 <!-- Filters Card -->
                 <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                       <i class="fa-solid fa-filter text-blue-500"></i> Filters
                    </h3>
                    <div class="space-y-4">
                       <label class="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
                          <input type="checkbox" v-model="onlyWithPhotos" class="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
                          <span class="font-medium text-slate-700">Only include products with photos</span>
                       </label>

                       <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <div class="flex items-center justify-between mb-2">
                             <label class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" v-model="minQtyEnabled" class="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
                                <span class="font-medium text-slate-700">Minimum Quantity Filter</span>
                             </label>
                             <div class="flex items-center gap-2" :class="{ 'opacity-50 pointer-events-none': !minQtyEnabled }">
                                <input type="number" v-model.number="minQty" class="w-16 text-center font-bold bg-white border border-slate-300 rounded-lg py-1 focus:ring-2 focus:ring-blue-500 outline-none" />
                                <span class="text-sm font-semibold text-slate-400">pairs</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <!-- PDF Mode Card -->
                 <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                       <i class="fa-solid fa-file-pdf text-red-500"></i> PDF Mode
                    </h3>
                    <div class="grid grid-cols-2 gap-4">
                       <label class="cursor-pointer relative">
                          <input type="radio" v-model="pdfMode" value="separate" class="peer sr-only">
                          <div class="p-4 rounded-xl border-2 border-slate-200 hover:border-blue-400 peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all text-center">
                             <span class="block font-bold text-slate-700 peer-checked:text-blue-700 mb-1">Separate Files</span>
                             <span class="text-xs text-slate-500">One PDF per brand</span>
                          </div>
                       </label>
                       <label class="cursor-pointer relative">
                          <input type="radio" v-model="pdfMode" value="combined" class="peer sr-only">
                          <div class="p-4 rounded-xl border-2 border-slate-200 hover:border-blue-400 peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all text-center">
                             <span class="block font-bold text-slate-700 peer-checked:text-blue-700 mb-1">Combined Catalog</span>
                             <span class="text-xs text-slate-500">All brands in one PDF</span>
                          </div>
                       </label>
                    </div>
                 </div>

                 <!-- Action Area -->
                 <div class="grid grid-cols-1 gap-3 pt-4">
                    <button 
                      @click="generatePdf" 
                      :disabled="selectedBrands.length === 0 || isGenerating"
                      class="w-full py-4 bg-slate-900 hover:bg-black disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg"
                    >
                       <span v-if="isGenerating && isPdfGenerating" class="flex items-center gap-2">
                          <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          {{ pdfMode === 'combined' ? 'Merging PDF...' : `Generating PDF (${completedCount}/${selectedBrands.length})` }}
                       </span>
                       <span v-else>Download PDF Catalog</span>
                    </button>

                    <div class="grid grid-cols-2 gap-3">
                       <button 
                         @click="downloadAsImages"
                         :disabled="selectedBrands.length === 0 || isGenerating"
                         class="py-3 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                       >
                         <span v-if="isGenerating && !isPdfGenerating && !isZipGenerating" class="flex items-center gap-2">
                            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Creating Images ({{ completedCount }}/{{selectedBrands.length}})
                         </span>
                         <span v-else>Download Images</span>
                       </button>

                       <button 
                         @click="downloadAsZip"
                         :disabled="selectedBrands.length === 0 || isGenerating"
                         class="py-3 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                       >
                         <span v-if="isGenerating && isZipGenerating" class="flex items-center gap-2">
                            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Zipping ({{ completedCount }}/{{selectedBrands.length}})
                         </span>
                         <span v-else>Download Images (ZIP)</span>
                       </button>
                    </div>

                    <!-- Progress Bar -->
                    <div v-if="isGenerating" class="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
                        <div class="flex justify-between text-xs font-bold text-blue-800 uppercase tracking-widest">
                           <span>Processing: {{ currentBrand }}</span>
                           <span>{{ Math.round((completedCount / selectedBrands.length) * 100) }}%</span>
                        </div>
                        <div class="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                           <div class="h-full bg-blue-500 rounded-full transition-all duration-300" :style="{ width: `${(completedCount / selectedBrands.length) * 100}%` }"></div>
                        </div>
                        <div class="text-[10px] text-blue-600/70 text-center font-medium">Please wait, larger brands may take a minute...</div>
                    </div>
                 </div>

              </div>
          </div>

          <!-- Summary Sidebar (Right) -->
          <div class="w-80 border-l border-slate-200 bg-white p-6 overflow-y-auto hidden xl:block">
              <div class="mb-6">
                 <h2 class="text-lg font-black text-slate-800 uppercase tracking-widest mb-1">Summary</h2>
                 <p class="text-sm text-slate-500 font-medium">{{ selectedBrands.length }} brands selected</p>
              </div>

              <div v-if="selectedBrands.length === 0" class="text-center py-10 opacity-50">
                 <div class="text-4xl mb-2">📋</div>
                 <p class="text-sm font-medium">No brands selected</p>
              </div>

              <div v-else class="space-y-2">
                 <div 
                   v-for="brand in selectedBrands" 
                   :key="brand"
                   class="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 group"
                 >
                    <span class="text-xs font-bold text-slate-700 truncate pr-2">{{ formatProductName(brand) }}</span>
                    <button @click="toggleBrand(brand)" class="text-slate-400 hover:text-red-500 transition-colors">
                       <i class="fa-solid fa-xmark"></i>
                    </button>
                 </div>
              </div>
          </div>
       </div>
    </main>
    
    <!-- Toast -->
    <div v-if="showToast" class="fixed bottom-6 right-6 z-[60] animate-bounce-in">
       <div class="bg-slate-800 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3">
          <i class="fa-solid fa-circle-check text-green-400"></i>
          <span class="font-medium">{{ toastMessage }}</span>
       </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default {
  data() {
    return {
      brands: [],
      selectedBrands: [],
      onlyWithPhotos: true,
      minQtyEnabled: false,
      minQty: 5,
      pdfMode: "separate",
      serverStatus: "waking",
      countdown: 90,
      isGenerating: false,
      isPdfGenerating: false,
      isZipGenerating: false,
      currentBrand: "",
      completedCount: 0,
      pollInterval: null,
      showToast: false,
      toastMessage: "",

      // Brand Lists Configuration
      bansalList: [
        'SRG Enterprises', 'NAV DURGA ENTERPRISES', 'AAGAM POLYMERE', 
        'R K TRADERS', 'A G ENTERPRISES', 'NEXUS', 'YASH FOOTWEAR',
        'AAGAM POLYMER', 'Vardhman Plastics'
      ],
      airsonList: ['AIRSON', 'AMBIKA FOOTWEAR', 'GOKUL FOOTWEAR', 'NEXGEN FOOTWEAR'],
      kohinoorList: ['KOHINOOR', 'UAM FOOTWEAR'],
      nareshList: ['KRishna Agency', 'SHYAM'],
      socksList: ['BArun', 'PAreek Soucks', 'LEo'],
      paragonList: [
        'Paragon Gents', 'Paragon Ladies', 'Eeken', 'Meriva', 'Paragon',  
        'Paragon Blot', 'Max', 'Paralite', 'P-TOES', 'Hawai Chappal', 
        'Stimulus', 'Escoute', 'Safety', 'Walkaholic', 'School'
      ],
      topBrandsConfig: [
        { name: 'Cubix', logo: 'https://res.cloudinary.com/dg365ewal/image/upload/v1749667073/cubixLogo_bwawj3.jpg' },
        { name: 'CUBIX 2', logo: 'https://res.cloudinary.com/dg365ewal/image/upload/v1749667073/cubixLogo_bwawj3.jpg' },
        { name: 'Florex (Swastik)', logo: 'https://res.cloudinary.com/dg365ewal/image/upload/v1749667072/florexLogo_wn50tj.jpg' },
        { name: 'RELIANCE FOOTWEAR', logo: 'https://res.cloudinary.com/dg365ewal/image/upload/v1749667072/relianceLogo_bvgwwz.png' },
        { name: 'Action', logo: 'https://res.cloudinary.com/dg365ewal/image/upload/v1768150265/action-logo_dzd5mq.png' }
      ],
      midBrandsConfig: [
         'AIRFAX', 'TEUZ', 'Paris', 'Hitway', 'PANKAJ PLASTIC', 'VAISHNO PLASTIC', 'TARA', 'ADDA', 'ASHU', 'ADDOXY'
      ],
      generalList: ['Maruti Plastics', 'Magnet', 'J.K Plastic', 
        'R R POLYPLAST', 'AGRA'
      ],
    };
  },

  computed: {
    groupedSidebar() {
       const normalize = (name) => name ? name.toLowerCase().trim() : '';

       // Helper sets
       const paragonSet = new Set(this.paragonList.map(n => normalize(n)));
       const topBrandNames = this.topBrandsConfig.map(c => normalize(c.name));
       const topBrandSet = new Set(topBrandNames);
       const midBrandSet = new Set(this.midBrandsConfig.map(n => normalize(n)));
       const socksSet = new Set(this.socksList.map(n => normalize(n)));
       const generalSet = new Set(this.generalList.map(n => normalize(n)));

       // Club sets
       const bansalSet = new Set(this.bansalList.map(n => normalize(n)));
       const airsonSet = new Set(this.airsonList.map(n => normalize(n)));
       const kohinoorSet = new Set(this.kohinoorList.map(n => normalize(n)));
       const nareshSet = new Set(this.nareshList.map(n => normalize(n)));

       const paragon = [];
       const topBrands = [];
       const midBrands = [];
       const socksGroups = [];
       const general = [];
       const bansalGroups = [];
       const airsonGroups = [];
       const kohinoorGroups = [];
       const nareshGroups = [];
       const others = [];
       
       const brands = this.brands.map(b => ({ groupName: b }));

       brands.forEach(group => {
           const nName = normalize(group.groupName);
           
           if (paragonSet.has(nName)) {
               paragon.push(group);
           } else if (topBrandSet.has(nName)) {
               const config = this.topBrandsConfig.find(c => normalize(c.name) === nName);
               topBrands.push({ group, logo: config ? config.logo : null }); 
           } else if (midBrandSet.has(nName)) {
               midBrands.push(group);
           } else if (socksSet.has(nName)) {
               socksGroups.push(group);
           } else if (generalSet.has(nName)) {
               general.push(group);
           } else if (bansalSet.has(nName)) {
               bansalGroups.push(group);
           } else if (airsonSet.has(nName)) {
               airsonGroups.push(group);
           } else if (kohinoorSet.has(nName)) {
               kohinoorGroups.push(group);
           } else if (nareshSet.has(nName)) {
               nareshGroups.push(group);
           } else {
               others.push(group);
           }
       });

       return { paragon, topBrands, midBrands, socksGroups, general, bansalGroups, airsonGroups, kohinoorGroups, nareshGroups, others };
    },
  },

  async mounted() {
    this.loadBrands();
    this.warmUpServer();
  },

  methods: {
    formatProductName(name) {
      if (!name) return '';
      return name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    },
    getBrandLogo(brandName) {
        const logos = {
            "Paragon": "https://res.cloudinary.com/dg365ewal/image/upload/v1749667072/paragonLogo_rqk3hu.webp",
            "Reliance": "https://res.cloudinary.com/dg365ewal/image/upload/v1749667072/relianceLogo_bvgwwz.png",
            "Cubix": "https://res.cloudinary.com/dg365ewal/image/upload/v1749667073/cubixLogo_bwawj3.jpg",
            "Florex": "https://res.cloudinary.com/dg365ewal/image/upload/v1749667072/florexLogo_wn50tj.jpg",
            "Eeken": "https://res.cloudinary.com/dg365ewal/image/upload/v1749668232/eekenLogo_rg5xwa.webp",
            "Escoute": "https://res.cloudinary.com/dg365ewal/image/upload/v1749667072/escouteLogo_maieji.jpg"
        };
        // Fuzzy match logic
        const lowerName = brandName.toLowerCase();
        const key = Object.keys(logos).find(k => lowerName.includes(k.toLowerCase()));
        return key ? logos[key] : null;
    },
    toggleBrand(brandName) {
        if (this.selectedBrands.includes(brandName)) {
            this.selectedBrands = this.selectedBrands.filter(b => b !== brandName);
        } else {
            this.selectedBrands.push(brandName);
        }
    },
    isCategorySelected(category) {
        const group = this.groupedSidebar[category];
        if (!group || group.length === 0) return false;
        
        // For topBrands, item has { group: { groupName: ... } }, for others item is { groupName: ... }
        // Actually looking at update, topBrands now has structure: { group: { groupName: ... }, logo: ... }
        // BUT wait, my computed property for topBrands pushes: { group, logo: ... }
        // So item.group.groupName is correct.
        // For others, we pushed `group` which is { groupName: ... }.
        // So we need to handle that distinction.
        
        return group.every(item => {
             const name = category === 'topBrands' ? item.group.groupName : item.groupName;
             return this.selectedBrands.includes(name);
        });
    },
    toggleCategory(category, event) {
        const isChecked = event.target.checked;
        const group = this.groupedSidebar[category];
        
        if (!group) return;

        group.forEach(item => {
            const name = category === 'topBrands' ? item.group.groupName : item.groupName;
            if (isChecked) {
                if (!this.selectedBrands.includes(name)) this.selectedBrands.push(name);
            } else {
                this.selectedBrands = this.selectedBrands.filter(b => b !== name);
            }
        });
    },
    scrollToGenerate() {
      this.$nextTick(() => {
        this.$refs.generateSection?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    },

    async loadBrands() {
      try {
        const res = await axios.get("https://raw.githubusercontent.com/sahilsync07/sbe/main/frontend/public/assets/stock-data.json");
        this.brands = [...new Set(res.data.map(g => g.groupName))].sort();
      } catch (err) {
        this.showToast = true;
        this.toastMessage = "Failed to load brands — check internet";
        setTimeout(() => this.showToast = false, 3000);
      }
    },

    warmUpServer() {
      this.serverStatus = "waking";
      this.startCountdown();
      axios.get("https://gen-pdf-0hb9.onrender.com/", { timeout: 5000 }).catch(() => {});

      const check = async () => {
        try {
          await axios.head("https://gen-pdf-0hb9.onrender.com/", { timeout: 10000 });
          this.serverStatus = "ready";
          clearInterval(this.pollInterval);
        } catch {
          if (this.countdown <= 0) this.serverStatus = "failed";
        }
      };
      check();
      this.pollInterval = setInterval(check, 5000);
    },

    startCountdown() {
      const t = setInterval(() => {
        if (this.countdown > 0) this.countdown--;
        else clearInterval(t);
      }, 1000);
    },

    selectAll() { 
      this.selectedBrands = [...this.brands]; 
      this.scrollToGenerate();
    },
    selectTopBrands() { 
      this.selectedBrands = [...new Set([...this.selectedBrands, ...this.topBrandsList.filter(b => this.brands.includes(b))])]; 
      this.scrollToGenerate();
    },
    selectParagonBrands() { 
      this.selectedBrands = [...new Set([...this.selectedBrands, ...this.paragonBrandsList.filter(b => this.brands.includes(b))])]; 
      this.scrollToGenerate();
    },
    selectGeneralBrands() { 
      this.selectedBrands = [...new Set([...this.selectedBrands, ...this.generalBrandsList.filter(b => this.brands.includes(b))])]; 
      this.scrollToGenerate();
    },

    async fetchPdfWithRetry(payload, retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                return await axios.post("https://gen-pdf-0hb9.onrender.com/generate-pdf", payload, { 
                    responseType: "blob", 
                    timeout: 300000 // 5 minutes 
                });
            } catch (error) {
                console.warn(`Attempt ${i + 1} failed for ${payload.brands[0]}:`, error);
                if (i === retries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1))); // Exponentialish backoff
            }
        }
    },

    async generatePdf() {
      if (!this.selectedBrands.length) {
        this.showToast = true;
        this.toastMessage = "Select at least one brand first";
        setTimeout(() => this.showToast = false, 3000);
        return;
      }

      this.isGenerating = true;
      this.isPdfGenerating = true;
      this.completedCount = 0;

      if (this.pdfMode === "combined") {
        // COMBINED PDF
        this.currentBrand = "Merging All Brands...";
        const payload = { 
          brands: this.selectedBrands, 
          onlyWithPhotos: this.onlyWithPhotos, 
          minQty: this.minQtyEnabled ? this.minQty : -1 
        };

        try {
          const res = await this.fetchPdfWithRetry(payload);

          const today = new Date().toISOString().split("T")[0];
          const filename = `CATALOG_COMBINED_${today}.pdf`;

          const url = window.URL.createObjectURL(res.data);
          const a = document.createElement("a");
          a.href = url; a.download = filename; a.click();
          window.URL.revokeObjectURL(url);

          this.completedCount = this.selectedBrands.length;
          this.showToast = true;
          this.toastMessage = "Combined PDF downloaded!";
          setTimeout(() => this.showToast = false, 4000);
        } catch (err) {
          console.error(err);
          this.showToast = true;
          this.toastMessage = "Failed to generate combined PDF (Timeout)";
          setTimeout(() => this.showToast = false, 5000);
        } finally {
          this.isGenerating = false;
          this.isPdfGenerating = false;
          this.currentBrand = "";
        }
      } else {
        // SEPARATE PDFs
        let successCount = 0;
        let failCount = 0;

        for (const brand of this.selectedBrands) {
          this.currentBrand = `Generating ${brand}...`;
          const payload = { brands: [brand], onlyWithPhotos: this.onlyWithPhotos, minQty: this.minQtyEnabled ? this.minQty : -1 };

          try {
             const res = await this.fetchPdfWithRetry(payload);
             
             const today = new Date().toISOString().split("T")[0];
             const safe = brand.replace(/[^a-zA-Z0-9]/g, "_");
             const filename = `${safe}_${today}.pdf`;

             const url = window.URL.createObjectURL(res.data);
             const a = document.createElement("a");
             a.href = url; a.download = filename; a.click();
             window.URL.revokeObjectURL(url);
             
             successCount++;
          } catch(e) {
             console.error(`Failed ${brand}`, e);
             failCount++;
          }
          this.completedCount++;
          await new Promise(r => setTimeout(r, 500));
        }

        this.showToast = true;
        this.toastMessage = `Done! ${successCount} Success, ${failCount} Failed`;
        setTimeout(() => this.showToast = false, 4000);
        
        this.isGenerating = false;
        this.isPdfGenerating = false;
        this.currentBrand = "";
      }
    },

    async downloadAsImages() {
      if (!this.selectedBrands.length) return;

      this.isGenerating = true;
      this.isPdfGenerating = false; 
      this.isZipGenerating = false; // Just to be safe
      this.completedCount = 0;
      let totalSuccess = 0;
      let totalFailed = 0;
      let totalImages = 0;

      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      for (const brand of this.selectedBrands) {
        this.currentBrand = `Processing: ${brand}`;
        const payload = { brands: [brand], onlyWithPhotos: this.onlyWithPhotos, minQty: this.minQtyEnabled ? this.minQty : -1 };

        try {
          const res = await this.fetchPdfWithRetry(payload);
          
          const pdfBlob = res.data;
          const pdfUrl = URL.createObjectURL(pdfBlob);

          const loadingTask = pdfjsLib.getDocument(pdfUrl);
          const pdf = await loadingTask.promise;

          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 2.5 });

            const canvas = document.createElement("canvas");
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const context = canvas.getContext("2d");

            await page.render({ canvasContext: context, viewport }).promise;

            const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png", 0.95));
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `${brand.replace(/[^a-zA-Z0-9]/g, "_")}_Image_${String(pageNum).padStart(3, "0")}.png`;
            a.click();
            URL.revokeObjectURL(url);

            totalImages++;
          }

          URL.revokeObjectURL(pdfUrl);
          totalSuccess++;
        } catch (err) {
          console.error("Failed for brand:", brand, err);
          totalFailed++;
        }
        this.completedCount++;
      }

      this.isGenerating = false;
      this.currentBrand = "";
      this.showToast = true;
      this.toastMessage = `Downloaded ${totalImages} images (${totalFailed} failed brands)`;
      setTimeout(() => this.showToast = false, 4000);
    },

    async downloadAsZip() {
      if (!this.selectedBrands.length) return;

      this.isGenerating = true;
      this.isZipGenerating = true;
      this.completedCount = 0;
      const zip = new JSZip();
      
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      let totalPages = 0;
      let failedBrands = 0;

      for (const brand of this.selectedBrands) {
          this.currentBrand = `Zipping: ${brand}`;
          const payload = { brands: [brand], onlyWithPhotos: this.onlyWithPhotos, minQty: this.minQtyEnabled ? this.minQty : -1 };

          try {
              const res = await this.fetchPdfWithRetry(payload);
              
              const pdfUrl = URL.createObjectURL(res.data);
              const loadingTask = pdfjsLib.getDocument(pdfUrl);
              const pdf = await loadingTask.promise;
              
              const brandFolder = zip.folder(brand);

              for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const viewport = page.getViewport({ scale: 2.0 }); 

                    const canvas = document.createElement("canvas");
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    const context = canvas.getContext("2d");
                    await page.render({ canvasContext: context, viewport }).promise;

                    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", 0.85));
                    brandFolder.file(`${brand}_Page_${pageNum}.jpg`, blob);
                    totalPages++;
              }
              URL.revokeObjectURL(pdfUrl);

          } catch (e) {
              console.error(`Failed to zip ${brand}`, e);
              failedBrands++;
              this.showToast = true;
              this.toastMessage = `Failed to process ${brand}`;
              setTimeout(() => this.showToast = false, 2000);
          }
          this.completedCount++;
      }

      this.currentBrand = "Finalizing ZIP file...";
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `Catalog_Images_${new Date().toISOString().split('T')[0]}.zip`);

      this.isGenerating = false;
      this.isZipGenerating = false;
      this.currentBrand = "";
      this.showToast = true;
      this.toastMessage = `ZIP Ready! ${totalPages} images included.`;
      setTimeout(() => this.showToast = false, 4000);
    },
  },

  beforeUnmount() {
    clearInterval(this.pollInterval);
  },
};
</script>

<style scoped>
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #94a3b8;
}

@keyframes bounceIn {
  0% { opacity: 0; transform: scale(0.3) translateY(20px); }
  50% { opacity: 0.9; transform: scale(1.05); }
  80% { opacity: 1; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-bounce-in {
  animation: bounceIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
</style>