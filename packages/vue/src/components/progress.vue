<template>
  <component
    :is="is || 'div'"
    v-bind="attrs"
    :class="computedClass"
    :style="computedStyle"
  >
    <slot>
      <Bar>
        <Peg />
      </Bar>
      <Spinner>
        <SpinnerIcon />
      </Spinner>
    </slot>
  </component>
</template>

<script setup lang="ts">
import { computed, ComputedRef, CSSProperties, useAttrs } from 'vue';
import Bar from './bar.vue';
import Peg from './peg.vue';
import Spinner from './spinner.vue';
import SpinnerIcon from './spinner-icon.vue';
import { classNames } from '../utils/classnames';
import type { ProgressProps } from '../types';

const props = defineProps<ProgressProps>();
const attrs = useAttrs();

// Concatenates the default 'bprogress' class with any class passed as prop.
const computedClass = computed(() => {
  return classNames('bprogress', props.class);
});

// Adds “display: none” to existing style
const computedStyle: ComputedRef<CSSProperties | string> = computed(() => {
  if (typeof props.style === 'string') {
    return props.style + '; display: none;';
  } else if (typeof props.style === 'object' && props.style !== null) {
    return { ...props.style, display: 'none' };
  }
  return { display: 'none' };
});
</script>
