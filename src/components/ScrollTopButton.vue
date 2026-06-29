<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const showScrollTop = ref(false);

function handleScroll() {
  showScrollTop.value = window.scrollY > 480;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-150"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <button
      v-if="showScrollTop"
      class="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary-900 text-surface-50 border border-ink-900/12 shadow-card transition hover:-translate-y-0.5"
      type="button"
      @click="scrollToTop"
      aria-label="Back to top"
    >
      ↑
    </button>
  </Transition>
</template>
