<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AppLayout from './AppLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

// Admin pages share the app navigation and a contextual return link.
interface Props {
  backTo?: string
  backLabel?: string
}
const props = withDefaults(defineProps<Props>(), {
  backTo: undefined,
  backLabel: 'Back to Overview'
})

const route = useRoute()
const authStore = useAuthStore()

// Full admins land back on the Overview dashboard; a community lead has no
// access to that page, so their "back" goes to the one tab they own.
const backTo = computed(() => props.backTo ?? (authStore.isAdmin ? '/admin' : '/admin/applications'))

</script>

<template>
  <AppLayout>
    <div v-if="route.path !== backTo" class="admin-back-link">
      <RouterLink :to="backTo" class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeftIcon class="h-4 w-4 mr-1" />
        {{ props.backLabel }}
      </RouterLink>
    </div>
    <slot />
  </AppLayout>
</template>

<style scoped>
.admin-back-link { width: min(1320px, 100%); margin-inline: auto; padding: 22px 32px 0; }
.admin-back-link a { font-size: 12px; color: #758194; }
@media (max-width: 640px) { .admin-back-link { padding: 20px 20px 0; } }
</style>
