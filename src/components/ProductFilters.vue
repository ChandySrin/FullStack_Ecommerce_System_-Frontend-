<script setup>
import { Heart, RotateCcw } from '@lucide/vue';
import { useShop } from '../store/shop';

const { filters, categories, wishlist, loadProducts, resetFilters, switchPanel } = useShop();
</script>

<template>
  <div class="flex flex-wrap items-center gap-2 border-b border-ink-900/10 pb-5">
    <label class="flex items-center gap-1.5 rounded-full border border-ink-900/15 bg-white px-3 py-2 text-xs font-medium text-ink-700">
      Category
      <select v-model="filters.category_id" class="bg-transparent text-ink-900 outline-none" @change="loadProducts">
        <option value="">All</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
      </select>
    </label>

    <!-- Real filter: caps price using each product's actual price -->
    <label class="flex items-center gap-1.5 rounded-full border border-ink-900/15 bg-white px-3 py-2 text-xs font-medium text-ink-700">
      Price
      <select v-model="filters.price_max" class="bg-transparent text-ink-900 outline-none">
        <option value="">Any</option>
        <option value="25">Under $25</option>
        <option value="50">Under $50</option>
        <option value="100">Under $100</option>
      </select>
    </label>

    <!-- Real filter: uses each product's actual average rating -->
    <label class="flex items-center gap-1.5 rounded-full border border-ink-900/15 bg-white px-3 py-2 text-xs font-medium text-ink-700">
      Review
      <select v-model="filters.min_rating" class="bg-transparent text-ink-900 outline-none">
        <option value="">Any</option>
        <option value="4">4 stars & up</option>
        <option value="3">3 stars & up</option>
      </select>
    </label>

    <button
      class="flex items-center gap-1.5 rounded-full border border-ink-900/15 bg-white px-3 py-2 text-xs font-medium text-ink-700 hover:bg-surface-100"
      type="button"
      @click="resetFilters"
    >
      <RotateCcw :size="13" /> Reset filters
    </button>

    <!-- Quick jump to wishlist, with a live count -->
    <button
      class="flex items-center gap-1.5 rounded-full border border-ink-900/15 bg-white px-3 py-2 text-xs font-medium text-ink-700 hover:bg-surface-100"
      type="button"
      @click="switchPanel('wishlist')"
    >
      <Heart :size="13" /> Wishlist
      <span v-if="wishlist.length" class="rounded-full bg-primary-900 px-1.5 py-0.5 text-[10px] font-bold text-surface-50">
        {{ wishlist.length }}
      </span>
    </button>

    <label class="ml-auto flex items-center gap-1.5 text-xs font-medium text-ink-700">
      Sort by
      <select v-model="filters.sort" class="rounded-full border border-ink-900/15 bg-white px-3 py-2 text-ink-900 outline-none">
        <option value="featured">Featured</option>
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="name_asc">Name: A to Z</option>
      </select>
    </label>
  </div>
</template>