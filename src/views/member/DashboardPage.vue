<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMembersStore } from '@/stores/members'
import { useJobsStore } from '@/stores/jobs'
import { engineApi, baselinesApi } from '@/api'
import type { MemberDashboard, TaskAssignment, MemberEnrichment, AssignmentComment } from '@/types'
import AppLayout from '@/components/layout/AppLayout.vue'
import WelcomeModal from '@/components/member/WelcomeModal.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import {
  ChevronDownIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  UsersIcon,
  BriefcaseIcon,
  SparklesIcon,
  ArrowRightIcon,
  AcademicCapIcon,
  RocketLaunchIcon,
  LightBulbIcon,
  HeartIcon,
  CheckCircleIcon,
  ClockIcon,
  IdentificationIcon,
  ChartBarIcon,
  LockClosedIcon,
  ChatBubbleLeftRightIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/vue/24/outline'
import { SENPAI_MANIFESTO } from '@/content/manifesto'

const authStore = useAuthStore()
const membersStore = useMembersStore()
const jobsStore = useJobsStore()

const memberFirstName = computed(() => {
  return authStore.member?.profile?.full_name?.split(' ')[0] || 'Member'
})

const memberSince = computed(() => {
  if (!authStore.member?.created_at) return ''
  return new Date(authStore.member.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

// Random daily value from manifesto
const dailyValue = computed(() => {
  const today = new Date().getDay()
  return SENPAI_MANIFESTO.values[today % SENPAI_MANIFESTO.values.length]
})

// Greeting based on time of day
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
})

// Community stats from stores
const totalMembers = computed(() => membersStore.pagination?.total || null)
const openJobs = computed(() => jobsStore.pagination?.total || null)

// ---- Engine: cohort, tasks, onboarding (added to the existing dashboard) ----
const engine = ref<MemberDashboard | null>(null)
const engineLoading = ref(true)
const engineError = ref(false)
const acceptingTerms = ref(false)
const drafts = reactive<Record<string, { link: string; body: string }>>({})
const submitting = reactive<Record<string, boolean>>({})
const expanded = reactive<Record<string, boolean>>({})
const resubmitting = reactive<Record<string, boolean>>({})
const assignmentComments = reactive<Record<string, AssignmentComment[]>>({})
const loadingComments = reactive<Record<string, boolean>>({})
const newComment = reactive<Record<string, string>>({})

// Baseline: only capturable before induction, so prompt while it still can be.
const baselineCaptured = ref<boolean | null>(null)
const needsBaseline = computed(() =>
  baselineCaptured.value === false && !!engine.value?.membership && !inducted.value
)

const needsTerms = computed(() => !!engine.value && !engine.value.guidelines_accepted)
const enrichmentComplete = computed(() => !!engine.value?.enrichment_complete)
const senpai = computed(() => engine.value?.senpai_id ?? null)
const senpaiAddress = computed(() => (senpai.value?.handle ? `${senpai.value.handle}@senpaicollective.com` : ''))

// The Senpai ID has three states, and the card used to collapse them into one.
// It printed "Revealed at induction" whenever no handle was set — which is not
// the same condition, so a member who had been inducted and simply not chosen
// yet was told to keep waiting.
//   locked  — not yet inducted; options withheld by the API
//   choose  — inducted, options revealed, no handle picked
//   claimed — handle set
const senpaiIdRevealed = computed(() => !!senpai.value?.revealed_at)
const senpaiOptions = computed(() => senpai.value?.offered_options ?? [])
const choosingHandle = ref(false)
const handleError = ref('')

async function claimHandle(handle: string) {
  if (choosingHandle.value) return
  choosingHandle.value = true
  handleError.value = ''
  try {
    await engineApi.chooseSenpaiHandle(handle)
    await loadEngine()
  } catch (e: unknown) {
    handleError.value =
      (e as { response?: { data?: { message?: string } } }).response?.data?.message ||
      'Could not claim that handle'
  } finally {
    choosingHandle.value = false
  }
}
const inducted = computed(() => engine.value?.membership?.state === 'inducted' || engine.value?.membership?.state === 'active')
const openTasks = computed(() => (engine.value?.tasks ?? []).filter((t) => t.status !== 'completed'))
const doneTasks = computed(() => (engine.value?.tasks ?? []).filter((t) => t.status === 'completed'))

async function loadEngine() {
  engineLoading.value = true
  engineError.value = false
  try {
    const res = await engineApi.getDashboard()
    if (!res.status || !res.data) throw new Error('Dashboard unavailable')
    const data = res.data ?? null
    for (const a of data?.tasks ?? []) {
      drafts[a.task_id] = { link: a.link_url ?? '', body: a.body ?? '' }
    }
    engine.value = data
  } catch {
    engine.value = null
    engineError.value = true
  } finally {
    engineLoading.value = false
  }
  try {
    baselineCaptured.value = !!(await baselinesApi.getMyBaseline('intake')).data
  } catch {
    baselineCaptured.value = null // unknown: don't nag on a failed lookup
  }
}

// Profile completeness — computed live from what's actually filled in, instead
// of the stale value stored at registration (which never updates afterwards).
const enrichment = ref<MemberEnrichment | null>(null)
async function loadEnrichment() {
  try {
    const res = await engineApi.getEnrichment()
    enrichment.value = res.data ?? null
  } catch {
    enrichment.value = null
  }
}

const profileCompleteness = computed(() => {
  const p = authStore.member?.profile
  const e = enrichment.value
  const checks = [
    !!p?.photo_url,
    !!p?.bio,
    !!p?.recent_work,
    !!p?.unique_view,
    !!p?.portfolio_url,
    !!(p?.additional_links && p.additional_links.length > 0),
    !!e?.goal,
    !!e?.timezone,
    !!e?.date_of_birth,
    !!e?.work_status,
    !!e?.school_status,
    !!e?.mbti,
    !!e?.job_title,
    !!e?.weekly_commitment_hours,
    !!e?.languages
  ]
  const filled = checks.filter(Boolean).length
  return Math.round((filled / checks.length) * 100)
})

onMounted(() => {
  membersStore.fetchDashboard()
  membersStore.fetchMembers({ limit: 1 })
  jobsStore.fetchJobs({ limit: 1 })
  loadEngine()
  loadEnrichment()
})

function handleWelcomeClose() {
  // The pledge was already recorded server-side inside WelcomeModal before it
  // could reach this point — reflect that locally so the modal doesn't need
  // a full reload to disappear for good.
  if (engine.value) engine.value.pledge_accepted = true
}

async function acceptTerms() {
  acceptingTerms.value = true
  try {
    await engineApi.acceptGuidelines()
    await loadEngine()
  } finally {
    acceptingTerms.value = false
  }
}

function formatDate(d?: string | null) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function daysUntil(d?: string | null) {
  if (!d) return null
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000)
  return diff > 0 ? diff : null
}
function toggle(a: TaskAssignment) {
  if (!drafts[a.task_id]) drafts[a.task_id] = { link: a.link_url ?? '', body: a.body ?? '' }
  expanded[a.id] = !expanded[a.id]
  if (expanded[a.id] && hasBeenSubmitted(a) && !assignmentComments[a.id]) loadAssignmentComments(a)
}
// The hand-in input is only editable when there's nothing submitted yet, when
// the task was returned for changes, or when the member explicitly asks to
// resubmit — otherwise a submitted answer reads as read-only, "in review".
function hasBeenSubmitted(a: TaskAssignment) {
  return !!a.submitted_at
}
function isInputActive(a: TaskAssignment) {
  return a.status === 'returned' || !hasBeenSubmitted(a) || !!resubmitting[a.id]
}
async function submitTask(a: TaskAssignment) {
  const handin = a.task?.handin_type ?? 'link'
  const draft = drafts[a.task_id] ?? { link: '', body: '' }
  const payload: { link_url?: string; body?: string } = {}
  if (handin === 'link' || handin === 'file' || handin === 'external_form') payload.link_url = draft.link || undefined
  if (handin === 'text') payload.body = draft.body || undefined
  submitting[a.task_id] = true
  try {
    await engineApi.submitTask(a.task_id, payload)
    resubmitting[a.id] = false
    await loadEngine()
  } finally {
    submitting[a.task_id] = false
  }
}
async function loadAssignmentComments(a: TaskAssignment) {
  loadingComments[a.id] = true
  try {
    const res = await engineApi.getAssignmentComments(a.id)
    assignmentComments[a.id] = res.data ?? []
  } finally {
    loadingComments[a.id] = false
  }
}
async function postComment(a: TaskAssignment) {
  const body = (newComment[a.id] || '').trim()
  if (!body) return
  await engineApi.postAssignmentComment(a.id, body)
  assignmentComments[a.id] = (await engineApi.getAssignmentComments(a.id)).data ?? []
  newComment[a.id] = ''
}
function commentAuthor(c: AssignmentComment) {
  return c.member?.profile?.full_name || c.member?.email || 'Member'
}
function commentTimeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}
</script>

<template>
  <AppLayout>
    <!-- Welcome tour + Senpai Pledge — waits for engine to load and Guidelines
         to be accepted first, so the sequence is structurally guaranteed
         (no race with the async engine fetch), and only shows once, ever,
         per account (server-tracked, not a per-device localStorage flag). -->
    <WelcomeModal
      v-if="engine && !needsTerms && !engine.pledge_accepted"
      :member-name="memberFirstName"
      @close="handleWelcomeClose"
    />

    <!-- Required terms + guidelines gate (first login) -->
    <BaseModal :show="needsTerms" :dismissable="false" title="Welcome to the collective" subtitle="Two minutes before you begin.">
      <div class="space-y-4 text-sm text-gray-600 leading-relaxed">
        <p>You've been accepted. Before you start, our shared agreement — the things that keep this place worth being in:</p>
        <ul class="space-y-2">
          <li class="flex gap-2"><CheckCircleIcon class="h-5 w-5 text-senpai-500 shrink-0" /> Show up and contribute. No spectators — everyone here builds, helps, or shares.</li>
          <li class="flex gap-2"><CheckCircleIcon class="h-5 w-5 text-senpai-500 shrink-0" /> Lift the people around you. We rise together or not at all.</li>
          <li class="flex gap-2"><CheckCircleIcon class="h-5 w-5 text-senpai-500 shrink-0" /> Keep what's shared here in confidence. Trust is the whole asset.</li>
          <li class="flex gap-2"><CheckCircleIcon class="h-5 w-5 text-senpai-500 shrink-0" /> Do the work honestly. Your reputation here is real.</li>
        </ul>
        <RouterLink to="/guidelines" target="_blank" class="inline-flex items-center text-senpai-600 hover:text-senpai-700 font-medium">
          Read the full Community Guidelines <ArrowRightIcon class="h-4 w-4 ml-1" />
        </RouterLink>
      </div>
      <template #footer>
        <button
          class="w-full py-2.5 bg-senpai-600 text-white rounded-lg font-medium hover:bg-senpai-700 disabled:opacity-50"
          :disabled="acceptingTerms"
          @click="acceptTerms"
        >
          {{ acceptingTerms ? 'One moment…' : 'I understand and agree' }}
        </button>
      </template>
    </BaseModal>

    <div class="member-dashboard max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Overview -->
      <div class="dashboard-heading mb-8">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              {{ greeting }}, {{ memberFirstName }}.
            </h1>
            <p class="mt-2 text-lg text-gray-600">
              Your work, your people, and what’s next.
            </p>
          </div>
          <div class="dashboard-member-since hidden sm:block text-right">
            <p class="text-sm text-gray-500">Member since</p>
            <p class="font-medium text-gray-900">{{ memberSince }}</p>
          </div>
        </div>
      </div>

      <div class="dashboard-shortcuts" aria-label="Task overview">
        <RouterLink to="/tasks"><span class="shortcut-icon"><ClipboardDocumentListIcon /></span><div><span class="shortcut-label">Active tasks</span><strong>{{ engineLoading || engineError ? '—' : openTasks.filter(t => t.status !== 'submitted').length }}</strong></div><ArrowRightIcon class="shortcut-arrow" /></RouterLink>
        <RouterLink to="/tasks"><span class="shortcut-icon shortcut-review"><ClockIcon /></span><div><span class="shortcut-label">In review</span><strong>{{ engineLoading || engineError ? '—' : openTasks.filter(t => t.status === 'submitted').length }}</strong></div><ArrowRightIcon class="shortcut-arrow" /></RouterLink>
        <RouterLink to="/tasks"><span class="shortcut-icon shortcut-complete"><CheckCircleIcon /></span><div><span class="shortcut-label">Completed</span><strong>{{ engineLoading || engineError ? '—' : doneTasks.length }}</strong></div><ArrowRightIcon class="shortcut-arrow" /></RouterLink>
      </div>

      <!-- Scout Invitation Banner -->
      <div
        v-if="membersStore.dashboard?.pending_scout_invitation"
        class="mb-8 bg-gradient-to-r from-senpai-600 to-senpai-500 rounded-2xl p-6 text-white"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <SparklesIcon class="h-8 w-8 mr-4" />
            <div>
              <h3 class="font-semibold text-lg">You've been invited to become a Scout!</h3>
              <p class="text-senpai-100">Help grow the community and build the next generation.</p>
            </div>
          </div>
          <RouterLink
            to="/scout"
            class="inline-flex items-center px-4 py-2 bg-white text-senpai-600 rounded-lg font-medium hover:bg-senpai-50 transition-colors"
          >
            Learn More
            <ArrowRightIcon class="h-4 w-4 ml-2" />
          </RouterLink>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="dashboard-columns">
        <!-- Left Column - 2/3 width -->
        <div class="dashboard-main-column space-y-8">
          <!-- Mobile quick-glance strip: condensed version of the desktop sidebar
               (profile strength, scout status, collective stats) — on mobile the
               full sidebar cards would otherwise sit below the entire task list. -->
          <div v-if="authStore.member?.profile" class="dashboard-quick-glance flex items-center gap-4 overflow-x-auto bg-white rounded-2xl border border-gray-200 p-4">
            <RouterLink to="/profile/edit" class="flex items-center gap-2.5 shrink-0">
              <span class="w-9 h-9 rounded-full bg-senpai-100 flex items-center justify-center text-sm font-bold text-senpai-600 shrink-0">
                {{ memberFirstName.charAt(0) }}
              </span>
              <span class="text-sm leading-tight">
                <span class="block font-medium text-gray-900">{{ memberFirstName }}</span>
                <span class="block text-xs text-gray-500">Profile {{ profileCompleteness }}%</span>
              </span>
            </RouterLink>
            <div class="h-8 w-px bg-gray-100 shrink-0" />
            <RouterLink v-if="authStore.isScout" to="/scout" class="flex items-center gap-1.5 shrink-0 text-sm font-medium text-senpai-600">
              <SparklesIcon class="h-4 w-4" />
              Scout
            </RouterLink>
            <RouterLink to="/members" class="shrink-0 text-sm text-gray-600">
              <span class="font-semibold text-gray-900">{{ totalMembers ?? '—' }}</span> Members
            </RouterLink>
            <RouterLink to="/jobs" class="shrink-0 text-sm text-gray-600">
              <span class="font-semibold text-gray-900">{{ openJobs ?? '—' }}</span> Jobs
            </RouterLink>
          </div>

          <!-- Assigned work comes before community context. -->
          <section class="dashboard-task-section" aria-labelledby="dashboard-tasks-title">
            <div class="flex items-center justify-between mb-4">
              <h2 id="dashboard-tasks-title" class="text-lg font-semibold text-gray-900">Your tasks</h2>
              <RouterLink to="/tasks" class="text-sm text-senpai-600">View all tasks <span aria-hidden="true">→</span></RouterLink>
            </div>
            <div v-if="engineLoading && !engine" class="dashboard-task-state" role="status"><LoadingSpinner /><p>Loading your workspace…</p></div>
            <div v-else-if="engineError" class="dashboard-task-state" role="alert"><p>Your tasks couldn’t be loaded.</p><button type="button" class="dashboard-inline-action" @click="loadEngine">Try again</button></div>
            <div v-else-if="!openTasks.length && !doneTasks.length" class="dashboard-task-state"><ClipboardDocumentListIcon class="task-empty-icon" /><h3>No assigned tasks yet</h3><p>Find a task you can contribute to, or explore a shared project.</p><div><RouterLink to="/tasks/open" class="dashboard-inline-action">Browse open tasks <span aria-hidden="true">→</span></RouterLink><RouterLink to="/projects">Explore projects</RouterLink></div></div>
            <div v-else class="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
              <!-- Open tasks -->
              <div v-for="a in openTasks" :key="a.id" class="px-5 py-4">
                <div class="flex items-start gap-3">
                  <button type="button" class="task-disclosure shrink-0" @click="toggle(a)" :aria-label="`${expanded[a.id] ? 'Collapse' : 'Expand'} ${a.task?.title || 'task'}`" :aria-expanded="!!expanded[a.id]">
                    <ChevronDownIcon :class="{ 'rotate-180': expanded[a.id] }" />
                  </button>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-start justify-between gap-2 flex-wrap">
                      <button class="text-left font-medium text-gray-900 hover:text-senpai-700" @click="toggle(a)" :aria-expanded="!!expanded[a.id]">{{ a.task?.title }}</button>
                      <div class="flex items-center gap-2 shrink-0">
        <span v-if="a.task?.is_required" class="text-[11px] px-1.5 py-0.5 rounded bg-red-50 text-red-600">Required</span>
                        <span v-if="a.status === 'submitted'" class="text-[11px] text-blue-600">In review</span>
                        <span v-else-if="a.status === 'returned'" class="text-[11px] text-red-600">Needs changes</span>
                      </div>
                    </div>
                    <p class="text-sm text-gray-500 mt-0.5">{{ a.task?.description }}</p>
                    <p v-if="a.task?.due_at" class="text-xs text-gray-400 mt-1 flex items-center gap-1"><ClockIcon class="h-3.5 w-3.5" /> Due {{ formatDate(a.task.due_at) }}</p>
                    <div v-if="expanded[a.id]" class="mt-3">
                      <p v-if="a.status === 'returned' && a.review_note" class="text-sm text-red-700 bg-red-50 rounded-lg p-3 mb-3">{{ a.review_note }}</p>

                      <!-- Read-only: already submitted, in review, not currently resubmitting -->
                      <div v-if="hasBeenSubmitted(a) && !isInputActive(a)" class="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p v-if="a.link_url" class="text-sm"><a :href="a.link_url" target="_blank" rel="noopener noreferrer" class="text-senpai-600 hover:underline break-all">{{ a.link_url }}</a></p>
                        <p v-if="a.body" class="text-sm text-gray-700 whitespace-pre-wrap">{{ a.body }}</p>
                        <button class="mt-2 text-xs text-gray-500 hover:text-gray-800 font-medium" @click="resubmitting[a.id] = true">Resubmit</button>
                      </div>

                      <!-- Editable: no submission yet, returned for changes, or explicitly resubmitting -->
                      <template v-else>
                        <textarea v-if="a.task?.handin_type === 'text'" v-model="drafts[a.task_id]!.body" rows="3" placeholder="Write your response…" class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-senpai-500" />
                        <a v-else-if="a.task?.handin_type === 'external_form' && a.task?.external_url" :href="a.task.external_url" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-sm text-senpai-600 font-medium mb-2">Open the form <ArrowTopRightOnSquareIcon class="h-4 w-4" /></a>
                        <input v-else-if="a.task?.handin_type !== 'none'" v-model="drafts[a.task_id]!.link" type="url" placeholder="https://…" class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-senpai-500" />
                        <button class="mt-3 px-4 py-2 bg-senpai-600 text-white rounded-lg text-sm font-medium hover:bg-senpai-700 disabled:opacity-50" :disabled="submitting[a.task_id]" @click="submitTask(a)">
                          {{ submitting[a.task_id] ? 'Submitting…' : hasBeenSubmitted(a) ? 'Resubmit' : a.task?.handin_type === 'none' || a.task?.handin_type === 'external_form' ? 'Mark as done' : 'Submit' }}
                        </button>
                      </template>

                      <!-- Comment thread with admins — only relevant once something's been submitted -->
                      <div v-if="hasBeenSubmitted(a)" class="mt-4 pt-3 border-t border-gray-100">
                        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Comments</p>
                        <div v-if="loadingComments[a.id]" class="text-xs text-gray-400">Loading…</div>
                        <div v-else-if="assignmentComments[a.id]?.length" class="space-y-2 mb-2">
                          <div v-for="c in assignmentComments[a.id]" :key="c.id" class="text-sm bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                            <p class="text-xs text-gray-400 mb-0.5">{{ commentAuthor(c) }} · {{ commentTimeAgo(c.created_at) }}</p>
                            <p class="text-gray-700 whitespace-pre-wrap">{{ c.body }}</p>
                          </div>
                        </div>
                        <p v-else class="text-xs text-gray-400 italic mb-2">No comments yet.</p>
                        <div class="flex items-center gap-2">
                          <input
                            v-model="newComment[a.id]"
                            type="text"
                            placeholder="Reply…"
                            class="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-senpai-400"
                            @keyup.enter="postComment(a)"
                          />
                          <button class="text-sm text-senpai-600 font-medium hover:text-senpai-700" @click="postComment(a)">Send</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Completed tasks — clearly done -->
              <div v-for="a in doneTasks" :key="a.id" class="px-5 py-4 flex items-start gap-3 bg-green-50/40">
                <CheckCircleIcon class="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span class="text-sm text-gray-500 line-through flex-1">{{ a.task?.title }}</span>
                <span class="text-[11px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-medium shrink-0">Done</span>
              </div>
            </div>
          </section>

          <!-- Your cohort -->
          <div v-if="engine?.membership" class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div class="cohort-overview px-6 pt-8 pb-6">
              <div class="relative">
                <AcademicCapIcon class="cohort-icon" aria-hidden="true" />
                <p class="mt-3 text-xs font-medium uppercase tracking-wider text-senpai-600">Your cohort</p>
                <p class="font-bold text-2xl text-gray-900 mt-0.5">{{ engine.cohort?.name || 'Your cohort' }}</p>
                <span class="inline-block mt-3 text-xs px-2.5 py-1 rounded-full bg-senpai-100 text-senpai-700 capitalize">{{ engine.membership.state }}</span>
              </div>
            </div>
            <!-- The cohort's own words, left-aligned. Centring reads fine for a
                 one-line tagline and badly for a paragraph — ragged on both
                 edges, and it pushed the induction date below the fold. -->
            <div v-if="engine.cohort?.description" class="border-t border-gray-100 px-6 py-4">
              <p class="text-sm text-gray-600 leading-relaxed">{{ engine.cohort.description }}</p>
            </div>
            <div class="border-t border-gray-100 p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <!-- Induction -->
              <div>
                <p class="text-xs text-gray-500 mb-1">Induction</p>
                <!-- Once inducted the ceremony has happened, so a countdown to
                     it is a contradiction, not a reminder. -->
                <p v-if="inducted" class="text-sm text-gray-900 flex items-center gap-1.5">
                  <CheckCircleIcon class="h-4 w-4 text-senpai-600" /> You're inducted
                </p>
                <p v-else-if="engine.cohort?.induction_date" class="text-sm text-gray-900 flex items-center gap-1.5">
                  <ClockIcon class="h-4 w-4 text-senpai-600" />
                  <span v-if="daysUntil(engine.cohort.induction_date)">{{ formatDate(engine.cohort.induction_date) }} · in {{ daysUntil(engine.cohort.induction_date) }} days</span>
                  <span v-else>{{ formatDate(engine.cohort.induction_date) }}</span>
                </p>
                <p v-else class="text-sm text-gray-400">Date to be announced</p>
              </div>
              <!-- Senpai ID -->
              <div>
                <p class="text-xs text-gray-500 mb-1">SENPAI ID</p>
                <p v-if="senpaiAddress" class="text-sm font-mono text-gray-900 break-all">{{ senpaiAddress }}</p>
                <template v-else-if="senpaiIdRevealed && senpaiOptions.length">
                  <p class="text-sm text-gray-900 mb-1.5">Yours to claim — pick one:</p>
                  <div class="flex flex-wrap gap-1.5">
                    <button
                      v-for="opt in senpaiOptions"
                      :key="opt"
                      class="font-mono text-xs px-2.5 py-1 border border-gray-200 rounded-lg hover:border-senpai-500 hover:bg-senpai-50 disabled:opacity-50"
                      :disabled="choosingHandle"
                      @click="claimHandle(opt)"
                    >{{ opt }}@senpaicollective.com</button>
                  </div>
                  <p class="text-xs text-gray-400 mt-1.5">This is permanent — choose carefully.</p>
                  <p v-if="handleError" class="text-xs text-red-600 mt-1">{{ handleError }}</p>
                </template>
                <p v-else class="text-sm text-gray-400 flex items-center gap-1.5"><LockClosedIcon class="h-4 w-4" /> Revealed at induction</p>
              </div>
              <!-- Pod — visible as soon as it's assigned, not gated behind induction -->
              <div v-if="engine.pod" class="sm:col-span-2 pt-2 border-t border-gray-100">
                <div class="flex items-center justify-between">
                  <p class="text-sm text-gray-900 flex items-center gap-1.5"><ChatBubbleLeftRightIcon class="h-4 w-4 text-senpai-600" /> {{ engine.pod.name }}</p>
                  <a v-if="engine.pod.whatsapp_invite_url" :href="engine.pod.whatsapp_invite_url" target="_blank" rel="noopener noreferrer" class="text-sm text-green-700 font-medium hover:underline inline-flex items-center gap-1">Join WhatsApp <ArrowTopRightOnSquareIcon class="h-4 w-4" /></a>
                </div>
                <p v-if="engine.pod.description" class="text-sm text-gray-500 mt-1">{{ engine.pod.description }}</p>
              </div>
              <div v-else-if="engine.membership && !inducted" class="sm:col-span-2 pt-2 border-t border-gray-100">
                <p class="text-sm text-gray-400 flex items-center gap-1.5"><ChatBubbleLeftRightIcon class="h-4 w-4" /> Pod not assigned yet — we'll place you soon</p>
              </div>
            </div>
            <RouterLink
              to="/wall"
              class="flex items-center justify-between border-t border-gray-100 px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <span class="text-sm font-medium text-gray-900 flex items-center gap-2">
                <ChatBubbleLeftRightIcon class="h-4 w-4 text-senpai-600" /> Read the wall
              </span>
              <span class="text-xs text-gray-500 flex items-center gap-1">
                What your cohort wrote <ArrowRightIcon class="h-4 w-4 text-gray-400" />
              </span>
            </RouterLink>
          </div>

          <!-- Baseline prompt. Ordered above the profile prompt because this one
               expires: once induction starts the "before" cannot be recovered. -->
          <RouterLink
            v-if="needsBaseline"
            to="/baseline"
            class="flex items-center gap-4 bg-white rounded-2xl border border-senpai-200 p-5 hover:border-senpai-400 hover:shadow-md transition-all group"
          >
            <div class="w-12 h-12 bg-senpai-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-senpai-200 transition-colors">
              <ChartBarIcon class="h-6 w-6 text-senpai-600" />
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 group-hover:text-senpai-600">Record where you're starting from</h3>
              <p class="text-sm text-gray-500">Takes a few minutes, and can only be done before induction. It's how we show what actually changed for you later.</p>
            </div>
            <ArrowRightIcon class="h-5 w-5 text-gray-400 shrink-0" />
          </RouterLink>

          <!-- Complete your profile prompt -->
          <RouterLink
            v-if="engine && !enrichmentComplete && engine.guidelines_accepted"
            to="/profile/edit"
            class="flex items-center gap-4 bg-white rounded-2xl border border-gray-200 p-5 hover:border-senpai-300 hover:shadow-md transition-all group"
          >
            <div class="w-12 h-12 bg-senpai-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-senpai-200 transition-colors">
              <IdentificationIcon class="h-6 w-6 text-senpai-600" />
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 group-hover:text-senpai-600">Complete your member profile</h3>
              <p class="text-sm text-gray-500">A few questions that help us place you in the right pod.</p>
            </div>
            <ArrowRightIcon class="h-5 w-5 text-gray-400 shrink-0" />
          </RouterLink>

          <!-- Take Action -->
          <div>
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Build your next connection</h2>
            <div class="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
              <RouterLink to="/members" class="bg-white rounded-xl border border-gray-200 p-3 sm:p-5 hover:border-senpai-300 hover:shadow-md transition-all group">
                <div class="flex items-center gap-3 sm:gap-4">
                  <div class="w-9 h-9 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-200 transition-colors">
                    <UsersIcon class="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div class="min-w-0">
                    <h3 class="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-senpai-600">Find Collaborators</h3>
                    <p class="hidden sm:block text-sm text-gray-500">Connect with other builders</p>
                  </div>
                </div>
              </RouterLink>

              <RouterLink to="/jobs" class="bg-white rounded-xl border border-gray-200 p-3 sm:p-5 hover:border-senpai-300 hover:shadow-md transition-all group">
                <div class="flex items-center gap-3 sm:gap-4">
                  <div class="w-9 h-9 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-green-200 transition-colors">
                    <BriefcaseIcon class="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <div class="min-w-0">
                    <h3 class="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-senpai-600">Find Opportunities</h3>
                    <p class="hidden sm:block text-sm text-gray-500">Jobs from the collective</p>
                  </div>
                </div>
              </RouterLink>

              <RouterLink to="/profile/edit" class="bg-white rounded-xl border border-gray-200 p-3 sm:p-5 hover:border-senpai-300 hover:shadow-md transition-all group">
                <div class="flex items-center gap-3 sm:gap-4">
                  <div class="w-9 h-9 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-purple-200 transition-colors">
                    <UserCircleIcon class="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                  <div class="min-w-0">
                    <h3 class="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-senpai-600">Update Profile</h3>
                    <p class="hidden sm:block text-sm text-gray-500">Show what you're building</p>
                  </div>
                </div>
              </RouterLink>

              <RouterLink to="/profile" class="bg-white rounded-xl border border-gray-200 p-3 sm:p-5 hover:border-senpai-300 hover:shadow-md transition-all group">
                <div class="flex items-center gap-3 sm:gap-4">
                  <div class="w-9 h-9 sm:w-12 sm:h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-amber-200 transition-colors">
                    <RocketLaunchIcon class="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
                  </div>
                  <div class="min-w-0">
                    <h3 class="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-senpai-600">View Profile</h3>
                    <p class="hidden sm:block text-sm text-gray-500">See how others see you</p>
                  </div>
                </div>
              </RouterLink>
            </div>
          </div>

          <!-- What You're Here For -->
          <div class="bg-gray-50 rounded-2xl p-4 sm:p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Remember Why You're Here</h2>
            <div class="grid grid-cols-3 gap-2 sm:gap-4">
              <div class="text-center p-1.5 sm:p-4">
                <div class="w-9 h-9 sm:w-12 sm:h-12 bg-senpai-100 rounded-xl flex items-center justify-center mx-auto mb-1.5 sm:mb-3">
                  <AcademicCapIcon class="h-5 w-5 sm:h-6 sm:w-6 text-senpai-600" />
                </div>
                <h3 class="text-sm sm:text-base font-medium text-gray-900 mb-0 sm:mb-1">Information</h3>
                <p class="hidden sm:block text-sm text-gray-500">Access knowledge that's usually gatekept</p>
              </div>
              <div class="text-center p-1.5 sm:p-4">
                <div class="w-9 h-9 sm:w-12 sm:h-12 bg-senpai-100 rounded-xl flex items-center justify-center mx-auto mb-1.5 sm:mb-3">
                  <svg class="h-5 w-5 sm:h-6 sm:w-6 text-senpai-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </div>
                <h3 class="text-sm sm:text-base font-medium text-gray-900 mb-0 sm:mb-1">Structure</h3>
                <p class="hidden sm:block text-sm text-gray-500">Frameworks to turn ambition into action</p>
              </div>
              <div class="text-center p-1.5 sm:p-4">
                <div class="w-9 h-9 sm:w-12 sm:h-12 bg-senpai-100 rounded-xl flex items-center justify-center mx-auto mb-1.5 sm:mb-3">
                  <UsersIcon class="h-5 w-5 sm:h-6 sm:w-6 text-senpai-600" />
                </div>
                <h3 class="text-sm sm:text-base font-medium text-gray-900 mb-0 sm:mb-1">People</h3>
                <p class="hidden sm:block text-sm text-gray-500">Builders who get it and push you forward</p>
              </div>
            </div>
          </div>
      <!-- Today's Reminder — always at the top -->
      <div class="daily-reminder bg-gray-900 rounded-2xl p-6 text-white">
        <div class="flex items-start gap-4">
          <div class="shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
            <LightBulbIcon class="h-6 w-6" />
          </div>
          <div>
            <p class="text-sm text-gray-400 mb-1">Today's Reminder</p>
            <h3 class="text-lg font-semibold mb-2">{{ dailyValue?.name || 'Daily Value' }}</h3>
            <p class="text-gray-300 text-sm">{{ dailyValue?.insight || 'Focus on growth and collaboration' }}</p>
          </div>
        </div>
      </div>

        </div>

        <!-- Right Column - 1/3 width. Hidden on mobile — the quick-glance strip
             above the fold covers it there; the full cards are desktop-only. -->
        <div class="dashboard-side-column space-y-6">
          <!-- Profile Card -->
          <div v-if="authStore.member?.profile" class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div class="bg-gray-900 px-6 py-4">
              <p class="text-sm text-gray-400">Your Profile</p>
            </div>
            <div class="p-6">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-14 h-14 bg-senpai-100 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                  <img v-if="authStore.member.profile.photo_url" :src="authStore.member.profile.photo_url" alt="" class="w-full h-full object-cover" />
                  <span v-if="!authStore.member.profile.photo_url" class="text-xl font-bold text-senpai-600">
                    {{ memberFirstName.charAt(0) }}
                  </span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">{{ authStore.member.profile.full_name }}</h3>
                  <p class="text-sm text-gray-500">{{ authStore.member.profile.primary_skill?.name || 'Creative' }}</p>
                </div>
              </div>

              <!-- Profile Completeness -->
              <div class="mb-4">
                <div class="flex items-center justify-between text-sm mb-1">
                  <span class="text-gray-600">Profile Strength</span>
                  <span class="font-medium text-senpai-600">{{ profileCompleteness }}%</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                  <div
                    class="bg-senpai-500 h-2 rounded-full transition-all duration-500"
                    :style="{ width: `${profileCompleteness}%` }"
                  />
                </div>
              </div>

              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">Experience</span>
                  <span class="text-gray-900 capitalize">{{ authStore.member.profile.experience_level || 'Not set' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Location</span>
                  <span class="text-gray-900">{{ authStore.member.profile.city }}, {{ authStore.member.profile.country }}</span>
                </div>
              </div>

              <RouterLink
                v-if="profileCompleteness < 100"
                to="/profile/edit"
                class="mt-4 block w-full text-center py-2 px-4 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Complete Your Profile
              </RouterLink>
            </div>
          </div>

          <!-- Scout Dashboard Card -->
          <div v-if="authStore.isScout" class="bg-gradient-to-br from-senpai-50 to-senpai-100 rounded-2xl p-6 border border-senpai-200">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-senpai-500 rounded-xl flex items-center justify-center">
                <SparklesIcon class="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Scout Dashboard</h3>
                <p class="text-xs text-gray-600">Grow the community</p>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-4">
              You're a Scout! Invite talented creatives and help build the next generation.
            </p>
            <RouterLink
              to="/scout"
              class="inline-flex items-center justify-center w-full py-2.5 px-4 bg-senpai-500 text-white rounded-lg text-sm font-medium hover:bg-senpai-600 transition-colors"
            >
              Open Scout Dashboard
              <ArrowRightIcon class="h-4 w-4 ml-2" />
            </RouterLink>
          </div>

          <!-- The Pledge Reminder -->
          <div class="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <div class="flex items-center gap-3 mb-4">
              <HeartIcon class="h-5 w-5 text-senpai-500" />
              <h3 class="font-semibold text-gray-900">Your Pledge</h3>
            </div>
            <div class="space-y-2 text-sm text-gray-600 italic">
              <p v-for="line in SENPAI_MANIFESTO.creed.slice(0, 3)" :key="line">{{ line }}</p>
            </div>
            <RouterLink
              to="/manifesto"
              class="mt-4 inline-flex items-center text-sm text-senpai-600 hover:text-senpai-700 font-medium"
            >
              Read the Manifesto
              <ArrowRightIcon class="h-3 w-3 ml-1" />
            </RouterLink>
          </div>

          <!-- Community Stats -->
          <div class="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 class="font-semibold text-gray-900 mb-4">The Collective</h3>
            <div class="space-y-4">
              <RouterLink to="/members" class="flex items-center justify-between -mx-2 px-2 py-1 rounded-lg hover:bg-gray-50">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <UsersIcon class="h-4 w-4 text-blue-600" />
                  </div>
                  <span class="text-sm text-gray-600">Members</span>
                </div>
                <span class="font-semibold text-gray-900">{{ totalMembers ?? '—' }}</span>
              </RouterLink>
              <RouterLink to="/jobs" class="flex items-center justify-between -mx-2 px-2 py-1 rounded-lg hover:bg-gray-50">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <BriefcaseIcon class="h-4 w-4 text-green-600" />
                  </div>
                  <span class="text-sm text-gray-600">Open Jobs</span>
                </div>
                <span class="font-semibold text-gray-900">{{ openJobs ?? '—' }}</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.dashboard-heading { padding-bottom: 4px; }
.dashboard-heading h1 { font-size: 28px; }
.dashboard-heading p.text-lg { font-size: 14px; margin-top: 8px; }
.dashboard-member-since p { font-size: 11px; }
.dashboard-member-since .font-medium { margin-top: 5px; font-size: 12px; }
.dashboard-shortcuts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin-bottom: 30px; }
.dashboard-shortcuts > a { display: flex; align-items: center; gap: 14px; padding: 20px; border: 1px solid #e5eaf0; border-radius: 10px; background: #fff; }
.dashboard-shortcuts > a:hover { border-color: #afd6d5; }
.shortcut-icon { width: 42px; height: 42px; display: grid; place-items: center; flex-shrink: 0; background: #eaf7f6; color: #148b8c; border-radius: 10px; }
.shortcut-icon svg { width: 21px; height: 21px; }
.shortcut-review { background: #fff6e5; color: #bf8a28; }
.shortcut-complete { background: #edf6ee; color: #588b62; }
.shortcut-label { font-size: 11px; color: #84909e; display: block; }
.dashboard-shortcuts strong { font-size: 26px; font-weight: 650; color: #253349; line-height: 1.4; }
.shortcut-arrow { width: 16px; height: 16px; margin-left: auto; color: #adb8c4; }
.dashboard-columns { display: grid; grid-template-columns: minmax(0, 1fr) 290px; align-items: start; gap: 24px; }
.dashboard-main-column { min-width: 0; }
.task-disclosure { display: grid; place-items: center; width: 28px; height: 28px; margin-top: -2px; color: #8897a7; border-radius: 5px; background: #f4f7fa; }
.task-disclosure svg { width: 16px; height: 16px; }
.dashboard-quick-glance { display: none; }
.dashboard-main-column h2, .dashboard-side-column h3 { font-size: 15px; font-weight: 650; }
.dashboard-task-state { border: 1px solid #e5eaf0; background: #fff; border-radius: 10px; padding: 32px 24px; display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
.dashboard-task-state h3 { font-size: 15px; font-weight: 600; }
.dashboard-task-state p { font-size: 13px; line-height: 1.7; color: #84909e; }
.dashboard-task-state > div { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; margin-top: 6px; font-size: 12px; color: #68758a; }
.dashboard-inline-action { color: #097d7e; font-weight: 600; font-size: 12px; }
.task-empty-icon { width: 30px; height: 30px; color: #9fafbe; }
.cohort-overview { background: #f0f7f9; padding-block: 20px; }
.cohort-overview > div { padding-left: 48px; }
.cohort-icon { position: absolute; left: 0; top: 3px; width: 30px; height: 30px; color: #5d91a0; }
.cohort-overview p.mt-3 { margin-top: 0; font-size: 10px; color: #698a99; }
.cohort-overview .text-2xl { font-size: 19px; font-weight: 600; }
.cohort-overview .rounded-full { margin-top: 8px; }
.daily-reminder { background: #f0f4f8; color: #344054; border: 1px solid #e4eaf0; }
.daily-reminder .text-gray-400 { color: #8a97a7; font-size: 11px; }
.daily-reminder .text-gray-300 { color: #69778b; font-size: 12px; line-height: 1.8; }
.daily-reminder h3 { font-size: 15px; }
.daily-reminder .bg-white\/10 { background: #e4edf1; color: #658998; width: 36px; height: 36px; border-radius: 8px; }
.dashboard-side-column .bg-gray-900 { background: #f4f7fa; color: #475467; border-bottom: 1px solid #e5eaf0; }
.dashboard-side-column .bg-gray-900 .text-white { color: #475467; }
.dashboard-side-column .bg-gradient-to-br { background: #f0f9f8; border-color: #d6eae7; }
.member-dashboard p { overflow-wrap: anywhere; }
@media (max-width: 1199px) { .dashboard-columns { grid-template-columns: minmax(0, 1fr) 250px; gap: 20px; } .dashboard-shortcuts > a { padding: 16px; gap: 10px; } .shortcut-arrow { display: none; } }
@media (max-width: 767px) { .dashboard-quick-glance { display: flex; } .dashboard-columns { grid-template-columns: 1fr; } .dashboard-side-column { display: none; } .dashboard-shortcuts { gap: 10px; } .dashboard-shortcuts > a { padding: 14px; flex-direction: column; align-items: flex-start; gap: 10px; } .shortcut-icon { width: 32px; height: 32px; border-radius: 8px; } .shortcut-icon svg { width: 18px; height: 18px; } .shortcut-label { font-size: 10px; } .dashboard-shortcuts strong { font-size: 24px; } }
</style>
