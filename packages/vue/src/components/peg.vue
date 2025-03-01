<template>
  <component :is="is || 'div'" v-bind="attrs" :class="computedClass">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { classNames } from '../utils/classnames';
import { PegProps } from '../types';

const props = defineProps<PegProps>();
const attrs = useAttrs();

const computedClass = computed(() => {
  return classNames(props.classSelector || 'peg', props.class);
});
</script>
