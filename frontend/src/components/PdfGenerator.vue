<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50"
  >
    <!-- Smart Wake-Up Full Screen -->
    <div
      v-if="serverStatus !== 'ready'"
      class="fixed inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full mx-6 text-center animate-pulse"
      >
        <div class="relative mx-auto w-32 h-32 mb-10">
          <div
            class="absolute inset-0 rounded-full border-12 border-gray-200"
          ></div>
          <div
            class="absolute inset-0 rounded-full border-12 border-t-white border-r-transparent animate-spin"
          ></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-5xl font-black text-indigo-600">{{
              countdown
            }}</span>
          </div>
        </div>
        <h2 class="text-4xl font-bold text-gray-800 mb-4">
          Starting Server...
        </h2>
        <p class="text-xl text-gray-600">
          Your catalog is being prepared • {{ countdown }} seconds
        </p>
      </div>
    </div>

    <!-- Main App – FULL RESPONSIVE GOD MODE -->
    <div
      v-if="serverStatus === 'ready'"
      class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <!-- Header -->
      <header class="text-center mb-12">
        <h1
          class="text-5xl sm:text-7xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight"
        >
          Sri Brundabana<br class="sm:hidden" />
          Enterprises
        </h1>
        <p class="text-2xl sm:text-3xl font-bold text-gray-700 mt-4">
          PDF Catalog Generator
        </p>
        <p class="text-lg sm:text-xl text-green-600 font-bold mt-3">
          One PDF per brand • Instant Download
        </p>
      </header>

      <!-- Quick Action Buttons -->
      <div class="bg-white/90 rounded-3xl shadow-2xl p-8 mb-10 backdrop-blur">
        <h3
          class="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-800"
        >
          Quick Select
        </h3>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
        >
          <button
            @click="selectAll"
            class="py-6 px-8 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            Select All ({{ brands.length }})
          </button>
          <button
            @click="selectTopBrands"
            :disabled="!hasTopBrands"
            class="py-6 px-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50"
          >
            Top Brands ({{
              topBrandsList.filter((b) => brands.includes(b)).length
            }})
          </button>
          <button
            @click="selectParagonBrands"
            :disabled="!hasParagonBrands"
            class="py-6 px-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50"
          >
            Paragon Brands ({{
              paragonBrandsList.filter((b) => brands.includes(b)).length
            }})
          </button>
          <button
            @click="selectedBrands = []"
            class="py-6 px-8 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            Clear All
          </button>
        </div>
      </div>

      <!-- Brand Grid – FULL WIDTH, MOBILE PERFECT -->
      <div class="bg-white/90 rounded-3xl shadow-2xl p-8 backdrop-blur">
        <div
          class="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4"
        >
          <h2 class="text-3xl sm:text-4xl font-black text-gray-800">
            All Brands
          </h2>
          <div class="text-2xl font-bold text-indigo-600">
            {{ selectedBrands.length }} selected →
            {{ selectedBrands.length }} PDFs ready
          </div>
        </div>

        <div
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5"
        >
          <label
            v-for="brand in brands"
            :key="brand"
            class="group relative bg-white border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105"
            :class="
              selectedBrands.includes(brand)
                ? 'border-indigo-600 shadow-2xl ring-4 ring-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50'
                : 'border-gray-300 shadow-lg hover:border-indigo-400'
            "
          >
            <input
              type="checkbox"
              :value="brand"
              v-model="selectedBrands"
              class="sr-only"
            />

            <div class="text-center">
              <div
                class="text-lg sm:text-xl font-bold text-gray-800 leading-tight min-h-16 flex items-center justify-center px-2"
              >
                {{ brand }}
              </div>
              <div
                class="mt-4 w-10 h-10 mx-auto rounded-full border-4 flex items-center justify-center transition-all"
                :class="
                  selectedBrands.includes(brand)
                    ? 'bg-indigo-600 border-indigo-600'
                    : 'border-gray-400 group-hover:border-indigo-500'
                "
              >
                <svg
                  v-if="selectedBrands.includes(brand)"
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </label>
        </div>
      </div>

      <!-- Filters -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 my-12">
        <div class="bg-white/90 rounded-3xl shadow-2xl p-10 backdrop-blur">
          <label
            class="flex items-center space-x-6 text-2xl font-semibold cursor-pointer"
          >
            <input
              type="checkbox"
              v-model="onlyWithPhotos"
              class="w-8 h-8 text-indigo-600 rounded-lg"
            />
            <span>Only products with photos</span>
          </label>
        </div>
        <div class="bg-white/90 rounded-3xl shadow-2xl p-10 backdrop-blur">
          <label
            class="flex items-center space-x-6 text-2xl font-semibold cursor-pointer mb-6"
          >
            <input
              type="checkbox"
              v-model="minQtyEnabled"
              class="w-8 h-8 text-indigo-600 rounded-lg"
            />
            <span>Minimum quantity filter</span>
          </label>
          <div class="flex items-center gap-6">
            <input
              type="number"
              v-model.number="minQty"
              :disabled="!minQtyEnabled"
              min="0"
              class="w-40 px-6 py-5 text-2xl font-bold border-2 rounded-2xl text-center disabled:bg-gray-100 focus:border-indigo-600"
            />
            <span class="text-2xl font-semibold">or more</span>
          </div>
        </div>
      </div>

      <!-- Generate Button -->
      <div class="text-center mt-16">
        <button
          @click="generatePdf"
          :disabled="isGenerating || selectedBrands.length === 0"
          class="px-20 py-10 text-3xl sm:text-5xl font-black text-white rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 disabled:opacity-60"
          :class="
            isGenerating
              ? 'bg-gradient-to-r from-orange-600 to-red-600'
              : 'bg-gradient-to-r from-green-600 to-emerald-700'
          "
        >
          <span v-if="!isGenerating">
            Download {{ selectedBrands.length }} PDFs Now
          </span>
          <span v-else class="flex items-center gap-4">
            <span>Generating</span>
            <span class="animate-spin">Loading</span>
            <span
              >{{ currentBrand }} ({{ completedCount }}/{{
                selectedBrands.length
              }})</span
            >
          </span>
        </button>
      </div>
      <!-- Add this right after the PDF button -->
      <div class="text-center mt-8">
        <button
          @click="downloadAsImages"
          :disabled="isGenerating || selectedBrands.length === 0"
          class="px-20 py-10 text-3xl sm:text-5xl font-black text-white rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 disabled:opacity-60"
          :class="
            isGenerating
              ? 'bg-gradient-to-r from-gray-600 to-gray-700'
              : 'bg-gradient-to-r from-orange-500 to-red-600'
          "
        >
          <span v-if="!isGenerating">
            Download as Images ({{ selectedBrands.length }} brands)
          </span>
          <span v-else>
            Creating Images • {{ currentBrand }} •
            {{ totalSuccess + totalFailed }} done
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

      topBrandsList: [
        "CUBIX",
        "EEKEN",
        "Florex (Swastik)",
        "Max",
        "RELIANCE FOOTWEAR",
        "Solea & Meriva , Mascara",
        "VERTEX, SLICKERS & FENDER",
      ],
      paragonBrandsList: [
        "EEKEN",
        "Max",
        "Solea & Meriva , Mascara",
        "VERTEX, SLICKERS & FENDER",
      ],
      totalSuccess: 0,
      totalFailed: 0,
    };
  },

  computed: {
    hasTopBrands() {
      return this.topBrandsList.some((b) => this.brands.includes(b));
    },
    hasParagonBrands() {
      return this.paragonBrandsList.some((b) => this.brands.includes(b));
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
        this.brands = [...new Set(res.data.map((g) => g.groupName))].sort();
      } catch (err) {
        alert("Failed to load brands.");
      }
    },

    warmUpServer() {
      this.serverStatus = "waking";
      this.startCountdown();
      axios
        .get("https://gen-pdf-0hb9.onrender.com/", { timeout: 5000 })
        .catch(() => {});
      const check = async () => {
        try {
          await axios.head("https://gen-pdf-0hb9.onrender.com/", {
            timeout: 10000,
          });
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
    },
    selectTopBrands() {
      this.selectedBrands = [
        ...new Set([
          ...this.selectedBrands,
          ...this.topBrandsList.filter((b) => this.brands.includes(b)),
        ]),
      ];
    },
    selectParagonBrands() {
      this.selectedBrands = [
        ...new Set([
          ...this.selectedBrands,
          ...this.paragonBrandsList.filter((b) => this.brands.includes(b)),
        ]),
      ];
    },

    async generatePdf() {
      if (!this.selectedBrands.length) return alert("Select brands first!");

      this.isGenerating = true;
      this.completedCount = 0;

      const promises = this.selectedBrands.map(async (brand) => {
        this.currentBrand = brand;
        const payload = {
          brands: [brand],
          onlyWithPhotos: this.onlyWithPhotos,
          minQty: this.minQtyEnabled ? this.minQty : -1,
        };

        const res = await axios.post(
          "https://gen-pdf-0hb9.onrender.com/generate-pdf",
          payload,
          { responseType: "blob", timeout: 180000 }
        );

        const today = new Date().toISOString().split("T")[0];
        const safe = brand.replace(/[^a-zA-Z0-9]/g, "_");
        const filename = `${safe}_${today}.pdf`;

        const url = window.URL.createObjectURL(res.data);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);

        this.completedCount++;
        await new Promise((r) => setTimeout(r, 700));
      });

      try {
        await Promise.all(promises);
        alert(`All ${this.selectedBrands.length} PDFs downloaded!`);
      } catch {
        alert("Some failed. Try again.");
      } finally {
        this.isGenerating = false;
        this.currentBrand = "";
      }
    },
    async downloadAsImages() {
      if (!this.selectedBrands.length) {
        return alert("Please select at least one brand!");
      }

      this.isGenerating = true;
      let totalSuccess = 0;
      let totalFailed = 0;

      // Import pdfjs dynamically (fixes "pdfjsLib not defined")
      const pdfjsLib = await import("pdfjs-dist/webpack");

      for (const brand of this.selectedBrands) {
        this.currentBrand = brand;
        const payload = {
          brands: [brand],
          onlyWithPhotos: this.onlyWithPhotos,
          minQty: this.minQtyEnabled ? this.minQty : -1,
        };

        try {
          const res = await axios.post(
            "https://gen-pdf-0hb9.onrender.com/generate-pdf",
            payload,
            { responseType: "blob", timeout: 180000 }
          );

          const pdfBlob = res.data;
          const pdfUrl = URL.createObjectURL(pdfBlob);

          const loadingTask = pdfjsLib.getDocument(pdfUrl);
          const pdf = await loadingTask.promise;

          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 2.5 }); // Ultra HD

            const canvas = document.createElement("canvas");
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const context = canvas.getContext("2d");

            await page.render({ canvasContext: context, viewport }).promise;

            const blob = await new Promise((resolve) =>
              canvas.toBlob(resolve, "image/png", 0.95)
            );
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `${brand.replace(/[^a-zA-Z0-9]/g, "_")}_Image_${String(
              pageNum
            ).padStart(3, "0")}.png`;
            a.click();
            URL.revokeObjectURL(url);

            totalSuccess++;
          }

          URL.revokeObjectURL(pdfUrl);
          await new Promise((r) => setTimeout(r, 800));
        } catch (err) {
          console.error("Failed for brand:", brand, err);
          totalFailed++;
        }
      }

      this.isGenerating = false;
      this.currentBrand = "";

      // Real success message
      if (totalFailed === 0) {
        alert(`All images downloaded successfully! (${totalSuccess} images)`);
      } else {
        alert(
          `Done!\n` +
            `Success: ${totalSuccess} images downloaded\n` +
            `Failed: ${totalFailed} brands failed\n` +
            `Try again in 30 seconds if any failed.`
        );
      }
    },
  },

  beforeUnmount() {
    clearInterval(this.pollInterval);
  },
};
</script>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
