<template>
  <div class="container mx-auto p-6 max-w-5xl min-h-screen">
    <!-- Smart Server Wake-Up Overlay (same as before) -->
    <div v-if="serverStatus !== 'ready'" class="fixed inset-0 bg-gradient-to-br from-purple-900 to-indigo-900 bg-opacity-95 flex items-center justify-center z-50 backdrop-blur-lg">
      <div class="bg-white rounded-3xl shadow-2xl p-10 max-w-md text-center">
        <div class="relative mx-auto w-24 h-24 mb-8">
          <div class="absolute inset-0 rounded-full border-8 border-gray-200"></div>
          <div class="absolute inset-0 rounded-full border-8 border-t-indigo-600 border-r-purple-600 animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-3xl font-bold text-indigo-600">{{ countdown }}s</span>
          </div>
        </div>
        <h2 class="text-3xl font-bold text-gray-800 mb-4">{{ statusMessage.title }}</h2>
        <p class="text-lg text-gray-600 leading-relaxed mb-6">{{ statusMessage.subtitle }}</p>
        <div class="text-sm text-gray-500">Free hosting wakes up slowly — but we’re handling it!</div>
      </div>
    </div>

    <!-- Main App -->
    <div v-if="serverStatus === 'ready'" class="space-y-10">
      <div class="text-center">
        <h1 class="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Sri Brundabana Enterprises
        </h1>
        <p class="text-2xl text-gray-600 mt-2">PDF Catalog Generator</p>
      </div>

      <!-- Beautiful Brand Checkboxes Grid -->
      <div class="bg-white rounded-3xl shadow-2xl p-10">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-gray-800">Select Brands</h2>
          <div class="text-lg text-gray-600">
            <span class="font-bold text-indigo-600">{{ selectedBrands.length }}</span> selected
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          <label
            v-for="brand in brands"
            :key="brand"
            class="relative flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg"
            :class="selectedBrands.includes(brand) 
              ? 'border-indigo-600 bg-indigo-50 shadow-md' 
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'"
          >
            <input
              type="checkbox"
              :value="brand"
              v-model="selectedBrands"
              class="absolute opacity-0 cursor-pointer h-0 w-0"
            />
            <div class="flex items-center w-full">
              <div class="w-8 h-8 rounded-lg border-2 flex items-center justify-center mr-4 transition-all"
                   :class="selectedBrands.includes(brand) ? 'border-indigo-600 bg-indigo-600' : 'border-gray-400'">
                <svg v-if="selectedBrands.includes(brand)" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span class="text-lg font-medium text-gray-800">{{ brand }}</span>
            </div>
          </label>
        </div>

        <!-- Select All / Clear All Buttons -->
        <div class="mt-10 flex justify-center gap-6">
          <button @click="selectedBrands = brands.slice()" 
                  class="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition">
            Select All
          </button>
          <button @click="selectedBrands = []" 
                  class="px-8 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition">
            Clear All
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-3xl shadow-2xl p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <label class="flex items-center space-x-5 text-xl cursor-pointer">
          <input type="checkbox" v-model="onlyWithPhotos" class="w-7 h-7 text-indigo-600 rounded-lg focus:ring-indigo-500" />
          <span>Only products with photos</span>
        </label>

        <div>
          <label class="flex items-center space-x-5 text-xl cursor-pointer">
            <input type="checkbox" v-model="minQtyEnabled" class="w-7 h-7 text-indigo-600 rounded-lg" />
            <span>Minimum quantity filter</span>
          </label>
          <div class="flex items-center gap-4 mt-5">
            <input type="number" v-model.number="minQty" :disabled="!minQtyEnabled" min="0"
              class="w-32 px-5 py-4 text-xl border-2 rounded-xl disabled:bg-gray-100 focus:border-indigo-500" />
            <span class="text-xl">or more</span>
          </div>
        </div>
      </div>

      <!-- Generate Button -->
      <button @click="generatePdf" :disabled="isGenerating || selectedBrands.length === 0"
        class="w-full max-w-2xl mx-auto block py-7 text-3xl font-bold text-white rounded-3xl shadow-2xl transition-all duration-300
               disabled:opacity-60 disabled:cursor-not-allowed
               bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800">
        <span v-if="!isGenerating">
          Generate PDF Catalog ({{ selectedBrands.length }} {{ selectedBrands.length === 1 ? 'brand' : 'brands' }})
        </span>
        <span v-else>Creating your PDF • Please wait...</span>
      </button>
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
      pollInterval: null,
    };
  },

  computed: {
    statusMessage() {
      if (this.serverStatus === "waking") {
        return { title: "Waking up server...", subtitle: "First request takes 30–90s. We’re speeding it up!" };
      }
      if (this.serverStatus === "checking") {
        return { title: "Almost ready!", subtitle: "Server is starting... just a moment" };
      }
      return { title: "Taking longer...", subtitle: "Please wait or refresh in 30s" };
    },
  },

  async mounted() {
    this.loadBrands();
    this.warmUpServer();
  },

  methods: {
    async loadBrands() {
      try {
        const res = await axios.get(
          "https://raw.githubusercontent.com/sahilsync07/sbe/main/frontend/public/assets/stock-data.json"
        );
        this.brands = [...new Set(res.data.map(g => g.groupName))].sort();
      } catch (err) {
        alert("Failed to load brands. Check internet.");
      }
    },

    async warmUpServer() {
      this.serverStatus = "waking";
      this.startCountdown();

      // Trigger wake-up
      axios.get("https://gen-pdf-0hb9.onrender.com/", { timeout: 5000 }).catch(() => {});

      const check = async () => {
        try {
          await axios.head("https://gen-pdf-0hb9.onrender.com/", { timeout: 10000 });
          this.serverStatus = "ready";
          clearInterval(this.pollInterval);
        } catch (err) {
          if (this.countdown <= 0) this.serverStatus = "failed";
          else this.serverStatus = "checking";
        }
      };

      check();
      this.pollInterval = setInterval(check, 5000);
    },

    startCountdown() {
      const timer = setInterval(() => {
        if (this.countdown > 0) this.countdown--;
        else clearInterval(timer);
      }, 1000);
    },

    async generatePdf() {
      if (this.selectedBrands.length === 0) return alert("Please select at least one brand!");

      this.isGenerating = true;
      const payload = {
        brands: this.selectedBrands,
        onlyWithPhotos: this.onlyWithPhotos,
        minQty: this.minQtyEnabled ? this.minQty : -1,
      };

      try {
        const response = await axios.post(
          "https://gen-pdf-0hb9.onrender.com/generate-pdf",
          payload,
          { responseType: "blob", timeout: 400000 }
        );

        const today = new Date().toISOString().split("T")[0];
        const name = this.selectedBrands.map(b => b.replace(/[^a-zA-Z0-9]/g, "_")).sort().join("-");
        const filename = `${name}_${today}.pdf`;

        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        alert("Failed. Server might still be warming up. Try again in 30 seconds.");
      } finally {
        this.isGenerating = false;
      }
    },
  },

  beforeUnmount() {
    clearInterval(this.pollInterval);
  },
};
</script>

<style scoped>
label:hover {
  transform: translateY(-2px);
}
</style>