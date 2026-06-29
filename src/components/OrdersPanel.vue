<script setup>
import { useShop } from '../store/shop';
import SectionHead from './SectionHead.vue';
import EmptyState from './EmptyState.vue';

const { isLoggedIn, orders, money } = useShop();
</script>

<template>
  <section>
    <SectionHead eyebrow="History" title="Orders" />

    <EmptyState v-if="!isLoggedIn" text="Login to view orders." />
    <EmptyState v-else-if="!orders.length" text="No orders yet." />

    <div v-else class="space-y-3">
      <article
        v-for="order in orders"
        :key="order.id"
        class="flex flex-wrap items-center justify-between gap-4 rounded-xl2 bg-white p-4 border border-ink-900/12 shadow-card"
      >
        <div>
          <strong class="font-display text-sm">{{ order.order_number }}</strong>
          <p class="mt-1 text-sm text-ink-700">{{ order.created_at?.slice(0, 10) }}</p>
        </div>
        <span class="rounded-full bg-surface-100 px-3 py-1 text-xs font-bold uppercase border border-ink-900/12">{{ order.status }}</span>
        <strong class="font-display text-sm">{{ money(order.total) }}</strong>
        <p class="text-sm text-ink-700">{{ order.items?.length || 0 }} item(s)</p>
      </article>
    </div>
  </section>
</template>
