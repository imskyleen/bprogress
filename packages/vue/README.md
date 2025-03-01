# BProgress for Vue

Create your own **progress bar** with **Vue**

## Import

```tsx
import { ProgressProvider } from '@bprogress/vue';
```

The `@bprogress/vue` package is a **utility** that lets you easily manage a progress bar, while remaining flexible with regard to the router you're using. **It doesn't automatically start the progress bar when browsing**, so you'll have to manage this logic yourself, unless you're using one of the integrations below.

### Vue Frameworks Integrations

- Soon...

## Usage

```vue
<ProgressProvider>...</ProgressProvider>
```

## Example

```vue title="src/Root.vue"
<script setup lang="ts">
import App from './App.vue';
import { ProgressProvider } from '@bprogress/vue';
</script>

<template>
  <ProgressProvider>
    <App />
  </ProgressProvider>
</template>
```

```ts title="src/main.ts"
import { createApp } from 'vue';
import Root from './Root.vue';

createApp(Root).mount('#app');
```

```vue title="src/App.vue"
<script setup lang="ts">
import { useProgress } from '@bprogress/vue';

const { start, stop, pause, resume } = useProgress();
</script>

<template>
  <button @click="start()">Start</button>
  <button @click="stop()">Stop</button>
  <button @click="pause">Pause</button>
  <button @click="resume">Resume</button>
</template>
```

## More information on documentation

Go to the [documentation](https://bprogress.vercel.app/docs/vue/installation) to learn more about BProgress.

## Issues

If you encounter any problems, do not hesitate to [open an issue](https://github.com/Skyleen77/bprogress/issues) or make a PR [here](https://github.com/Skyleen77/bprogress).

## LICENSE

MIT
