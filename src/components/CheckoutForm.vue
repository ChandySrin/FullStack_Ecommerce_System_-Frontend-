<script setup>
import { useShop } from '../store/shop';

const { checkoutForm, cartItems, cartTotal, loading, money, checkout } = useShop();
</script>

<template>
  <form class="h-fit space-y-4 rounded-xl2 bg-white p-5 border border-ink-900/12 shadow-card lg:sticky lg:top-24" @submit.prevent="checkout">
    <h3 class="font-display text-lg">Checkout</h3>

    <label class="block text-xs font-bold uppercase tracking-wide text-ink-700">
      Shipping Address
      <textarea
        v-model="checkoutForm.shipping_address"
        required
        placeholder="Street, city, postal code"
        rows="3"
        class="mt-1.5 w-full rounded-lg bg-surface-100 px-3 py-2.5 border border-ink-900/12 text-sm outline-none"
      ></textarea>
    </label>

    <label class="block text-xs font-bold uppercase tracking-wide text-ink-700">
      Payment Method
      <select v-model="checkoutForm.payment_method" class="mt-1.5 w-full rounded-lg bg-surface-100 px-3 py-2.5 border border-ink-900/12 text-sm outline-none">
        <option>Cash on delivery</option>
        <option>Bank transfer</option>
        <option>Card on delivery</option>
      </select>
    </label>

    <div class="flex items-center justify-between border-t-2 border-dashed border-ink-900/20 pt-3">
      <span class="text-sm font-semibold text-ink-700">Total</span>
      <strong class="font-display text-lg">{{ money(cartTotal) }}</strong>
    </div>

    <button
      class="w-full rounded-full bg-primary-900 py-3 text-sm font-bold text-surface-50 border border-ink-900/12 shadow-card transition hover:-translate-y-0.5 disabled:opacity-50"
      type="submit"
      :disabled="!cartItems.length || loading.action"
    >
      Place order
    </button>
  </form>
</template>
