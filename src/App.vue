<script setup>
import { onMounted } from 'vue';
import { useShop } from './store/shop';

import AppHeader from './components/AppHeader.vue';
import HeroSection from './components/HeroSection.vue';
import ToastStack from './components/ToastStack.vue';
import ShopPanel from './components/ShopPanel.vue';
import AuthPanel from './components/AuthPanel.vue';
import WishlistPanel from './components/WishlistPanel.vue';
import CartPanel from './components/CartPanel.vue';
import OrdersPanel from './components/OrdersPanel.vue';
import ProfilePanel from './components/ProfilePanel.vue';
import ProductModal from './components/ProductModal.vue';
import ScrollTopButton from './components/ScrollTopButton.vue';
import AppFooter from './components/AppFooter.vue';

const { activePanel, bootstrap } = useShop();

onMounted(bootstrap);
</script>

<template>
  <div class="min-h-screen bg-surface-50">
    <AppHeader />
    <HeroSection />
    <ToastStack />

    <main class="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Transition
        mode="out-in"
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div :key="activePanel">
          <ShopPanel v-if="activePanel === 'shop'" />
          <AuthPanel v-else-if="activePanel === 'auth'" />
          <WishlistPanel v-else-if="activePanel === 'wishlist'" />
          <CartPanel v-else-if="activePanel === 'cart'" />
          <OrdersPanel v-else-if="activePanel === 'orders'" />
          <ProfilePanel v-else-if="activePanel === 'profile'" />
        </div>
      </Transition>
    </main>

    <ProductModal />
    <ScrollTopButton />
    <AppFooter />
  </div>
</template>
