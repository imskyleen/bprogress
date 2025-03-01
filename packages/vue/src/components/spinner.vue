<template>
  <component :is="is || 'div'" v-bind="attrs" :class="computedClass">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { classNames } from '../utils/classnames';
import { SpinnerProps } from '../types';

const props = defineProps<SpinnerProps>();
const attrs = useAttrs();

const computedClass = computed(() => {
  return classNames(props.classSelector || 'spinner', props.class);
});
</script>
