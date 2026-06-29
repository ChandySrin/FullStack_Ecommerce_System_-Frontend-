<script setup>
import { X } from '@lucide/vue';
import { useShop } from '../store/shop';
import SectionHead from './SectionHead.vue';
import EmptyState from './EmptyState.vue';

const { isLoggedIn, wishlist, productImage, money, addToCart, toggleWishlist } = useShop();
</script>

<template>
  <section>
    <SectionHead eyebrow="Saved" title="Wishlist" />

    <EmptyState v-if="!isLoggedIn" text="Login to save favorite products." />
    <EmptyState v-else-if="!wishlist.length" text="Your wishlist is empty." />

    <div v-else class="space-y-3">
      <article
        v-for="item in wishlist"
        :key="item.id"
        class="flex flex-wrap items-center gap-4 rounded-xl2 bg-white p-4 border border-ink-900/12 shadow-card"
      >
        <img :src="productImage(item.product)" :alt="item.product.name" class="h-16 w-16 rounded-lg border-2 border-ink-900 object-cover" />
        <div class="min-w-[8rem] flex-1">
          <h3 class="font-display text-sm leading-tight">{{ item.product.name }}</h3>
          <p class="mt-1 text-sm text-ink-700">{{ money(item.product.price) }}</p>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="rounded-full bg-primary-900 px-4 py-2 text-sm font-bold text-surface-50 border border-ink-900/12"
            @click="addToCart(item.product)"
          >
            Add to Cart
          </button>
          <button
            class="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-ink-900/12 text-red-500"
            @click="toggleWishlist(item.product)"
            aria-label="Remove"
          >
            <X :size="16" />
          </button>
        </div>
      </article>
    </div>
  </section>
</template>
