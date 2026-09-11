<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useJobsStore } from '@/stores/jobs'
import AppLayout from '@/components/layout/AppLayout.vue'
import ApplicationCard from '@/components/member/ApplicationCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { DocumentTextIcon } from '@heroicons/vue/24/outline'

const jobsStore = useJobsStore()
const withdrawing = ref<string | null>(null)
const withdrawError = ref<string | null>(null)

onMounted(() => {
  jobsStore.fetchMyApplications()
})

async function handleWithdraw(applicationId: string) {
  if (withdrawing.value) return
  withdrawing.value = applicationId
  withdrawError.value = null

  const result = await jobsStore.withdrawApplication(applicationId)

  if (!result.success) {
    withdrawError.value = result.error || 'Failed to withdraw application'
  }

  withdrawing.value = null
}
</script>

<template>
  <AppLayout>
    <div class="my-applications-page max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="application-page-heading mb-8"><div>
        <h1 class="text-2xl font-bold text-gray-900">My Applications</h1>
        <p class="mt-1 text-gray-600">
          Follow your applications, proposals, and feedback.
        </p>
      </div><RouterLink to="/jobs" class="jobs-link">Browse jobs <span aria-hidden="true">↗</span></RouterLink></div>

      <!-- Error Alert -->
      <BaseAlert v-if="withdrawError" type="error" dismissible @dismiss="withdrawError = null" class="mb-6">
        {{ withdrawError }}
      </BaseAlert>

      <!-- Loading -->
      <div v-if="jobsStore.loading" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>

      <!-- Error State -->
      <div
        v-else-if="jobsStore.error"
        class="text-center py-12 bg-white rounded-lg"
      >
        <div class="text-red-500 mb-4">
          <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900">Error loading applications</h3>
        <p class="mt-2 text-gray-600">{{ jobsStore.error }}</p>
        <BaseButton variant="outline" class="mt-4" @click="jobsStore.fetchMyApplications">
          Try again
        </BaseButton>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="jobsStore.myApplications.length === 0"
        class="text-center py-12 bg-white rounded-lg"
      >
        <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-4 text-lg font-medium text-gray-900">No applications yet</h3>
        <p class="mt-2 text-gray-600">
          Browse the job board to find opportunities that match your skills.
        </p>
        <RouterLink class="jobs-link mt-4" to="/jobs">
          Browse Jobs
        </RouterLink>
      </div>

      <!-- Applications List -->
      <div v-else class="space-y-4">
        <ApplicationCard
          v-for="application in jobsStore.myApplications"
          :key="application.id"
          :application="application"
          :withdrawing="withdrawing === application.id"
          :disabled="!!withdrawing"
          @withdraw="handleWithdraw"
        />
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.my-applications-page { max-width: 1050px; }
.application-page-heading { display: flex; justify-content: space-between; gap: 20px; align-items: center; }
.application-page-heading p { font-size: 13px; color: #6b7c90; margin-top: 8px; }
.jobs-link { display: inline-flex; align-items: center; gap: 14px; background: #097d7e; color: #fff; padding: 10px 14px; border-radius: 7px; font-size: 12px; font-weight: 550; white-space: nowrap; }
.jobs-link:hover { background: #086869; }
@media (max-width: 640px) { .application-page-heading { align-items: flex-start; flex-direction: column; } }
</style>
