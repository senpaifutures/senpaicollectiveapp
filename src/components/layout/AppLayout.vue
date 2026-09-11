<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import MobileTabBar from './MobileTabBar.vue'
import '@/styles/workspace.css'

const route = useRoute()
const navigationOpen = ref(false)
watch(() => route.fullPath, () => { navigationOpen.value = false })
</script>

<template>
  <div class="workspace">
    <a class="workspace-skip" href="#workspace-content">Skip to content</a>
    <aside class="workspace-sidebar"><AppSidebar /></aside>
    <div class="workspace-body">
      <AppHeader @open-navigation="navigationOpen = true" />
      <main id="workspace-content" class="workspace-content" tabindex="-1"><slot /></main>
    </div>
    <MobileTabBar @open-navigation="navigationOpen = true" />
    <Dialog :open="navigationOpen" class="workspace-navigation-dialog" @close="navigationOpen = false">
      <div class="workspace-navigation-backdrop" aria-hidden="true" />
      <DialogPanel class="workspace-navigation-panel"><DialogTitle class="sr-only">Workspace navigation</DialogTitle><button type="button" class="workspace-navigation-close" aria-label="Close navigation" @click="navigationOpen = false"><XMarkIcon /></button><AppSidebar /></DialogPanel>
    </Dialog>
  </div>
</template>
