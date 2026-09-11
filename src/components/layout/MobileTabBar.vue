<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { HomeIcon, ClipboardDocumentListIcon, RocketLaunchIcon, UsersIcon, Bars3Icon, ClipboardDocumentCheckIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import { useAppNavigation } from '@/composables/useAppNavigation'
const emit = defineEmits<{ 'open-navigation': [] }>()
const auth = useAuthStore()
const { isAdminSpace, isActive } = useAppNavigation()
const tabs = computed(() => {
  if (isAdminSpace.value && auth.isAdmin) return [
    { name: 'Overview', href: '/admin', icon: HomeIcon },
    { name: 'Applications', href: '/admin/applications', icon: ClipboardDocumentCheckIcon },
    { name: 'Members', href: '/admin/members', icon: UsersIcon },
    { name: 'Tasks', href: '/admin/tasks', icon: ClipboardDocumentListIcon },
  ]
  if (isAdminSpace.value && auth.isCommunityLead) return [{ name: 'Applications', href: '/admin/applications', icon: ClipboardDocumentCheckIcon }]
  return [
    { name: 'Overview', href: '/dashboard', icon: HomeIcon },
    ...(auth.isApproved ? [
      { name: 'Tasks', href: '/tasks', icon: ClipboardDocumentListIcon },
      { name: 'Projects', href: '/projects', icon: RocketLaunchIcon },
      { name: 'People', href: '/members', icon: UsersIcon },
    ] : []),
  ]
})
</script>

<template>
  <nav v-if="auth.isAuthenticated" class="app-mobile-tabs" aria-label="Quick navigation">
    <RouterLink v-for="tab in tabs" :key="tab.href" :to="tab.href" :class="{ 'mobile-tab-active': isActive(tab.href) }" :aria-current="isActive(tab.href) ? 'page' : undefined"><component :is="tab.icon" /><span>{{ tab.name }}</span></RouterLink>
    <button type="button" @click="emit('open-navigation')" aria-label="Open all workspace navigation"><Bars3Icon /><span>More</span></button>
  </nav>
</template>

<style scoped>
.app-mobile-tabs { position: fixed; bottom: 0; inset-inline: 0; z-index: 35; display: flex; padding-bottom: env(safe-area-inset-bottom); background: #fff; border-top: 1px solid #e6eaf0; }
.app-mobile-tabs a, .app-mobile-tabs button { flex: 1; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 4px; min-height: 62px; color: #84909f; font-size: 10px; font-weight: 550; }
.app-mobile-tabs svg { width: 21px; height: 21px; stroke-width: 1.6; }
.app-mobile-tabs .mobile-tab-active { color: #0a8585; background: #f2fbfa; }
@media (min-width: 1024px) { .app-mobile-tabs { display: none; } }
</style>
