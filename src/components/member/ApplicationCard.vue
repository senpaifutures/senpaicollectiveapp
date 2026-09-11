<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { JobApplication } from '@/types'
import BaseButton from '@/components/common/BaseButton.vue'
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  StarIcon
} from '@heroicons/vue/24/outline'

interface Props {
  application: JobApplication
  showWithdraw?: boolean
  withdrawing?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showWithdraw: true,
  withdrawing: false,
  disabled: false
})

const emit = defineEmits<{
  withdraw: [id: string]
}>()

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  submitted: {
    label: 'Submitted',
    color: 'bg-blue-100 text-blue-700',
    icon: ClockIcon
  },
  viewed: {
    label: 'Viewed',
    color: 'bg-purple-100 text-purple-700',
    icon: EyeIcon
  },
  shortlisted: {
    label: 'Shortlisted',
    color: 'bg-yellow-100 text-yellow-700',
    icon: StarIcon
  },
  hired: {
    label: 'Hired',
    color: 'bg-green-100 text-green-700',
    icon: CheckCircleIcon
  },
  rejected: {
    label: 'Not Selected',
    color: 'bg-red-100 text-red-700',
    icon: XCircleIcon
  },
  withdrawn: {
    label: 'Withdrawn',
    color: 'bg-gray-100 text-gray-700',
    icon: XCircleIcon
  }
}

const status = computed(() => statusConfig[props.application.status] || statusConfig.submitted)
const StatusIcon = computed(() => status.value?.icon || ClockIcon)

const canWithdraw = computed(() => {
  return ['submitted', 'viewed', 'shortlisted'].includes(props.application.status)
})

const formattedDate = computed(() => {
  const date = new Date(props.application.created_at)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
})
</script>

<template>
  <div class="job-application-card">
    <div class="job-application-content">
      <div class="job-application-heading">
        <div class="flex-1 min-w-0">
          <!-- Job Title -->
          <RouterLink
            v-if="application.job"
            :to="`/jobs/${application.job_id}`"
            class="application-title text-gray-900 hover:text-senpai-600"
          >
            {{ application.job.title }}
          </RouterLink>
          <p v-else class="text-lg font-semibold text-gray-900">
            Job #{{ application.job_id.slice(0, 8) }}
          </p>

          <!-- Company -->
          <div v-if="application.job" class="flex items-center text-sm text-gray-600 mt-1">
            <BuildingOfficeIcon class="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span class="truncate">{{ application.job.company_name }}</span>
          </div>

          <!-- Applied Date -->
          <p class="text-sm text-gray-500 mt-2">
            Applied {{ formattedDate }}
          </p>
        </div>

        <!-- Status Badge -->
        <div class="flex-shrink-0">
          <span
            :class="[
              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
              status?.color || 'bg-gray-100 text-gray-700'
            ]"
          >
            <component :is="StatusIcon" class="h-4 w-4 mr-1" />
            {{ status?.label || 'Unknown' }}
          </span>
        </div>
      </div>

      <!-- Proposal Preview -->
      <details class="application-proposal">
        <summary>Your proposal</summary>
        <p class="text-sm text-gray-600 whitespace-pre-line">
          {{ application.proposal_text }}
        </p>
      </details>

      <!-- Rate and Timeline -->
      <div class="application-terms mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
        <span v-if="application.proposed_rate">
          Rate: <span class="font-medium text-gray-700">{{ application.proposed_rate }}</span>
        </span>
        <span v-if="application.proposed_timeline">
          Timeline: <span class="font-medium text-gray-700">{{ application.proposed_timeline }}</span>
        </span>
      </div>

      <!-- Rejection Reason -->
      <div
        v-if="application.status === 'rejected' && application.rejection_reason"
        class="mt-4 p-3 bg-red-50 rounded-lg"
      >
        <p class="text-sm text-red-700">
          <span class="font-medium">Feedback:</span> {{ application.rejection_reason }}
        </p>
      </div>

      <!-- Actions -->
      <div v-if="showWithdraw && canWithdraw" class="mt-4 pt-4 border-t border-gray-100">
        <BaseButton
          variant="outline"
          size="sm"
          :loading="withdrawing"
          :disabled="disabled"
          @click="emit('withdraw', application.id)"
        >
          Withdraw Application
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.job-application-card { background: #fff; border: 1px solid #e3e9ef; border-radius: 11px; overflow: hidden; }
.job-application-content { padding: 24px; }
.job-application-heading { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; }
.application-title { font-size: 16px; font-weight: 650; line-height: 1.5; overflow-wrap: anywhere; }
.job-application-heading .text-sm { font-size: 12px; line-height: 1.7; }
.job-application-heading .rounded-full { border-radius: 5px; font-size: 10px; }
.application-proposal { border-block: 1px solid #edf0f4; margin-top: 18px; padding-block: 14px; }
.application-proposal summary { font-size: 12px; color: #546b80; cursor: pointer; font-weight: 550; }
.application-proposal p { margin-top: 12px; font-size: 13px; line-height: 1.8; overflow-wrap: anywhere; }
.application-terms { font-size: 12px; }
.job-application-card :deep(button) { font-size: 11px; border-radius: 6px; }
@media (max-width: 560px) { .job-application-content { padding: 20px; } .job-application-heading { flex-wrap: wrap; gap: 12px; } .job-application-heading > .flex-1 { flex-basis: 100%; } }
</style>
