<template>
  <ProgressProvider>
    <App />
  </ProgressProvider>
</template>

<script setup lang="ts">
import App from './App.vue'
import { ProgressProvider } from '@bprogress/vue'
</script>
