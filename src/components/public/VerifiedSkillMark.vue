<script setup lang="ts">
import { CheckBadgeIcon } from '@heroicons/vue/24/solid'

defineProps<{ skill: string }>()
</script>

<template>
  <span class="verified-skill-mark">
    <CheckBadgeIcon aria-hidden="true" />
    <span><strong>SENPAI VERIFIED</strong><span>{{ skill }}</span></span>
  </span>
</template>

<style scoped>
.verified-skill-mark { display: inline-flex; align-items: center; gap: 12px; padding: 13px 16px; background: #242828; color: #fff; border: 1px solid #414949; text-align: left; }
.verified-skill-mark > svg { width: 30px; height: 30px; color: #41c0bf; flex-shrink: 0; }
.verified-skill-mark strong { display: block; font-size: 10px; letter-spacing: 1.4px; line-height: 1.6; font-weight: 650; }
.verified-skill-mark > span > span { display: block; font-size: 13px; line-height: 1.5; color: #d0dada; margin-top: 3px; }
</style>
