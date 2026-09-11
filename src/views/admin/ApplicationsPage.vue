<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'
import { ClipboardDocumentCheckIcon, CheckCircleIcon, EnvelopeIcon } from '@heroicons/vue/24/outline'


const adminStore = useAdminStore()

const tab = ref<'pending' | 'declined'>('pending')
const currentPage = ref(1)
function loadTab(page = 1) {
  currentPage.value = page
  return adminStore.fetchApplications({ status: tab.value, limit: 24, offset: (page - 1) * 24 })
}
onMounted(loadTab)

function initials(name: string) {
  const parts = (name || '').trim().split(/\s+/)
  return parts.length > 1 ? ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase() : parts[0]?.slice(0, 2).toUpperCase() || '?'
}

// ---- quick approve/decline right from the card ----
const busyId = ref<string | null>(null)
const toast = ref('')
let toastTimer: ReturnType<typeof setTimeout> | undefined
onUnmounted(() => clearTimeout(toastTimer))
function flash(msg: string) {
  clearTimeout(toastTimer)
  toast.value = msg
  toastTimer = setTimeout(() => (toast.value = ''), 2500)
}
async function approve(id: string, name?: string) {
  if (!confirm(`Approve ${name || 'this applicant'}? They'll receive an approval email.`)) return
  busyId.value = id
  try {
    const res = await adminStore.approveApplication(id)
    flash(res.success ? 'Approved' : res.error || 'Failed to approve')
  } finally {
    busyId.value = null
  }
}
async function decline(id: string, name?: string) {
  const reason = prompt(`Decline ${name || 'this applicant'} — reason (sent in their email, optional):`)
  if (reason === null) return
  busyId.value = id
  try {
    const res = await adminStore.declineApplication(id, reason || 'Not specified')
    flash(res.success ? 'Declined' : res.error || 'Failed to decline')
  } finally {
    busyId.value = null
  }
}
</script>

<template>
  <AdminLayout>
    <div class="applications-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-6">
        <p class="applications-eyebrow">Membership review</p>
        <h1 class="text-2xl font-bold text-gray-900 mt-1">Applications</h1>
        <p class="mt-1 text-gray-600">
          Get to know the people applying to build with the collective.
        </p>
      </div>

      <!-- Tabs -->
      <div class="application-status-tabs mb-6 flex gap-1 border-b border-gray-200" role="group" aria-label="Application status">
        <button
          class="px-3 py-2 text-sm font-medium border-b-2 transition-colors"
          :class="tab === 'pending' ? 'border-senpai-600 text-senpai-700' : 'border-transparent text-gray-500 hover:text-gray-700'"
          :aria-pressed="tab === 'pending'" @click="tab = 'pending'; loadTab()"
        >
          Pending
        </button>
        <button
          class="px-3 py-2 text-sm font-medium border-b-2 transition-colors"
          :class="tab === 'declined' ? 'border-senpai-600 text-senpai-700' : 'border-transparent text-gray-500 hover:text-gray-700'"
          :aria-pressed="tab === 'declined'" @click="tab = 'declined'; loadTab()"
        >
          Declined
        </button>
      </div>

      <!-- Loading -->
      <div v-if="adminStore.applicationsLoading" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>

      <BaseAlert v-else-if="adminStore.error" type="error" class="mb-6">{{ adminStore.error }} <button type="button" class="underline ml-2" @click="loadTab(currentPage)">Try again</button></BaseAlert>

      <!-- Empty State -->
      <div
        v-else-if="adminStore.applications.length === 0"
        class="text-center py-12 bg-white rounded-2xl border border-gray-200"
      >
        <ClipboardDocumentCheckIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-4 text-lg font-medium text-gray-900">{{ tab === 'pending' ? 'No pending applications' : 'No declined applications' }}</h3>
        <p class="mt-2 text-gray-600">
          {{ tab === 'pending' ? 'All applications have been reviewed!' : 'Nobody has been turned down yet.' }}
        </p>
      </div>

      <!-- Applications Grid -->
      <template v-else>
        <p v-if="adminStore.applicationsPagination" class="application-result-count">{{ adminStore.applicationsPagination.total }} {{ tab }} applications</p>
        <div class="membership-applications-grid">
          <div
            v-for="app in adminStore.applications"
            :key="app.id"
            class="membership-application-card"
          >
            <div class="membership-card-heading">
              <div class="flex items-center gap-3 min-w-0">
                <span class="membership-applicant-photo">
                  <img v-if="app.profile.photo_url" :src="app.profile.photo_url" :alt="app.profile.full_name" class="h-full w-full object-cover" />
                  <span v-else class="h-full w-full flex items-center justify-center text-sm font-medium text-gray-500">{{ initials(app.profile.full_name) }}</span>
                </span>
                <div class="min-w-0">
                  <RouterLink :to="`/admin/applications/${app.id}`" class="membership-applicant-name">{{ app.profile.full_name }}</RouterLink>
                  <p class="text-sm text-gray-500 truncate">{{ app.email }}</p>
                </div>
              </div>
              <span v-if="tab === 'pending'" class="application-email-status inline-flex items-center gap-1 text-[11px] shrink-0" :class="app.email_verified ? 'text-senpai-700' : 'text-gray-400'">
                <CheckCircleIcon v-if="app.email_verified" class="h-3.5 w-3.5" />
                <EnvelopeIcon v-else class="h-3.5 w-3.5" />
                {{ app.email_verified ? 'Email verified' : 'Email unverified' }}
              </span>
              <span v-else class="application-email-status text-[11px] text-red-500 shrink-0">Declined</span>
            </div>

            <div class="space-y-1 text-sm text-gray-600 mb-4">
              <p>{{ app.profile.primary_skill?.name || 'Primary skill not specified' }}</p>
              <p class="text-gray-400">{{ app.profile.city }}, {{ app.profile.country }}</p>
              <p class="font-mono text-xs text-gray-400">Applied {{ new Date(app.created_at).toLocaleDateString() }}</p>
              <p v-if="app.referred_by_scout_name" class="inline-flex items-center gap-1.5 text-amber-700">
                <span class="h-4 w-4 rounded-full overflow-hidden shrink-0 bg-amber-100">
                  <img v-if="app.referred_by_scout_photo_url" :src="app.referred_by_scout_photo_url" :alt="app.referred_by_scout_name" class="h-full w-full object-cover" />
                  <span v-else class="h-full w-full flex items-center justify-center text-[8px] font-medium text-amber-700">{{ initials(app.referred_by_scout_name) }}</span>
                </span>
                Referred by {{ app.referred_by_scout_name }}
              </p>
              <p v-if="tab === 'declined' && app.decline_reason" class="text-gray-500 italic">"{{ app.decline_reason }}"</p>
            </div>

            <div class="membership-card-actions">
              <template v-if="tab === 'pending'">
                <button class="text-senpai-600 hover:text-senpai-700 disabled:opacity-50" :disabled="busyId !== null" @click="approve(app.id, app.profile.full_name)">Approve</button>
                <button class="text-red-600 hover:text-red-700 disabled:opacity-50" :disabled="busyId !== null" @click="decline(app.id, app.profile.full_name)">Decline</button>
              </template>
              <RouterLink :to="`/admin/applications/${app.id}`" class="membership-review-link">Review application →</RouterLink>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div
          v-if="adminStore.applicationsPagination && adminStore.applicationsPagination.total_pages > 1"
          class="mt-4 bg-white rounded-2xl border border-gray-200 px-5 py-3 flex items-center justify-between"
        >
          <p class="text-sm text-gray-500">
            Page {{ adminStore.applicationsPagination.current_page }} of {{ adminStore.applicationsPagination.total_pages }}
          </p>
          <div class="flex gap-2">
            <BaseButton
              variant="outline"
              size="sm"
              :disabled="!adminStore.applicationsPagination.has_prev || adminStore.applicationsLoading"
              @click="loadTab(currentPage - 1)"
            >
              Previous
            </BaseButton>
            <BaseButton
              variant="outline"
              size="sm"
              :disabled="!adminStore.applicationsPagination.has_next || adminStore.applicationsLoading"
              @click="loadTab(currentPage + 1)"
            >
              Next
            </BaseButton>
          </div>
        </div>
      </template>
    </div>

    <transition enter-from-class="opacity-0 translate-y-2" enter-active-class="transition duration-200" leave-active-class="transition duration-200" leave-to-class="opacity-0 translate-y-2">
      <div v-if="toast" role="status" class="application-toast fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-4 py-2 rounded-full shadow-lg z-50">{{ toast }}</div>
    </transition>
  </AdminLayout>
</template>

<style scoped>
.applications-eyebrow { color: #627b8b; font-size: 11px; margin-bottom: 7px; }
.applications-page > .mb-6 > p.mt-1 { font-size: 13px; color: #6d7f92; margin-top: 8px; }
.application-status-tabs button { padding: 12px 18px; font-size: 12px; }
.application-result-count { font-size: 12px; color: #6c7e92; margin-bottom: 18px; }
.membership-applications-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr)); gap: 18px; }
.membership-application-card { display: flex; flex-direction: column; background: #fff; border: 1px solid #e3e9ef; border-radius: 11px; padding: 22px; min-width: 0; }
.membership-card-heading { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 14px; margin-bottom: 20px; }
.membership-card-heading > .flex { flex-basis: 100%; }
.membership-applicant-photo { display: block; width: 48px; height: 48px; flex: 0 0 48px; border-radius: 12px; overflow: hidden; background: #edf3f6; }
.membership-applicant-name { font-size: 14px; font-weight: 650; line-height: 1.5; overflow-wrap: anywhere; }
.membership-applicant-name:hover { color: #087d7e; text-decoration: underline; text-underline-offset: 3px; }
.membership-card-heading .text-sm { font-size: 11px; margin-top: 3px; }
.application-email-status { padding: 4px 7px; border-radius: 5px; background: #f5f8fa; font-size: 10px; }
.membership-application-card > .space-y-1 { font-size: 12px; line-height: 1.8; }
.membership-application-card .font-mono { font-family: inherit; font-size: 10px; }
.membership-card-actions { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; margin-top: auto; padding-top: 18px; border-top: 1px solid #edf0f4; font-size: 11px; font-weight: 550; }
.membership-card-actions button { padding-block: 5px; }
.membership-review-link { display: block; flex-basis: 100%; order: -1; padding: 9px 12px; text-align: center; background: #f0f8f8; color: #107c7e; border: 1px solid #d7e9e8; border-radius: 7px; font-size: 12px; }
.membership-review-link:hover { background: #e3f3f2; }
@media (max-width: 1023px) { .application-toast { bottom: calc(80px + env(safe-area-inset-bottom)); max-width: calc(100% - 40px); } }
</style>
