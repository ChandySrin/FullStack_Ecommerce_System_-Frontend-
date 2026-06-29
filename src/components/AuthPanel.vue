<script setup>
import { useShop } from '../store/shop';

const { authMode, authForm, loading, submitAuth } = useShop();
</script>

<template>
  <section class="mx-auto max-w-md rounded-xl2 bg-white p-6 border border-ink-900/12 shadow-card sm:p-8">
    <div class="mb-6 flex rounded-full bg-surface-100 p-1 border border-ink-900/12">
      <button
        class="flex-1 rounded-full py-2 text-sm font-bold transition"
        :class="authMode === 'login' ? 'bg-primary-900 text-surface-50' : 'text-ink-700'"
        @click="authMode = 'login'"
      >
        Login
      </button>
      <button
        class="flex-1 rounded-full py-2 text-sm font-bold transition"
        :class="authMode === 'register' ? 'bg-primary-900 text-surface-50' : 'text-ink-700'"
        @click="authMode = 'register'"
      >
        Register
      </button>
    </div>

    <form class="space-y-4" @submit.prevent="submitAuth">
      <label v-if="authMode === 'register'" class="block text-xs font-bold uppercase tracking-wide text-ink-700">
        Name
        <input
          v-model="authForm.name"
          type="text"
          required
          autocomplete="off"
          class="mt-1.5 w-full rounded-lg bg-surface-100 px-3 py-2.5 border border-ink-900/12 text-sm outline-none"
        />
      </label>

      <label class="block text-xs font-bold uppercase tracking-wide text-ink-700">
        Email
        <input
          v-model="authForm.email"
          type="email"
          required
          autocomplete="off"
          class="mt-1.5 w-full rounded-lg bg-surface-100 px-3 py-2.5 border border-ink-900/12 text-sm outline-none"
        />
      </label>

      <label class="block text-xs font-bold uppercase tracking-wide text-ink-700">
        Password
        <input
          v-model="authForm.password"
          type="password"
          required
          class="mt-1.5 w-full rounded-lg bg-surface-100 px-3 py-2.5 border border-ink-900/12 text-sm outline-none"
        />
      </label>

      <label v-if="authMode === 'register'" class="block text-xs font-bold uppercase tracking-wide text-ink-700">
        Confirm Password
        <input
          v-model="authForm.password_confirmation"
          type="password"
          required
          class="mt-1.5 w-full rounded-lg bg-surface-100 px-3 py-2.5 border border-ink-900/12 text-sm outline-none"
        />
      </label>

      <button
        class="w-full rounded-full bg-primary-900 py-3 text-sm font-bold text-surface-50 border border-ink-900/12 shadow-card transition hover:-translate-y-0.5 disabled:opacity-50"
        type="submit"
        :disabled="loading.action"
      >
        {{ authMode === 'login' ? 'Login' : 'Create account' }}
      </button>
    </form>
  </section>
</template>
