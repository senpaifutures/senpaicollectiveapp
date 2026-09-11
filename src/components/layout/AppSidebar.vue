<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowUpRightIcon, ArrowLeftIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import { useAppNavigation } from '@/composables/useAppNavigation'
const auth = useAuthStore()
const { groups, accountItems, isAdminSpace, isActive } = useAppNavigation()
</script>

<template>
  <div class="app-sidebar-inner">
    <RouterLink to="/dashboard" class="app-brand" aria-label="SENPAI COLLECTIVE dashboard"><img src="/senpai_logo.svg" width="36" height="36" alt="" /><span>SENPAI<small>COLLECTIVE</small></span></RouterLink>
    <div class="app-space-switch">
      <span class="app-space-label">{{ isAdminSpace ? (auth.isAdmin ? 'Admin workspace' : 'Community review') : 'Member workspace' }}</span>
      <RouterLink v-if="isAdminSpace" to="/dashboard"><ArrowLeftIcon />Member view</RouterLink>
      <RouterLink v-else-if="auth.isAdmin || auth.isCommunityLead" :to="auth.isAdmin ? '/admin' : '/admin/applications'"><ShieldCheckIcon />{{ auth.isAdmin ? 'Admin workspace' : 'Review applications' }}</RouterLink>
    </div>
    <nav class="app-sidebar-nav" aria-label="Workspace navigation">
      <section v-for="group in groups" :key="group.label" class="app-nav-group"><h2>{{ group.label }}</h2><RouterLink v-for="item in group.items" :key="item.href" :to="item.href" :class="{ 'app-nav-active': isActive(item.href) }" :aria-current="isActive(item.href) ? 'page' : undefined"><component :is="item.icon" /><span>{{ item.name }}</span></RouterLink></section>
      <section class="app-nav-group"><h2>Account</h2><RouterLink v-for="item in accountItems" :key="item.href" :to="item.href" :class="{ 'app-nav-active': isActive(item.href) }" :aria-current="isActive(item.href) ? 'page' : undefined"><component :is="item.icon" /><span>{{ item.name }}</span></RouterLink></section>
    </nav>
    <RouterLink to="/" class="app-sidebar-footer">Visit the public site <ArrowUpRightIcon /></RouterLink>
  </div>
</template>

<style scoped>
.app-sidebar-inner { display: flex; flex-direction: column; min-height: 100%; background: #fff; color: #344054; }
.app-brand { display: flex; align-items: center; gap: 10px; padding: 23px 22px; color: #172b35; text-decoration: none; font-size: 21px; line-height: 1; font-weight: 800; letter-spacing: .2px; }
.app-brand img { width: 36px; height: 36px; flex-shrink: 0; object-fit: contain; }
.app-brand small { display: block; font-size: 10px; font-weight: 550; letter-spacing: 1.5px; margin-top: 4px; }
.app-space-switch { margin: 0 14px 10px; padding: 12px; background: #f6f8fa; border: 1px solid #e8ecf0; border-radius: 8px; }
.app-space-label { display: block; font-size: 12px; color: #475467; font-weight: 600; }
.app-space-switch a { display: flex; align-items: center; gap: 7px; font-size: 11px; color: #087f80; margin-top: 10px; }
.app-space-switch svg { width: 15px; height: 15px; }
.app-sidebar-nav { padding: 0 12px 18px; flex: 1; }
.app-nav-group { margin-top: 19px; }
.app-nav-group h2 { margin: 0 10px 8px; font-size: 10px; line-height: 1.5; font-weight: 600; letter-spacing: .8px; text-transform: uppercase; color: #8a94a3; }
.app-nav-group a { display: flex; align-items: center; gap: 10px; padding: 9px 10px; min-height: 38px; border-radius: 6px; color: #596579; font-size: 12px; line-height: 1.5; font-weight: 500; text-decoration: none; margin-block: 2px; }
.app-nav-group a svg { width: 18px; height: 18px; flex-shrink: 0; stroke-width: 1.6; color: #7f8b9a; }
.app-nav-group a:hover { color: #253443; background: #f4f6f8; }
.app-nav-group a.app-nav-active { color: #087b7c; background: #eaf7f6; font-weight: 650; }
.app-nav-group a.app-nav-active svg { color: #138d8d; }
.app-sidebar-footer { border-top: 1px solid #eaedf1; padding: 18px 22px; font-size: 11px; color: #84909e; display: flex; align-items: center; justify-content: space-between; }
.app-sidebar-footer svg { width: 15px; height: 15px; }
a:focus-visible { outline: 2px solid #168c8c; outline-offset: 2px; }
</style>
