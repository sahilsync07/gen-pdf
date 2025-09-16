<template>
  <div class="container mx-auto p-6 max-w-2xl">
    <!-- Loading Overlay -->
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <div
          class="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"
        ></div>
        <p class="mt-4 text-lg font-semibold text-gray-700">
          Generating PDF...
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">
      Sri Brundabana Enterprises - PDF Generator
    </h1>

    <div class="bg-white p-6 rounded-xl shadow-md mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2"
        >Select Brands</label
      >
      <select
        multiple
        v-model="selectedBrands"
        class="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option
          v-for="brand in brands"
          :key="brand"
          :value="brand"
          class="py-2"
        >
          {{ brand }}
        </option>
      </select>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-md mb-6">
      <label class="flex items-center space-x-2">
        <input
          type="checkbox"
          v-model="onlyWithPhotos"
          class="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
        />
        <span class="text-sm font-medium text-gray-700"
          >Only include products with photos</span
        >
      </label>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-md mb-6">
      <label class="flex items-center space-x-2">
        <input
          type="checkbox"
          v-model="minQtyEnabled"
          class="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
        />
        <span class="text-sm font-medium text-gray-700"
          >Only include articles with more than</span
        >
      </label>
      <div class="flex items-center mt-2 space-x-2">
        <input
          type="number"
          v-model="minQty"
          :disabled="!minQtyEnabled"
          class="w-24 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          min="0"
        />
        <span class="text-sm font-medium text-gray-700">quantity</span>
      </div>
    </div>

    <button
      @click="generatePdf"
      class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
      :disabled="isLoading"
    >
      Generate PDF
    </button>
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
      minQty: 6,
      isLoading: false,
    };
  },
  async mounted() {
    try {
      const jsonUrl =
        "https://raw.githubusercontent.com/sahilsync07/sbe/main/frontend/public/assets/stock-data.json";
      const response = await axios.get(jsonUrl);
      this.brands = [...new Set(response.data.map((group) => group.groupName))];
    } catch (err) {
      console.error("Error fetching brands:", err);
    }
  },
  methods: {
    async generatePdf() {
      if (this.selectedBrands.length === 0) {
        alert("Please select at least one brand");
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
          "http://localhost:3000/generate-pdf",
          payload,
          {
            responseType: "blob",
          }
        );
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "products.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (err) {
        console.error("Error generating PDF:", err);
        alert("Failed to generate PDF. Please try again.");
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
