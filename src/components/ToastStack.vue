<script setup>
import { useShop } from '../store/shop';

const { message, error } = useShop();
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-3"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="message"
        class="pointer-events-auto rounded-full bg-primary-900 px-5 py-2.5 text-sm font-semibold text-surface-50 shadow-card"
      >
        {{ message }}
      </div>
    </Transition>

    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-3"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="error"
        class="pointer-events-auto rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-card"
      >
        {{ error }}
      </div>
    </Transition>
  </div>
</template>
