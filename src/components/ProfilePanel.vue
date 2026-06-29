<script setup>
import { useShop } from '../store/shop';
import SectionHead from './SectionHead.vue';
import EmptyState from './EmptyState.vue';

const {
  isLoggedIn,
  user,
  userInitials,
  memberSince,
  orders,
  wishlist,
  totalSpent,
  money,
  profileTab,
  profileForm,
  passwordsMismatch,
  loading,
  updateProfile,
} = useShop();
</script>

<template>
  <section class="mx-auto max-w-xl">
    <SectionHead eyebrow="Account" title="Profile" />

    <template v-if="isLoggedIn">
      <div class="flex flex-wrap items-center gap-4 rounded-xl2 bg-white p-5 border border-ink-900/12 shadow-card">
        <span class="flex h-14 w-14 items-center justify-center rounded-full bg-primary-900 font-display text-lg text-surface-50 border border-ink-900/12">
          {{ userInitials }}
        </span>
        <div class="flex-1">
          <strong class="block font-display text-base">{{ user?.name }}</strong>
          <span class="block text-sm text-ink-700">{{ user?.email }}</span>
          <span v-if="memberSince" class="block text-xs text-ink-700">Member since {{ memberSince }}</span>
        </div>
        <span class="rounded-full bg-primary-700 px-3 py-1 text-xs font-bold uppercase text-white">{{ user?.role || 'Customer' }}</span>
      </div>

      <div class="mt-4 grid grid-cols-3 gap-3">
        <div class="rounded-xl2 bg-white p-3 text-center border border-ink-900/12 shadow-card">
          <span class="block text-xs text-ink-700">Orders</span>
          <strong class="font-display text-xl">{{ orders.length }}</strong>
        </div>
        <div class="rounded-xl2 bg-white p-3 text-center border border-ink-900/12 shadow-card">
          <span class="block text-xs text-ink-700">Wishlist</span>
          <strong class="font-display text-xl">{{ wishlist.length }}</strong>
        </div>
        <div class="rounded-xl2 bg-white p-3 text-center border border-ink-900/12 shadow-card">
          <span class="block text-xs text-ink-700">Total Spent</span>
          <strong class="font-display text-xl">{{ money(totalSpent) }}</strong>
        </div>
      </div>

      <div class="mt-6 flex rounded-full bg-surface-100 p-1 border border-ink-900/12">
        <button
          class="flex-1 rounded-full py-2 text-sm font-bold transition"
          :class="profileTab === 'info' ? 'bg-primary-900 text-surface-50' : 'text-ink-700'"
          type="button"
          @click="profileTab = 'info'"
        >
          Profile Info
        </button>
        <button
          class="flex-1 rounded-full py-2 text-sm font-bold transition"
          :class="profileTab === 'security' ? 'bg-primary-900 text-surface-50' : 'text-ink-700'"
          type="button"
          @click="profileTab = 'security'"
        >
          Security
        </button>
      </div>

      <form v-if="profileTab === 'info'" class="mt-5 space-y-4 rounded-xl2 bg-white p-5 border border-ink-900/12 shadow-card" @submit.prevent="updateProfile">
        <label class="block text-xs font-bold uppercase tracking-wide text-ink-700">
          Name
          <input v-model="profileForm.name" type="text" required class="mt-1.5 w-full rounded-lg bg-surface-100 px-3 py-2.5 border border-ink-900/12 text-sm outline-none" />
        </label>
        <label class="block text-xs font-bold uppercase tracking-wide text-ink-700">
          Email
          <input v-model="profileForm.email" type="email" required class="mt-1.5 w-full rounded-lg bg-surface-100 px-3 py-2.5 border border-ink-900/12 text-sm outline-none" />
        </label>
        <button
          class="w-full rounded-full bg-primary-900 py-3 text-sm font-bold text-surface-50 border border-ink-900/12 shadow-card transition hover:-translate-y-0.5 disabled:opacity-50"
          type="submit"
          :disabled="loading.action"
        >
          {{ loading.action ? 'Saving…' : 'Save changes' }}
        </button>
      </form>

      <form v-else class="mt-5 space-y-4 rounded-xl2 bg-white p-5 border border-ink-900/12 shadow-card" @submit.prevent="updateProfile">
        <label class="block text-xs font-bold uppercase tracking-wide text-ink-700">
          New Password
          <input
            v-model="profileForm.password"
            type="password"
            placeholder="Leave blank to keep current password"
            autocomplete="new-password"
            class="mt-1.5 w-full rounded-lg bg-surface-100 px-3 py-2.5 border border-ink-900/12 text-sm outline-none"
          />
        </label>
        <label class="block text-xs font-bold uppercase tracking-wide text-ink-700">
          Confirm New Password
          <input
            v-model="profileForm.password_confirmation"
            type="password"
            autocomplete="new-password"
            class="mt-1.5 w-full rounded-lg bg-surface-100 px-3 py-2.5 border border-ink-900/12 text-sm outline-none"
          />
        </label>
        <p v-if="passwordsMismatch" class="text-sm font-medium text-red-500">Passwords don't match.</p>
        <button
          class="w-full rounded-full bg-primary-900 py-3 text-sm font-bold text-surface-50 border border-ink-900/12 shadow-card transition hover:-translate-y-0.5 disabled:opacity-50"
          type="submit"
          :disabled="loading.action || passwordsMismatch"
        >
          {{ loading.action ? 'Updating…' : 'Update password' }}
        </button>
      </form>
    </template>

    <EmptyState v-else text="Login to edit your profile." />
  </section>
</template>
