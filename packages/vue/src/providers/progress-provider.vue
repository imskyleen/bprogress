<template>
  <div>
    <slot />
    <component :is="StyleTag" v-if="!disableStyle" />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onUnmounted,
  defineComponent,
  h,
  provide,
  toRefs,
  unref,
} from 'vue';
import { BProgress, css, type BProgressOptions } from '@bprogress/core';
import { progressSymbol } from '../composables/use-progress';
import type { ProgressProviderProps, ProgressContextValue } from '../types';

const props = defineProps<ProgressProviderProps>();
const {
  color = '#0A2FFF',
  height = '2px',
  options,
  spinnerPosition = 'top-right',
  style,
  disableStyle = false,
  nonce,
} = toRefs(props);

if (options.value) BProgress.configure(options.value || {});

const timer = ref<ReturnType<typeof setTimeout> | null>(null);

const start = (startPosition: number = 0, delay: number = 0) => {
  timer.value = setTimeout(() => {
    if (startPosition > 0) BProgress.set(startPosition);
    BProgress.start();
  }, delay);
};

const stop = (stopDelay: number = 0, forcedStopDelay: number = 0) => {
  setTimeout(() => {
    if (timer.value) clearTimeout(timer.value);
    timer.value = setTimeout(() => {
      if (!BProgress.isStarted()) return;
      BProgress.done();
    }, stopDelay);
  }, forcedStopDelay);
};

const inc = (amount?: number) => BProgress.inc(amount);
const dec = (amount?: number) => BProgress.dec(amount);
const set = (n: number) => BProgress.set(n);
const pause = () => BProgress.pause();
const resume = () => BProgress.resume();
const getOptions = () => BProgress.settings;
const setOptions = (
  newOptions:
    | Partial<BProgressOptions>
    | ((prevOptions: BProgressOptions) => Partial<BProgressOptions>),
) => {
  const currentOptions = getOptions();
  const updates =
    typeof newOptions === 'function' ? newOptions(currentOptions) : newOptions;
  const nextOptions = { ...currentOptions, ...updates };
  BProgress.configure(nextOptions);
};

const contextValue: ProgressContextValue = {
  start,
  stop,
  inc,
  dec,
  set,
  pause,
  resume,
  getOptions,
  setOptions,
};
provide(progressSymbol, contextValue);

const computedStyle = computed(() => {
  return (
    unref(style) ||
    css({
      color: unref(color),
      height: unref(height),
      spinnerPosition: unref(spinnerPosition),
    })
  );
});

const StyleTag = defineComponent({
  name: 'BProgressStyle',
  render() {
    return h('style', { nonce: nonce.value ?? undefined }, computedStyle.value);
  },
});

onUnmounted(() => {
  if (timer.value) {
    clearTimeout(timer.value);
  }
});
</script>
