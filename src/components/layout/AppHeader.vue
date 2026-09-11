<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { Bars3Icon, ChevronDownIcon, ChevronRightIcon, UserCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import { useAppNavigation } from '@/composables/useAppNavigation'
const emit = defineEmits<{ 'open-navigation': [] }>()
const auth = useAuthStore()
const router = useRouter()
const { isAdminSpace, pageTitle } = useAppNavigation()
function handleLogout() { auth.logout(); router.push('/login') }
</script>

<template>
  <header class="app-topbar">
    <div class="app-topbar-location"><button type="button" class="app-nav-toggle" aria-label="Open workspace navigation" @click="emit('open-navigation')"><Bars3Icon /></button><span class="app-breadcrumb-root">{{ isAdminSpace ? 'Administration' : 'Workspace' }}</span><ChevronRightIcon class="app-breadcrumb-chevron" /><span class="app-page-label">{{ pageTitle }}</span></div>
    <Menu v-if="auth.isAuthenticated" as="div" class="app-account-menu">
      <MenuButton class="app-account-button"><span class="app-avatar"><img v-if="auth.member?.profile?.photo_url" :src="auth.member.profile.photo_url" alt="" /><UserCircleIcon v-else /></span><span class="app-account-name">{{ auth.member?.profile?.full_name || 'My account' }}</span><ChevronDownIcon class="app-account-chevron" /><span class="sr-only">Open account menu</span></MenuButton>
      <MenuItems class="app-account-items"><MenuItem v-slot="{ active }"><RouterLink to="/profile" :class="{ 'account-active': active }"><UserCircleIcon />My profile</RouterLink></MenuItem><MenuItem v-slot="{ active }"><RouterLink to="/settings" :class="{ 'account-active': active }"><Cog6ToothIcon />Settings</RouterLink></MenuItem><MenuItem v-slot="{ active }"><button type="button" :class="{ 'account-active': active }" @click="handleLogout"><ArrowRightOnRectangleIcon />Sign out</button></MenuItem></MenuItems>
    </Menu>
    <RouterLink v-else to="/login" class="app-sign-in">Sign in</RouterLink>
  </header>
</template>

<style scoped>
.app-topbar { min-height: 68px; padding: 12px 32px; border-bottom: 1px solid #e6eaf0; background: #fff; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.app-topbar-location { display: flex; align-items: center; gap: 12px; font-size: 12px; min-width: 0; }
.app-breadcrumb-root { color: #8a94a3; }
.app-breadcrumb-chevron { width: 13px; height: 13px; color: #b1b9c4; }
.app-page-label { color: #344054; font-weight: 550; }
.app-nav-toggle { display: none; color: #536073; padding: 8px; margin-left: -8px; }
.app-nav-toggle svg { width: 22px; height: 22px; }
.app-account-menu { position: relative; }
.app-account-button { display: flex; align-items: center; gap: 9px; border-radius: 8px; padding: 4px; }
.app-avatar { display: grid; place-items: center; border-radius: 50%; width: 32px; height: 32px; background: #f0f3f6; overflow: hidden; flex-shrink: 0; }
.app-avatar img { width: 100%; height: 100%; object-fit: cover; }
.app-avatar svg { width: 25px; height: 25px; color: #97a3b1; }
.app-account-name { font-size: 12px; color: #475467; max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.app-account-chevron { width: 14px; height: 14px; color: #8590a0; }
.app-account-items { position: absolute; top: calc(100% + 10px); right: 0; width: 200px; background: #fff; border: 1px solid #e4e9ef; border-radius: 10px; padding: 5px; box-shadow: 0 10px 30px #1c2d4614; z-index: 45; }
.app-account-items a, .app-account-items button { display: flex; align-items: center; gap: 10px; padding: 10px; width: 100%; font-size: 13px; border-radius: 5px; color: #475467; }
.app-account-items svg { width: 17px; height: 17px; color: #84909e; }
.account-active { background: #f2f5f8; }
.app-sign-in { font-size: 13px; color: #087f80; }
button:focus-visible, a:focus-visible { outline: 2px solid #168c8c; outline-offset: 3px; }
@media (max-width: 1023px) { .app-nav-toggle { display: block; } }
@media (max-width: 640px) { .app-topbar { padding: 10px 20px; min-height: 62px; } .app-breadcrumb-root, .app-breadcrumb-chevron, .app-account-name { display: none; } .app-topbar-location { gap: 7px; } }
</style>
