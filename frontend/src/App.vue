<template>
  <div
    id="app"
    class="min-h-screen bg-gray-100 flex items-center justify-center"
  >
    <PdfGenerator />
  </div>
</template>

<script>
import PdfGenerator from "./components/PdfGenerator.vue";

export default {
  name: "App",
  components: {
    PdfGenerator,
  },
};
</script>
