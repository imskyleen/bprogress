<template>
  <div style="display: none"></div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAnchorProgress } from '@bprogress/vue'

const route = useRoute()

useAnchorProgress({}, [route.fullPath])
</script>
