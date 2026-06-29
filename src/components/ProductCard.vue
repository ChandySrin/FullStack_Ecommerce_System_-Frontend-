<script setup>
import { Heart, Star } from '@lucide/vue';
import { useShop } from '../store/shop';

const props = defineProps({ product: { type: Object, required: true } });

const { wishlistProductIds, averageRating, money, productImage, toggleWishlist, addToCart, openProduct } = useShop();
</script>

<template>
  <article class="group relative flex flex-col rounded-xl2 bg-white p-3 shadow-card transition hover:-translate-y-1 hover:shadow-card-lg">
    <button
      class="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-card"
      type="button"
      @click="toggleWishlist(product)"
      :aria-label="`Wishlist ${product.name}`"
    >
      <Heart
        :size="15"
        :class="wishlistProductIds.has(product.id) ? 'text-primary-700' : 'text-ink-400'"
        :fill="wishlistProductIds.has(product.id) ? 'currentColor' : 'none'"
      />
    </button>

    <button class="relative aspect-square overflow-hidden rounded-lg bg-surface-50" type="button" @click="openProduct(product)">
      <img
        :src="productImage(product)"
        :alt="product.name"
        loading="lazy"
        class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
      />
      <span v-if="!product.stock" class="absolute bottom-2 left-2 rounded-full bg-ink-900 px-2.5 py-1 text-[11px] font-semibold text-surface-50">
        Out of stock
      </span>
      <span
        v-else-if="product.stock <= 5"
        class="absolute bottom-2 left-2 rounded-full bg-primary-700 px-2.5 py-1 text-[11px] font-semibold text-surface-50"
      >
        Only {{ product.stock }} left
      </span>
    </button>

    <div class="flex flex-1 flex-col gap-1 pt-3">
      <h3 class="truncate text-sm font-semibold text-ink-900">{{ product.name }}</h3>
      <p class="truncate text-xs text-ink-700">{{ product.description || product.category?.name || 'No description yet.' }}</p>

      <div class="flex items-center justify-between pt-1">
        <strong class="font-display text-base text-ink-900">{{ money(product.price) }}</strong>
        <div v-if="averageRating(product)" class="flex items-center gap-0.5 text-primary-700">
          <Star v-for="i in 5" :key="i" :size="11" :fill="i <= Math.round(averageRating(product)) ? 'currentColor' : 'none'" />
        </div>
      </div>

      <button
        class="mt-2 w-full rounded-full border border-ink-900 py-2 text-xs font-semibold text-ink-900 transition hover:bg-primary-900 hover:text-surface-50 disabled:cursor-not-allowed disabled:opacity-40"
        type="button"
        :disabled="!product.stock"
        @click="addToCart(product)"
      >
        Add to Cart
      </button>
    </div>
  </article>
</template>
