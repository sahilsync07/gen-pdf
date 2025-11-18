<template>
  <div class="container mx-auto p-6 max-w-2xl min-h-screen">
    <!-- Smart Loading Overlay with Real Status -->
    <div v-if="serverStatus !== 'ready'" class="fixed inset-0 bg-gradient-to-br from-purple-900 to-indigo-900 bg-opacity-95 flex items-center justify-center z-50 backdrop-blur-lg">
      <div class="bg-white rounded-3xl shadow-2xl p-10 max-w-md text-center transform transition-all">
        <!-- Animated Spinner -->
        <div class="relative mx-auto w-24 h-24 mb-8">
          <div class="absolute inset-0 rounded-full border-8 border-gray-200"></div>
          <div class="absolute inset-0 rounded-full border-8 border-t-indigo-600 border-r-purple-600 animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-3xl font-bold text-indigo-600">{{ countdown }}s</span>
          </div>
        </div>

        <!-- Dynamic Messages -->
        <h2 class="text-3xl font-bold text-gray-800 mb-4">
          {{ statusMessage.title }}
        </h2>
        <p class="text-lg text-gray-600 leading-relaxed mb-6">
          {{ statusMessage.subtitle }}
        </p>
        <div class="text-sm text-gray-500">
          Free hosting wakes up slowly — but we’ve got this!
        </div>
      </div>
    </div>

    <!-- Main App (only shows when server is ready) -->
    <div v-if="serverStatus === 'ready'">
      <h1 class="text-5xl font-extrabold text-center mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Sri Brundabana Enterprises
      </h1>
      <p class="text-center text-xl text-gray-600 mb-10">PDF Catalog Generator</p>

      <div class="bg-white rounded-3xl shadow-2xl p-10 space-y-10">
        <div>
          <label class="block text-xl font-semibold mb-4 text-gray-800">
            Select Brands <span class="text-sm font-normal text-gray-500">(Hold Ctrl/Cmd for multiple)</span>
          </label>
          <select multiple v-model="selectedBrands" class="w-full h-96 p-5 border-2 border-gray-300 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-lg">
            <option v-for="brand in brands" :key="brand" :value="brand" class="py-3">{{ brand }}</option>
          </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <label class="flex items-center space-x-4 text-lg cursor-pointer">
            <input type="checkbox" v-model="onlyWithPhotos" class="w-6 h-6 text-indigo-600 rounded-lg focus:ring-indigo-500" />
            <span>Only products with photos</span>
          </label>

          <div>
            <label class="flex items-center space-x-4 text-lg cursor-pointer">
              <input type="checkbox" v-model="minQtyEnabled" class="w-6 h-6 text-indigo-600 rounded-lg" />
              <span>Min quantity filter</span>
            </label>
            <div class="flex items-center gap-3 mt-4">
              <input type="number" v-model.number="minQty" :disabled="!minQtyEnabled" min="0"
                class="w-32 px-5 py-3 text-lg border-2 rounded-xl disabled:bg-gray-100 focus:border-indigo-500" />
              <span class="text-lg">or more</span>
            </div>
          </div>
        </div>

        <button @click="generatePdf" :disabled="isGenerating || selectedBrands.length === 0"
          class="w-full py-6 text-2xl font-bold text-white rounded-2xl shadow-xl transition-all duration-300
                 disabled:opacity-60 disabled:cursor-not-allowed
                 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800">
          <span v-if="!isGenerating">Generate PDF Catalog ({{ selectedBrands.length }} brands)</span>
          <span v-else>Creating your PDF • Please wait...</span>
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
      serverStatus: "waking", // waking | checking | ready | failed
      countdown: 90,
      isGenerating: false,
    };
  },

  computed: {
    statusMessage() {
      switch (this.serverStatus) {
        case "waking":
          return {
            title: "Waking up the server...",
            subtitle: "Free hosting takes 30–90 seconds to start. We’re speeding it up for you!",
          };
        case "checking":
          return {
            title: "Almost there!",
            subtitle: "Server is starting... just a few more seconds",
          };
        case "failed":
          return {
            title: "Taking longer than usual...",
            subtitle: "Please wait or refresh in 30 seconds. This is normal on free hosting.",
          };
        default:
          return { title: "", subtitle: "" };
      }
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
        alert("Failed to load brands. Check internet connection.");
      }
    },

    async warmUpServer() {
      this.serverStatus = "waking";
      this.startCountdown();

      // Step 1: Trigger server wake-up immediately
      axios.get("https://gen-pdf-0hb9.onrender.com/", { timeout: 5000 }).catch(() => {});

      // Step 2: Poll every 5 seconds until ready
      const check = async () => {
        try {
          await axios.head("https://gen-pdf-0hb9.onrender.com/", { timeout: 10000 });
          this.serverStatus = "ready";
          clearInterval(this.pollInterval);
        } catch (err) {
          if (this.countdown <= 0) {
            this.serverStatus = "failed";
          } else {
            this.serverStatus = "checking";
          }
        }
      };

      check(); // First check
      this.pollInterval = setInterval(check, 5000);
    },

    startCountdown() {
      const timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(timer);
        }
      }, 1000);
    },

    async generatePdf() {
      if (this.selectedBrands.length === 0) {
        alert("Please select at least one brand!");
        return;
      }

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
          {
            responseType: "blob",
            timeout: 400000, // 6.5 minutes max
          }
        );

        const today = new Date().toISOString().split("T")[0];
        const name = this.selectedBrands
          .map(b => b.replace(/[^a-zA-Z0-9]/g, "_"))
          .sort()
          .join("-");
        const filename = `${name}_${today}.pdf`;

        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);

      } catch (err) {
        alert("PDF generation failed. Server might still be warming up. Please try again in 30 seconds.");
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
select option:checked {
  background: #6366f1;
  color: white;
}
</style>