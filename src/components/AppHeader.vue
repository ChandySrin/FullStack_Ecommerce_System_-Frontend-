<script setup>
import { ref } from 'vue';
import { ChevronDown, LogOut, Menu, Search, ShoppingBag, ShoppingCart, User } from '@lucide/vue';
import { useShop } from '../store/shop';

const { activePanel, isLoggedIn, user, userInitials, cartCount, filters, onSearchInput, loadProducts, switchPanel, logout } =
  useShop();

const showMobileNav = ref(false);
const userMenuOpen = ref(false);

function go(panel) {
  switchPanel(panel);
  showMobileNav.value = false;
}

function whatsNew() {
  filters.sort = 'newest';
  switchPanel('shop');
  loadProducts();
  showMobileNav.value = false;
}

function runSearch() {
  switchPanel('shop');
  loadProducts();
}

function toggleUserMenu() {
  userMenuOpen.value = !userMenuOpen.value;
}

function handleDocumentClick(event) {
  if (!event.target.closest?.('.user-menu')) userMenuOpen.value = false;
}
</script>

<template>
  <header class="sticky top-0 z-40 bg-surface-50" @click="handleDocumentClick">

    <!-- Main bar -->
    <div class="border-b border-ink-900/10 bg-surface-50 px-4 py-3 sm:px-6">
      <div class="mx-auto flex max-w-7xl items-center gap-4">
        <a class="flex items-center gap-2 font-display text-lg font-bold text-primary-900" href="#" @click.prevent="go('shop')">
          <span class="flex h-9 w-9 items-center justify-center rounded-full bg-primary-900 text-surface-50">
            <ShoppingBag :size="17" />
          </span>
          Shopcart
        </a>

        <nav class="ml-2 hidden items-center gap-6 text-sm font-medium text-ink-900 lg:flex">
          <button class="flex items-center gap-1 hover:text-primary-700" @click="go('shop')">
            Categories <ChevronDown :size="14" />
          </button>
          <button class="hover:text-primary-700" @click="whatsNew">What's New</button>
        </nav>

        <div class="mx-auto hidden max-w-md flex-1 items-center gap-2 rounded-full border border-ink-900/15 bg-white px-4 py-2.5 lg:flex">
          <button type="button" aria-label="Search" class="text-ink-400 hover:text-primary-700" @click="runSearch">
            <Search :size="16" />
          </button>
          <input
            v-model="filters.search"
            type="search"
            placeholder="Search Product"
            class="w-full bg-transparent text-sm outline-none placeholder:text-ink-400"
            @input="onSearchInput"
            @keyup.enter="runSearch"
          />
        </div>

        <div class="ml-auto flex items-center gap-4">
          <div v-if="!isLoggedIn" class="hidden items-center gap-1.5 text-sm font-medium sm:flex">
            <button class="flex items-center gap-1.5 hover:text-primary-700" @click="go('auth')">
              <User :size="18" /> Account
            </button>
          </div>

          <div v-else class="user-menu relative hidden sm:block">
            <button class="flex items-center gap-2" type="button" @click.stop="toggleUserMenu" :aria-expanded="userMenuOpen">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-900 text-xs font-bold text-surface-50">
                {{ userInitials }}
              </span>
              <ChevronDown :size="14" class="transition-transform" :class="{ 'rotate-180': userMenuOpen }" />
            </button>

            <Transition
              enter-active-class="transition ease-out duration-150"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <div v-if="userMenuOpen" class="absolute right-0 top-full mt-2 w-56 rounded-xl2 bg-white p-2 shadow-card-lg">
                <div class="border-b border-ink-900/10 p-2 pb-3">
                  <strong class="block truncate text-sm">{{ user?.name }}</strong>
                  <p class="truncate text-xs text-ink-700">{{ user?.email }}</p>
                </div>
                <button class="flex w-full items-center gap-2 rounded-lg p-2 text-sm font-medium hover:bg-surface-100" @click="go('profile')">
                  <User :size="15" /> Profile
                </button>
                <button class="flex w-full items-center gap-2 rounded-lg p-2 text-sm font-medium hover:bg-surface-100" @click="go('orders')">
                  <ShoppingBag :size="15" /> Orders
                </button>
                <button class="flex w-full items-center gap-2 rounded-lg p-2 text-sm font-medium text-red-600 hover:bg-red-50" @click="logout">
                  <LogOut :size="15" /> Logout
                </button>
              </div>
            </Transition>
          </div>

          <button class="relative flex items-center gap-1.5 text-sm font-medium" @click="go('cart')">
            <ShoppingCart :size="19" />
            <span class="hidden sm:inline">Cart</span>
            <span
              v-if="cartCount"
              class="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-900 text-[10px] font-bold text-surface-50"
            >
              {{ cartCount }}
            </span>
          </button>

          <button class="rounded-lg border border-ink-900/15 p-2 lg:hidden" type="button" @click="showMobileNav = !showMobileNav">
            <Menu :size="18" />
          </button>
        </div>
      </div>

      <!-- Mobile nav -->
      <nav v-if="showMobileNav" class="mt-3 flex flex-col gap-1 lg:hidden">
        <button class="rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-surface-100" @click="go('shop')">Shop</button>
        <button class="rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-surface-100" @click="go('wishlist')">Wishlist</button>
        <button class="rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-surface-100" @click="go('cart')">Cart</button>
        <button class="rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-surface-100" @click="go('orders')">Orders</button>
        <button class="rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-surface-100" @click="isLoggedIn ? go('profile') : go('auth')">
          {{ isLoggedIn ? 'Profile' : 'Login' }}
        </button>
      </nav>
    </div>
  </header>
</template>