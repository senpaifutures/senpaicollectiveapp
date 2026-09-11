<script setup lang="ts">
import { RouterLink } from 'vue-router'
import PublicLayout from './PublicLayout.vue'

defineProps<{ eyebrow: string; jobLinks?: boolean }>()
</script>

<template>
  <PublicLayout>
    <div class="public-form-shell">
      <div class="public-form-context"><p>{{ eyebrow }}</p><nav v-if="jobLinks" aria-label="Job submissions"><RouterLink to="/submit-job">Post a job</RouterLink><RouterLink to="/job-status">Check status</RouterLink></nav></div>
      <div class="public-form-content"><slot /></div>
    </div>
  </PublicLayout>
</template>

<style scoped>
.public-form-shell { width: min(740px, calc(100% - 48px)); margin-inline: auto; padding-block: 44px 80px; }
.public-form-context { display: flex; justify-content: space-between; align-items: center; gap: 20px; border-bottom: 1px solid #d5dfd4; padding-bottom: 22px; margin-bottom: 32px; }
.public-form-context > p { font-size: 11px; letter-spacing: 1.4px; text-transform: uppercase; color: #5c785f; font-weight: 600; }
.public-form-context nav { display: flex; gap: 18px; font-size: 12px; color: #687965; }
.public-form-context .router-link-exact-active { color: #206853; text-decoration: underline; text-underline-offset: 5px; }
.public-form-content :deep(h1) { font-size: 42px; font-weight: 500; line-height: 1.15; letter-spacing: -1.6px; color: #213b2a; }
.public-form-content :deep(h2) { font-size: 21px; font-weight: 550; color: #2c4933; letter-spacing: -.4px; padding-bottom: 16px; border-color: #d5dfd4; }
.public-form-content :deep(p) { line-height: 1.8; }
.public-form-content :deep(.text-center.mb-8) { text-align: left; margin-bottom: 30px; }
.public-form-content :deep(.text-center.mb-8 > svg) { margin-left: 0; width: 38px; height: 38px; padding: 8px; background: #e3eedc; color: #3b7451; border: 1px solid #cbddc0; }
.public-form-content :deep(.text-center.mb-8 > p) { margin-left: 0; font-size: 15px; max-width: 590px; margin-top: 16px; }
.public-form-content :deep(.bg-white.shadow-sm) { border: 1px solid #d5dfd4; border-radius: 3px; box-shadow: none; }
.public-form-content :deep(form.bg-white) { padding: 34px; }
.public-form-content :deep(input:not([type='checkbox'])), .public-form-content :deep(textarea), .public-form-content :deep(select), .public-form-content :deep(button[aria-haspopup='listbox']) { min-height: 49px; border-radius: 3px; font-size: 16px; background: #fcfdf9; padding-top: 12px; padding-bottom: 12px; }
.public-form-content :deep(.border-gray-300) { border-color: #c6d3c5; }
.public-form-content :deep(label) { font-size: 14px; line-height: 1.7; color: #36513c; }
.public-form-content :deep(input::placeholder), .public-form-content :deep(textarea::placeholder) { color: #889386; }
.public-form-content :deep(input:focus), .public-form-content :deep(textarea:focus) { --tw-ring-color: #328467; border-color: #328467; }
.public-form-content :deep(button[type='submit']), .public-form-content :deep(a.bg-gray-900), .public-form-content :deep(a.bg-senpai-600) { min-height: 50px; border-radius: 2px; border: 1px solid #242828; color: #fff; background: #242828; padding: 13px 22px; font-size: 14px; font-weight: 550; }
.public-form-content :deep(button[type='submit']:hover) { background: #383e3e; }
.public-form-content :deep(.bg-gray-50) { background: #f0f4eb; border-radius: 2px; }
.public-form-content :deep(.text-green-500) { color: #358366; }
@media (max-width: 640px) { .public-form-shell { width: calc(100% - 40px); padding-block: 30px 56px; } .public-form-context { flex-wrap: wrap; gap: 14px; margin-bottom: 28px; } .public-form-content :deep(h1) { font-size: 35px; letter-spacing: -1.2px; } .public-form-content :deep(form.bg-white) { padding: 24px 20px; } }
</style>
