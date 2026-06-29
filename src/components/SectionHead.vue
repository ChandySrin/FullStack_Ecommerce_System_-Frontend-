<script setup>
defineProps({ eyebrow: { type: String, required: true }, title: { type: String, required: true } });
</script>

<template>
  <div class="mb-5 flex items-center justify-between gap-4">
    <div>
      <p class="text-xs font-bold uppercase tracking-wide text-red-500">{{ eyebrow }}</p>
      <h2 class="font-display text-2xl">{{ title }}</h2>
    </div>
    <slot name="aside" />
  </div>
</template>
