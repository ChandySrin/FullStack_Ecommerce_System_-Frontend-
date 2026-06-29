<script setup>
import { Minus, Plus, X } from '@lucide/vue';
import { useShop } from '../store/shop';
import SectionHead from './SectionHead.vue';
import EmptyState from './EmptyState.vue';
import CheckoutForm from './CheckoutForm.vue';

const { isLoggedIn, cartItems, cartTotal, productImage, money, updateCart, removeCartItem } = useShop();
</script>

<template>
  <section class="grid gap-6 lg:grid-cols-[1fr_320px]">
    <div>
      <SectionHead eyebrow="Shopping" title="Cart">
        <template #aside>
          <strong class="font-display text-lg">{{ money(cartTotal) }}</strong>
        </template>
      </SectionHead>

      <EmptyState v-if="!isLoggedIn" text="Login to manage your cart." />
      <EmptyState v-else-if="!cartItems.length" text="Your cart is empty." />

      <div v-else class="space-y-3">
        <article
          v-for="item in cartItems"
          :key="item.id"
          class="flex flex-wrap items-center gap-4 rounded-xl2 bg-white p-4 border border-ink-900/12 shadow-card"
        >
          <img :src="productImage(item.product)" :alt="item.product.name" class="h-16 w-16 rounded-lg border-2 border-ink-900 object-cover" />
          <div class="min-w-[8rem] flex-1">
            <h3 class="font-display text-sm leading-tight">{{ item.product.name }}</h3>
            <p class="mt-1 text-sm text-ink-700">{{ money(item.product.price) }}</p>
          </div>

          <div class="flex items-center gap-2 rounded-full bg-surface-100 p-1 border border-ink-900/12">
            <button class="flex h-7 w-7 items-center justify-center rounded-full" @click="updateCart(item, item.quantity - 1)">
              <Minus :size="14" />
            </button>
            <span class="w-6 text-center text-sm font-bold">{{ item.quantity }}</span>
            <button class="flex h-7 w-7 items-center justify-center rounded-full" @click="updateCart(item, item.quantity + 1)">
              <Plus :size="14" />
            </button>
          </div>

          <button
            class="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-ink-900/12 text-red-500"
            @click="removeCartItem(item)"
            aria-label="Remove"
          >
            <X :size="16" />
          </button>
        </article>
      </div>
    </div>

    <CheckoutForm />
  </section>
</template>
