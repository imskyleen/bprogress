<template>
  <component :is="is || 'div'" v-bind="attrs" :class="computedClass">
    <div class="inc" />
    <div class="dec" />
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { classNames } from '../utils/classnames';
import { IndeterminateProps } from '../types';

const props = defineProps<IndeterminateProps>();
const attrs = useAttrs();

const computedClass = computed(() => {
  return classNames(props.classSelector || 'indeterminate', props.class);
});
</script>
