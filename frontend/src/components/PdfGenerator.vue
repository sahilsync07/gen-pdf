<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Smart Wake-Up Screen -->
    <div v-if="serverStatus !== 'ready'" class="fixed inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center z-50">
      <div class="bg-white rounded-3xl shadow-2xl p-12 max-w-md text-center">
        <div class="relative mx-auto w-28 h-28 mb-8">
          <div class="absolute inset-0 rounded-full border-8 border-gray-200"></div>
          <div class="absolute inset-0 rounded-full border-8 border-t-indigo-600 border-r-purple-600 animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center text-4xl font-bold text-indigo-600">
            {{ countdown }}s
          </div>
        </div>
        <h2 class="text-3xl font-bold text-gray-800 mb-4">{{ statusMessage.title }}</h2>
        <p class="text-lg text-gray-600">Server is starting... your PDFs are coming soon!</p>
      </div>
    </div>

    <!-- Main App -->
    <div v-if="serverStatus === 'ready'" class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Sri Brundabana Enterprises
        </h1>
        <p class="text-2xl text-gray-700 mt-3">PDF Catalog Generator</p>
        <p class="text-green-600 font-bold mt-2">One PDF per brand • Instant Download</p>
      </div>

      <!-- Quick Select Buttons -->
      <div class="bg-white rounded-3xl shadow-xl p-8 mb-8">
        <h3 class="text-2xl font-bold text-gray-800 mb-6">Quick Select</h3>
        <div class="flex flex-wrap gap-4 justify-center">
          <button @click="selectAll" 
                  class="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg">
            Select All ({{ brands.length }})
          </button>
          <button @click="selectTopBrands" :disabled="!hasTopBrands"
                  class="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition shadow-lg disabled:opacity-50">
            Top Brands ({{ topBrandsList.length }})
          </button>
          <button @click="selectParagonBrands" :disabled="!hasParagonBrands"
                  class="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold hover:from-emerald-700 hover:to-teal-700 transition shadow-lg disabled:opacity-50">
            Paragon Brands ({{ paragonBrandsList.length }})
          </button>
          <button @click="selectedBrands = []" 
                  class="px-8 py-4 bg-gray-600 text-white rounded-2xl font-bold hover:bg-gray-700 transition shadow-lg">
            Clear All
          </button>
        </div>
      </div>

      <!-- Brand Grid -->
      <div class="bg-white rounded-3xl shadow-2xl p-8">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold text-gray-800">All Brands</h2>
          <div class="text-xl font-semibold text-indigo-600">
            {{ selectedBrands.length }} selected → {{ selectedBrands.length }} PDFs
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          <label v-for="brand in brands" :key="brand"
                 class="group relative block p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                 :class="selectedBrands.includes(brand) 
                   ? 'border-indigo-600 bg-indigo-50 shadow-lg' 
                   : 'border-gray-300 bg-gray-50 hover:border-gray-400'">
            
            <input type="checkbox" :value="brand" v-model="selectedBrands" class="sr-only" />
            
            <div class="flex items-center justify-between">
              <span class="text-lg font-medium text-gray-800 pr-2 leading-tight">
                {{ brand }}
              </span>
              <div class="w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all"
                   :class="selectedBrands.includes(brand) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-400 group-hover:border-indigo-500'">
                <svg v-if="selectedBrands.includes(brand)" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </label>
        </div>
      </div>

      <!-- Filters -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
        <div class="bg-white rounded-3xl shadow-xl p-8">
          <label class="flex items-center space-x-5 text-xl cursor-pointer">
            <input type="checkbox" v-model="onlyWithPhotos" class="w-7 h-7 text-indigo-600 rounded-lg" />
            <span>Only products with photos</span>
          </label>
        </div>

        <div class="bg-white rounded-3xl shadow-xl p-8">
          <label class="flex items-center space-x-5 text-xl cursor-pointer mb-4">
            <input type="checkbox" v-model="minQtyEnabled" class="w-7 h-7 text-indigo-600 rounded-lg" />
            <span>Minimum quantity filter</span>
          </label>
          <div class="flex items-center gap-4">
            <input type="number" v-model.number="minQty" :disabled="!minQtyEnabled" min="0"
                   class="w-32 px-5 py-4 text-xl border-2 rounded-xl disabled:bg-gray-100 focus:border-indigo-500" />
            <span class="text-xl">or more</span>
          </div>
        </div>
      </div>

      <!-- Generate Button -->
      <div class="text-center">
        <button @click="generatePdf" :disabled="isGenerating || selectedBrands.length === 0"
                class="inline-block px-16 py-8 text-3xl font-bold text-white rounded-3xl shadow-2xl transition-all duration-300
                       disabled:opacity-60 disabled:cursor-not-allowed
                       bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800">
          <span v-if="!isGenerating">
            Download {{ selectedBrands.length }} Separate PDFs Now
          </span>
          <span v-else>
            Generating • {{ currentBrand }} ({{ completedCount }}/{{ selectedBrands.length }})
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      brands: [],
      selectedBrands: [],
      onlyWithPhotos: true,
      minQtyEnabled: false,
      minQty: 5,
      serverStatus: "waking",
      countdown: 90,
      isGenerating: false,
      currentBrand: "",
      completedCount: 0,
      pollInterval: null,

      // Hardcoded brand lists
      topBrandsList: [
        "CUBIX",
        "EEKEN",
        "Florex (Swastik)",
        "Max",
        "RELIANCE FOOTWEAR",
        "Solea & Meriva , Mascara",
        "VERTEX, SLICKERS & FENDER"
      ],
      paragonBrandsList: [
        "EEKEN",
        "Max",
        "Solea & Meriva , Mascara",
        "VERTEX, SLICKERS & FENDER"
      ],
    };
  },

  computed: {
    hasTopBrands() { return this.topBrandsList.some(b => this.brands.includes(b)); },
    hasParagonBrands() { return this.paragonBrandsList.some(b => this.brands.includes(b)); },
    statusMessage() {
      if (this.serverStatus === "waking") return { title: "Starting server..." };
      if (this.serverStatus === "checking") return { title: "Almost ready!" };
      return { title: "Please wait..." };
    },
  },

  async mounted() {
    this.loadBrands();
    this.warmUpServer();
  },

  methods: {
    async loadBrands() {
      try {
        const res = await axios.get("https://raw.githubusercontent.com/sahilsync07/sbe/main/frontend/public/assets/stock-data.json");
        this.brands = [...new Set(res.data.map(g => g.groupName))].sort();
      } catch (err) {
        alert("Failed to load brands.");
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
          else this.serverStatus = "checking";
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

    selectAll() { this.selectedBrands = [...this.brands]; },
    selectTopBrands() { 
      this.selectedBrands = [...new Set([...this.selectedBrands, ...this.topBrandsList.filter(b => this.brands.includes(b))])]; 
    },
    selectParagonBrands() { 
      this.selectedBrands = [...new Set([...this.selectedBrands, ...this.paragonBrandsList.filter(b => this.brands.includes(b))])]; 
    },

    async generatePdf() {
      if (this.selectedBrands.length === 0) return alert("Select at least one brand!");

      this.isGenerating = true;
      this.completedCount = 0;

      const promises = this.selectedBrands.map(async (brand) => {
        this.currentBrand = brand;
        const payload = { brands: [brand], onlyWithPhotos: this.onlyWithPhotos, minQty: this.minQtyEnabled ? this.minQty : -1 };

        const res = await axios.post("https://gen-pdf-0hb9.onrender.com/generate-pdf", payload, { responseType: "blob", timeout: 180000 });
        
        const today = new Date().toISOString().split("T")[0];
        const safe = brand.replace(/[^a-zA-Z0-9]/g, "_");
        const filename = `${safe}_${today}.pdf`;

        const url = window.URL.createObjectURL(res.data);
        const a = document.createElement("a");
        a.href = url; a.download = filename; a.click();
        URL.revokeObjectURL(url);

        this.completedCount++;
        await new Promise(r => setTimeout(r, 600));
      });

      try {
        await Promise.all(promises);
        alert(`All ${this.selectedBrands.length} PDFs downloaded successfully!`);
      } catch {
        alert("Some failed. Try again in 30s.");
      } finally {
        this.isGenerating = false;
        this.currentBrand = "";
      }
    },
  },

  beforeUnmount() {
    clearInterval(this.pollInterval);
  },
};
</script>

<style scoped>
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }
</style>