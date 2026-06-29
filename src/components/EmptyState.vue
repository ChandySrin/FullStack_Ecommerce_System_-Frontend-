<script setup>
defineProps({ text: { type: String, required: true } });
</script>

<template>
  <div class="rounded-xl2 bg-white p-10 text-center border border-ink-900/12">
    <p class="text-ink-700">{{ text }}</p>
  </div>
</template>
