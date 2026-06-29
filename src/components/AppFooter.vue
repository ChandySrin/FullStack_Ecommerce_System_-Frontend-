<script setup>
import { AtSign, Clock, Mail, MapPin, MessageCircle, Phone, ShoppingBag } from '@lucide/vue';
// Note: @lucide/vue dropped brand icons (Facebook/Instagram/Twitter) in this
// version. Using generic AtSign/MessageCircle as stand-ins for social links —
// swap in real brand SVGs (or another icon pack) if you need the actual logos.
import { useShop } from '../store/shop';

const { isLoggedIn, switchPanel } = useShop();
</script>

<template>
  <footer class="border-t-2 border-primary-700 bg-primary-900 text-surface-50">
    <div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 sm:flex-row sm:items-center sm:justify-between">

      <!-- Brand -->
      <a href="#" class="flex items-center gap-2" @click.prevent="switchPanel('shop')">
        <span class="flex h-8 w-8 items-center justify-center rounded-full bg-surface-50 text-primary-900">
          <ShoppingBag :size="15" />
        </span>
        <strong class="font-display text-base">GENZ</strong>
      </a>

      <!-- Links, all in one row -->
      <nav class="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-surface-50/80">
        <a href="#" class="hover:text-surface-50" @click.prevent="switchPanel('shop')">Shop</a>
        <a href="#" class="hover:text-surface-50" @click.prevent="switchPanel('wishlist')">Wishlist</a>
        <a href="#" class="hover:text-surface-50" @click.prevent="switchPanel('cart')">Cart</a>
        <a href="#" class="hover:text-surface-50" @click.prevent="switchPanel('orders')">Orders</a>
        <a
          href="#"
          class="hover:text-surface-50"
          @click.prevent="isLoggedIn ? switchPanel('profile') : switchPanel('auth')"
        >
          Profile
        </a>
        <a href="#" class="hover:text-surface-50">Shipping & returns</a>
        <a href="#" class="hover:text-surface-50">Privacy</a>
        <a href="#" class="hover:text-surface-50">Terms</a>
        <a href="#" class="hover:text-surface-50">Cookies</a>
      </nav>

      <!-- Contact -->
      <div class="flex items-center gap-3">
        <a href="mailto:support@genz.shop" aria-label="Email us" class="flex h-7 w-7 items-center justify-center rounded-full bg-surface-50/10 text-surface-50 transition hover:bg-surface-50/20">
          <AtSign :size="13" />
        </a>
        <a href="#" aria-label="Message us" class="flex h-7 w-7 items-center justify-center rounded-full bg-surface-50/10 text-surface-50 transition hover:bg-surface-50/20">
          <MessageCircle :size="13" />
        </a>
      </div>
    </div>

    <!-- Extra info row: address, phone, hours -->
    <div class="border-t border-surface-50/10">
      <div class="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-1.5 px-4 py-3 text-xs text-surface-50/70 sm:px-6">
        <span class="flex items-center gap-1.5">
          <MapPin :size="13" class="shrink-0" /> Phnom Penh, Cambodia
        </span>
        <a href="tel:+18005550199" class="flex items-center gap-1.5 hover:text-surface-50">
          <Phone :size="13" class="shrink-0" /> +1 (800) 555-0199
        </a>
        <span class="flex items-center gap-1.5">
          <Clock :size="13" class="shrink-0" /> Mon–Sat, 9am–6pm
        </span>
      </div>
    </div>

    <div class="border-t border-surface-50/10">
      <p class="mx-auto max-w-7xl px-4 py-3 text-center text-[11px] text-surface-50/60 sm:px-6">
        © {{ new Date().getFullYear() }} GENZ.
      </p>
    </div>
  </footer>
</template>