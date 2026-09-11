<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { jobsApi } from '@/api'
import type { Job } from '@/types'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'
import {
  UsersIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

const adminStore = useAdminStore()

// Pending jobs state
const pendingJobs = ref<Job[]>([])
const pendingJobsLoading = ref(false)
const pendingJobsError = ref(false)
const pendingJobsCount = ref(0)
const approving = ref<string | null>(null)
const rejecting = ref<string | null>(null)

async function fetchPendingJobs() {
  pendingJobsLoading.value = true
  pendingJobsError.value = false
  try {
    const response = await jobsApi.getPendingJobs(5, 0)
    if (response.status && response.data) {
      pendingJobs.value = response.data
      pendingJobsCount.value = response.pagination?.total || response.data.length
    }
    if (!response.status) pendingJobsError.value = true
  } catch (e) {
    pendingJobsError.value = true
    console.error('Failed to fetch pending jobs:', e)
  } finally {
    pendingJobsLoading.value = false
  }
}

async function approveJob(jobId: string) {
  approving.value = jobId
  try {
    const response = await jobsApi.approveJob(jobId)
    if (response.status) {
      pendingJobs.value = pendingJobs.value.filter(j => j.id !== jobId)
      pendingJobsCount.value = Math.max(0, pendingJobsCount.value - 1)
    }
  } catch (e) {
    console.error('Failed to approve job:', e)
  } finally {
    approving.value = null
  }
}

async function rejectJob(jobId: string) {
  const reason = prompt('Please provide a reason for rejection:')
  if (!reason) return

  rejecting.value = jobId
  try {
    const response = await jobsApi.rejectJob(jobId, reason)
    if (response.status) {
      pendingJobs.value = pendingJobs.value.filter(j => j.id !== jobId)
      pendingJobsCount.value = Math.max(0, pendingJobsCount.value - 1)
    }
  } catch (e) {
    console.error('Failed to reject job:', e)
  } finally {
    rejecting.value = null
  }
}

onMounted(() => {
  adminStore.fetchStatistics()
  adminStore.fetchApplications({ limit: 5 })
  fetchPendingJobs()
})

const statCards = [
  { name: 'Total Members', key: 'total_members', icon: UsersIcon, color: 'bg-blue-500', href: '/admin/members' },
  { name: 'Approved', key: 'approved_members', icon: UserGroupIcon, color: 'bg-green-500', href: '/admin/members' },
  { name: 'Pending Applications', key: 'pending_applications', icon: ClipboardDocumentCheckIcon, color: 'bg-yellow-500', href: '/admin/applications' },
  { name: 'Pending Jobs', key: 'pending_jobs', icon: BriefcaseIcon, color: 'bg-orange-500', usePendingJobsCount: true, href: '/admin/jobs' }
]
</script>

<template>
  <AdminLayout>
    <div class="admin-dashboard max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="admin-overview-heading">
        <div><h1>Collective overview</h1><p>Keep people moving and work progressing.</p></div>
        <RouterLink to="/admin/applications" class="admin-review-button">Review applications <ArrowRightIcon /></RouterLink>
      </div>
      <BaseAlert v-if="adminStore.error" type="error" class="mb-6">{{ adminStore.error }}</BaseAlert>

      <!-- Loading -->
      <div v-if="adminStore.statsLoading" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>

      <template v-else>
        <!-- Stats Cards -->
        <div class="admin-metrics">
          <RouterLink
            v-for="stat in statCards"
            :key="stat.key"
            :to="stat.href"
            class="admin-metric"
          >
            <div class="admin-metric-top"><p>{{ stat.name }}</p><component :is="stat.icon" /></div>
            <p class="admin-metric-value">{{ stat.usePendingJobsCount ? (pendingJobsLoading || pendingJobsError ? '—' : pendingJobsCount) : (adminStore.stats?.[stat.key as keyof typeof adminStore.stats] ?? '—') }}</p>
            <span class="admin-metric-link">{{ stat.usePendingJobsCount || stat.key === 'pending_applications' ? 'Review queue' : 'View members' }} <ArrowRightIcon /></span>
          </RouterLink>
        </div>

        <!-- Pending Items -->
        <div class="admin-review-queues grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <!-- Pending Applications -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900">Applications to review</h2>
                <RouterLink to="/admin/applications" class="text-sm text-indigo-600 hover:text-indigo-500">
                  View all
                </RouterLink>
              </div>
            </div>

            <div v-if="adminStore.applicationsLoading" class="p-6 flex justify-center">
              <LoadingSpinner />
            </div>

            <div v-else-if="adminStore.applications.length === 0" class="p-6 text-center text-gray-500">
              No pending applications
            </div>

            <ul v-else class="divide-y divide-gray-200">
              <li
                v-for="app in adminStore.applications.slice(0, 5)"
                :key="app.id"
                class="p-4 hover:bg-gray-50"
              >
                <RouterLink :to="`/admin/applications/${app.id}`" class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-gray-900">{{ app.profile.full_name }}</p>
                    <p class="text-sm text-gray-500">
                      {{ app.profile.primary_skill?.name }} · {{ app.profile.city }}, {{ app.profile.country }}
                    </p>
                  </div>
                  <span class="text-xs text-gray-400">
                    {{ new Date(app.created_at).toLocaleDateString() }}
                  </span>
                </RouterLink>
              </li>
            </ul>
          </div>

          <!-- Jobs to review -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900">Jobs to review</h2>
                <RouterLink to="/admin/jobs" class="text-sm text-indigo-600 hover:text-indigo-500">
                  View all
                </RouterLink>
              </div>
            </div>

            <div v-if="pendingJobsLoading" class="p-6 flex justify-center">
              <LoadingSpinner />
            </div>

            <div v-else-if="pendingJobsError" class="p-6 text-sm text-gray-500" role="alert">Job submissions couldn’t be loaded. <button type="button" class="text-senpai-600 font-medium" @click="fetchPendingJobs">Try again</button></div>

            <div v-else-if="pendingJobs.length === 0" class="p-6 text-center text-gray-500">
              No pending job submissions
            </div>

            <ul v-else class="divide-y divide-gray-200">
              <li
                v-for="job in pendingJobs"
                :key="job.id"
                class="p-4 hover:bg-gray-50"
              >
                <div class="flex items-center justify-between">
                  <RouterLink :to="`/admin/jobs/${job.id}`" class="flex-1 min-w-0">
                    <p class="font-medium text-gray-900 truncate">{{ job.title }}</p>
                    <p class="text-sm text-gray-500">
                      {{ job.company_name }} · {{ job.contact_email }}
                    </p>
                  </RouterLink>
                  <div class="flex items-center gap-2 ml-4">
                    <button
                      @click.prevent="approveJob(job.id)"
                      :disabled="approving === job.id"
                      class="p-1.5 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                      title="Approve"
                    >
                      <CheckCircleIcon class="h-5 w-5" />
                    </button>
                    <button
                      @click.prevent="rejectJob(job.id)"
                      :disabled="rejecting === job.id"
                      class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                      title="Reject"
                    >
                      <XCircleIcon class="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Manage the collective -->
        <div class="admin-quick-actions bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Manage the collective</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <RouterLink
              to="/admin/applications"
              class="flex items-center p-3 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
            >
              <ClipboardDocumentCheckIcon class="h-6 w-6 text-indigo-600 mr-3" />
              <div>
                <p class="font-medium text-gray-900">Review Applications</p>
                <p class="text-sm text-gray-500">{{ adminStore.stats?.pending_applications || 0 }} pending</p>
              </div>
            </RouterLink>

            <RouterLink
              to="/admin/jobs"
              class="flex items-center p-3 rounded-lg border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-colors"
            >
              <BriefcaseIcon class="h-6 w-6 text-orange-600 mr-3" />
              <div>
                <p class="font-medium text-gray-900">Manage Jobs</p>
                <p class="text-sm text-gray-500">{{ pendingJobsCount }} pending</p>
              </div>
            </RouterLink>

            <RouterLink
              to="/admin/members"
              class="flex items-center p-3 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
            >
              <UsersIcon class="h-6 w-6 text-indigo-600 mr-3" />
              <div>
                <p class="font-medium text-gray-900">Manage Members</p>
                <p class="text-sm text-gray-500">View and manage</p>
              </div>
            </RouterLink>

            <RouterLink
              to="/admin/analytics"
              class="flex items-center p-3 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
            >
              <ChartBarIcon class="h-6 w-6 text-indigo-600 mr-3" />
              <div>
                <p class="font-medium text-gray-900">View Analytics</p>
                <p class="text-sm text-gray-500">Skills & locations</p>
              </div>
            </RouterLink>
          </div>
        </div>

        <!-- Growth Stats -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900">Approval Rate</h2>
              <ArrowTrendingUpIcon class="h-5 w-5 text-green-500" />
            </div>
            <p class="text-3xl font-bold text-gray-900">
              {{ adminStore.stats ? `${adminStore.stats.approval_rate.toFixed(0)}%` : '—' }}
            </p>
            <p class="text-sm text-gray-500 mt-1">
              of applications are approved
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900">Growth This Month</h2>
              <ChartBarIcon class="h-5 w-5 text-indigo-500" />
            </div>
            <p class="text-3xl font-bold text-gray-900">
              {{ adminStore.stats ? `+${adminStore.stats.growth_this_month}` : '—' }}
            </p>
            <p class="text-sm text-gray-500 mt-1">
              new members joined
            </p>
          </div>
        </div>
      </template>
    </div>
  </AdminLayout>
</template>

<style scoped>
.admin-overview-heading { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-bottom: 28px; }
.admin-overview-heading p { font-size: 13px; color: #84909e; margin-top: 8px; }
.admin-review-button { display: inline-flex; align-items: center; justify-content: center; gap: 12px; background: #097d7e; color: #fff; padding: 11px 16px; border-radius: 7px; font-size: 12px; font-weight: 600; }
.admin-review-button:hover { background: #086869; }
.admin-review-button svg { width: 16px; height: 16px; }
.admin-metrics { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; margin-bottom: 28px; }
.admin-metric { padding: 20px; border: 1px solid #e5eaf0; background: #fff; border-radius: 10px; }
.admin-metric:hover { border-color: #abd4d5; }
.admin-metric-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.admin-metric-top p { color: #758195; font-size: 11px; }
.admin-metric-top svg { width: 18px; height: 18px; color: #8f9fae; flex-shrink: 0; }
.admin-metric-value { font-size: 32px; line-height: 1.4; font-weight: 650; letter-spacing: -.8px; color: #253349; margin-block: 12px 14px; }
.admin-metric-link { display: flex; align-items: center; gap: 6px; font-size: 10px; color: #188888; }
.admin-metric-link svg { width: 12px; height: 12px; }
.admin-dashboard h2 { font-size: 14px; font-weight: 650; }
.admin-review-queues > div > .p-6:first-child { padding: 20px 24px; }
.admin-review-queues li { padding: 18px 24px; }
.admin-review-queues li .font-medium { font-size: 13px; }
.admin-review-queues li .text-sm { font-size: 11px; line-height: 1.8; }
.admin-review-queues li .text-xs { font-size: 10px; }
.admin-review-queues .text-center { padding-block: 40px; font-size: 13px; }
.admin-review-queues button { min-width: 36px; min-height: 36px; display: grid; place-items: center; }
.admin-quick-actions a { padding: 14px; }
.admin-quick-actions a > svg { width: 22px; height: 22px; flex-shrink: 0; color: #6a8c9c; }
.admin-quick-actions a .font-medium { font-size: 12px; }
.admin-quick-actions a .text-sm { font-size: 11px; margin-top: 3px; }
@media (max-width: 1199px) { .admin-metrics { grid-template-columns: 1fr 1fr; } }
@media (max-width: 640px) { .admin-overview-heading { flex-direction: column; align-items: flex-start; gap: 18px; } .admin-metrics { gap: 10px; } .admin-metric { padding: 16px; } .admin-metric-value { font-size: 28px; } .admin-review-queues li { padding-inline: 18px; } }
</style>
