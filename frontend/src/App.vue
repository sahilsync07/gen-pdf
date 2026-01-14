<template>
  <div id="app">
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
