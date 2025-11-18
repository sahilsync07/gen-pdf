<template>
  <div class="container mx-auto p-6 max-w-2xl">
    <!-- Beautiful Loading Overlay for Render Sleep -->
    <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur">
      <div class="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md">
        <div class="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-600 mx-auto mb-6"></div>
        <h3 class="text-2xl font-bold text-gray-800 mb-3">Generating Your PDF...</h3>
        <p class="text-gray-600 leading-relaxed">
          The server is waking up from sleep mode<br>
          <span class="text-indigo-600 font-bold">First request may take 30–90 seconds</span><br>
          Please wait • Do not refresh or close
        </p>
      </div>
    </div>

    <h1 class="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      Sri Brundabana Enterprises<br>
      <span class="text-2xl text-gray-600">PDF Catalog Generator</span>
    </h1>

    <div class="bg-white rounded-3xl shadow-xl p-8 space-y-8">
      <!-- Brand Selector -->
      <div>
        <label class="block text-lg font-semibold mb-4">Select Brands (Ctrl/Cmd to select multiple)</label>
        <select multiple v-model="selectedBrands" class="w-full h-96 p-4 border-2 rounded-xl focus:border-indigo-500 focus:ring focus:ring-indigo-200">
          <option v-for="brand in brands" :key="brand" :value="brand" class="py-3">{{ brand }}</option>
        </select>
      </div>

      <!-- Filters -->
      <div class="space-y-6">
        <label class="flex items-center space-x-4 text-lg">
          <input type="checkbox" v-model="onlyWithPhotos" class="w-6 h-6 text-indigo-600 rounded" />
          <span>Only products with photos</span>
        </label>

        <div>
          <label class="flex items-center space-x-4 text-lg">
            <input type="checkbox" v-model="minQtyEnabled" class="w-6 h-6 text-indigo-600 rounded" />
            <span>Only show items with quantity more than</span>
          </label>
          <div class="flex items-center gap-3 mt-3">
            <input type="number" v-model.number="minQty" :disabled="!minQtyEnabled" min="0"
              class="w-32 px-4 py-3 text-lg border-2 rounded-lg disabled:bg-gray-100" />
            <span class="text-lg">pcs</span>
          </div>
        </div>
      </div>

      <!-- Generate Button -->
      <button @click="generatePdf" :disabled="isLoading || selectedBrands.length === 0"
        class="w-full py-6 text-xl font-bold text-white rounded-2xl transition-all duration-300 shadow-lg
               disabled:opacity-60 disabled:cursor-not-allowed
               bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
        {{ isLoading ? 'Server Starting • Please Wait...' : 'Generate & Download PDF' }}
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
      isLoading: false,
    };
  },
  async mounted() {
    try {
      const res = await axios.get(
        "https://raw.githubusercontent.com/sahilsync07/sbe/main/frontend/public/assets/stock-data.json"
      );
      this.brands = [...new Set(res.data.map(g => g.groupName))].sort();
    } catch (err) {
      alert("Failed to load brands. Please check internet and refresh.");
    }
  },
  methods: {
    async generatePdf() {
      if (this.selectedBrands.length === 0) {
        alert("Please select at least one brand!");
        return;
      }

      this.isLoading = true;

      const payload = {
        brands: this.selectedBrands,
        onlyWithPhotos: this.onlyWithPhotos,
        minQty: this.minQtyEnabled ? this.minQty : -1,
      };

      try {
        const response = await axios.post(
          "https://gen-pdf-0hb9.onrender.com/generate-pdf",  // YOUR LIVE RENDER URL
          payload,
          {
            responseType: "blob",
            timeout: 300000, // 5 minutes max wait
          }
        );

        // Generate perfect filename: Nike-Adidas-Reebok_2025-11-18.pdf
        const today = new Date().toISOString().split("T")[0];
        const safeName = this.selectedBrands
          .map(b => b.toString().replace(/[^a-zA-Z0-9]/g, "_"))
          .sort()
          .join("-");
        const filename = `${safeName}_${today}.pdf`;

        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

      } catch (err) {
        let msg = "PDF generation failed.";
        if (err.code === "ECONNABORTED") {
          msg = "Server took too long to wake up.\nPlease wait 1 minute and try again.";
        } else if (!err.response && err.request) {
          msg = "Server is starting up...\nFirst request after sleep takes 30–90 seconds.\nPlease try again.";
        }
        alert("Warning: " + msg);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
select option:checked {
  background: #4f46e5;
  color: white;
}
</style>