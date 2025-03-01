<template>
  <component :is="is || 'div'" v-bind="attrs" :class="computedClass">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { classNames } from '../utils/classnames';
import { BarProps } from '../types';

const props = defineProps<BarProps>();
const attrs = useAttrs();

const computedClass = computed(() => {
  return classNames(props.classSelector || 'bar', props.class);
});
</script>
