<script setup>
import { Star, X } from '@lucide/vue';
import { useShop } from '../store/shop';

const {
  selectedProduct,
  reviews,
  reviewForm,
  isLoggedIn,
  productImage,
  money,
  closeProduct,
  addToCart,
  submitReview,
} = useShop();
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="selectedProduct"
      class="fixed inset-0 z-50 flex items-center justify-center bg-primary-900/60 p-4"
      @click.self="closeProduct"
    >
      <section class="relative grid max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl2 bg-surface-50 border border-ink-900/12 shadow-card-lg sm:grid-cols-[0.85fr_1.15fr]">
        <button
          class="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white border border-ink-900/12"
          type="button"
          @click="closeProduct"
          aria-label="Close"
        >
          <X :size="17" />
        </button>

        <div class="bg-surface-100 p-5 sm:p-6">
          <img
            :src="productImage(selectedProduct)"
            :alt="selectedProduct.name"
            class="h-40 w-full rounded-xl2 border border-ink-900/10 bg-white object-contain p-3 shadow-card sm:h-full sm:max-h-72"
          />
        </div>

        <div class="space-y-4 p-6">
          <p class="text-xs font-bold uppercase tracking-wide text-red-500">{{ selectedProduct.category?.name || 'Product' }}</p>
          <h2 class="font-display text-2xl leading-tight">{{ selectedProduct.name }}</h2>
          <p class="text-sm text-ink-700">{{ selectedProduct.description || 'No description yet.' }}</p>

          <div class="flex items-center justify-between rounded-lg bg-white p-3 border border-ink-900/12">
            <strong class="font-display text-lg">{{ money(selectedProduct.price) }}</strong>
            <span class="text-sm text-ink-700">{{ selectedProduct.stock }} in stock</span>
          </div>

          <button
            class="w-full rounded-full bg-primary-900 py-3 text-sm font-bold text-surface-50 border border-ink-900/12 shadow-card transition hover:-translate-y-0.5"
            type="button"
            @click="addToCart(selectedProduct)"
          >
            Add to cart
          </button>

          <div class="border-t-2 border-dashed border-ink-900/20 pt-4">
            <h3 class="font-display text-base">Reviews</h3>

            <form v-if="isLoggedIn" class="mt-3 flex flex-wrap gap-2" @submit.prevent="submitReview">
              <select v-model="reviewForm.rating" class="rounded-lg bg-white px-2 py-2 border border-ink-900/12 text-sm outline-none">
                <option v-for="value in [5, 4, 3, 2, 1]" :key="value" :value="value">{{ value }} stars</option>
              </select>
              <input
                v-model="reviewForm.comment"
                type="text"
                placeholder="Write a quick review"
                class="min-w-[8rem] flex-1 rounded-lg bg-white px-3 py-2 border border-ink-900/12 text-sm outline-none"
              />
              <button class="flex items-center gap-1.5 rounded-full bg-primary-900 px-4 py-2 text-sm font-bold text-surface-50" type="submit">
                <Star :size="14" /> Save
              </button>
            </form>

            <div v-if="!reviews.length" class="mt-3 text-sm text-ink-700">No reviews yet.</div>

            <article v-for="review in reviews" :key="review.id" class="mt-3 rounded-lg bg-white p-3 border border-ink-900/12">
              <div class="flex items-center justify-between text-sm">
                <strong>{{ review.user?.name || 'Customer' }}</strong>
                <span class="text-ink-700">{{ review.rating }}/5</span>
              </div>
              <p class="mt-1 text-sm text-ink-700">{{ review.comment || 'No comment.' }}</p>
            </article>
          </div>
        </div>
      </section>
    </div>
  </Transition>
</template>