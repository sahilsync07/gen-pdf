<template>
  <div class="container mx-auto p-6 max-w-2xl">
    <!-- Enhanced Loading Overlay -->
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
    >
      <div class="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-sm">
        <div class="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
        <h3 class="mt-6 text-2xl font-bold text-gray-800">Generating PDF...</h3>
        <p class="mt-4 text-gray-600 leading-relaxed">
          The server is waking up from sleep mode.<br />
          <span class="font-semibold text-blue-600">This may take 30–90 seconds</span><br />
          Please do not close or refresh the page.
        </p>
      </div>
    </div>

    <!-- Main UI -->
    <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">
      Sri Brundabana Enterprises<br /><span class="text-2xl font-normal text-gray-600">PDF Generator</span>
    </h1>

    <div class="bg-white p-8 rounded-2xl shadow-lg space-y-8">
      <!-- Brands Selector -->
      <div>
        <label class="block text-lg font-semibold text-gray-800 mb-3">Select Brands</label>
        <select
          multiple
          v-model="selectedBrands"
          class="w-full h-80 p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition"
        >
          <option v-for="brand in brands" :key="brand" :value="brand" class="py-2">
            {{ brand }}
          </option>
        </select>
        <p class="text-sm text-gray-500 mt-2">Hold Ctrl/Cmd to select multiple</p>
      </div>

      <!-- Filters -->
      <div class="flex items-center space-x-3">
        <input type="checkbox" v-model="onlyWithPhotos" class="h-6 w-6 text-blue-600 rounded" />
        <label class="text-lg">Only products with photos</label>
      </div>

      <div>
        <label class="flex items-center space-x-3">
          <input type="checkbox" v-model="minQtyEnabled" class="h-6 w-6 text-blue-600 rounded" />
          <span class="text-lg">Only articles with quantity more than</span>
        </label>
        <div class="flex items-center mt-3 space-x-3">
          <input
            type="number"
            v-model.number="minQty"
            :disabled="!minQtyEnabled"
            min="0"
            class="w-32 px-4 py-3 text-lg border-2 rounded-lg"
          />
          <span class="text-lg">pcs</span>
        </div>
      </div>

      <!-- Generate Button -->
      <button
        @click="generatePdf"
        :disabled="isLoading || selectedBrands.length === 0"
        class="w-full py-5 px-6 text-xl font-bold text-white rounded-xl transition transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        :class="isLoading ? 'bg-gray-500' : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800'"
      >
        {{ isLoading ? 'Please wait – Server is starting...' : 'Generate & Download PDF' }}
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
      const jsonUrl =
        "https://raw.githubusercontent.com/sahilsync07/sbe/main/frontend/public/assets/stock-data.json";
      const res = await axios.get(jsonUrl);
      this.brands = [...new Set(res.data.map((g) => g.groupName))].sort();
    } catch (err) {
      alert("Failed to load brands. Please refresh the page.");
      console.error(err);
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
          "https://sbe-pdf-generator.onrender.com/generate-pdf", // ← CHANGE THIS TO YOUR RENDER URL
          payload,
          {
            responseType: "blob",
            timeout: 300000, // 5 minutes – safe for cold start
          }
        );

        // Dynamic filename (same logic as backend)
        const today = new Date().toISOString().split("T")[0];
        const safeBrands = this.selectedBrands
          .map((b) => b.toString().replace(/[\/\\?%*:|"<>]/g, "_"))
          .sort()
          .join("-");
        const filename = safeBrands ? `${safeBrands}_${today}.pdf` : `Products_${today}.pdf`;

        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error(err);
        let message = "Failed to generate PDF.";

        if (err.code === "ECONNABORTED") {
          message = "Timeout: Server took too long to wake up.\nPlease wait 1 minute and try again.";
        } else if (!err.response && err.request) {
          message = "Server is starting up or offline.\nPlease wait 30–60 seconds and try again.";
        }

        alert("⚠️ " + message);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>