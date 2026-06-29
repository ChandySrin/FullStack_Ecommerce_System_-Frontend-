<script setup>
import { useShop } from '../store/shop';
import ProductCard from './ProductCard.vue';

const { loading, products, sortedProducts } = useShop();
</script>

<template>
  <section class="pt-5">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="font-display text-xl font-semibold text-ink-900">Products For You!</h2>
      <span class="text-sm text-ink-700">{{ products.length }} shown</span>
    </div>

    <div v-if="loading.products" class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <div v-for="n in 8" :key="n" class="animate-pulse rounded-xl2 bg-white p-3 shadow-card">
        <div class="aspect-square rounded-lg bg-surface-100"></div>
        <div class="mt-3 space-y-2">
          <div class="h-3 w-2/3 rounded bg-surface-100"></div>
          <div class="h-3 w-1/3 rounded bg-surface-100"></div>
        </div>
      </div>
    </div>

    <div v-else-if="!products.length" class="rounded-xl2 bg-white p-10 text-center shadow-card">
      <p class="text-ink-700">No products yet. Add products from the admin panel.</p>
    </div>

    <TransitionGroup
      v-else
      tag="div"
      class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <ProductCard v-for="product in sortedProducts" :key="product.id" :product="product" />
    </TransitionGroup>
  </section>
</template>
