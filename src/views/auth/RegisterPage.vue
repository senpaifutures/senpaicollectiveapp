<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSkillsStore } from '@/stores/skills'
import { scoutsApi } from '@/api'
import type { ExperienceLevel, DiscoverySource } from '@/types'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseTextarea from '@/components/common/BaseTextarea.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseMultiSelect from '@/components/common/BaseMultiSelect.vue'
import BaseCheckbox from '@/components/common/BaseCheckbox.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { SENPAI_MANIFESTO } from '@/content/manifesto'
import { XMarkIcon, CheckIcon, ArrowRightIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const skillsStore = useSkillsStore()
const scoutCode = (route.query.ref as string) || (route.query.scout as string) || ''
const referringScout = ref<{ full_name: string; photo_url?: string } | null>(null)

// Password complexity — must match Zitadel's org policy (min 8, upper, lower,
// number). No symbol requirement: Google's password manager won't generate
// symbols, so requiring one broke autofill/suggested passwords for most users.
const passwordChecks = computed(() => {
  const p = form.value.password || ''
  return [
    { label: 'At least 8 characters', met: p.length >= 8 },
    { label: 'An uppercase letter', met: /[A-Z]/.test(p) },
    { label: 'A lowercase letter', met: /[a-z]/.test(p) },
    { label: 'A number', met: /[0-9]/.test(p) }
  ]
})
const passwordValid = computed(() => passwordChecks.value.every((c) => c.met))

const currentStep = ref(0) // Start at step 0 (philosophy intro)
const totalSteps = 6 // Now 6 steps (0-5)
const registrationComplete = ref(false)

const form = ref({
  // Step 1: Basic Info
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  password_confirm: '',
  phone: '',
  city: '',
  country: '',

  // Step 2: Skills & Work
  primary_skill_id: null as number | null,
  other_skill_ids: [] as number[],
  experience_level: '' as ExperienceLevel | '',
  portfolio_url: '',
  additional_links: [{ label: '', url: '' }] as { label: string; url: string }[],

  // Step 3: About You
  bio: '',
  cover_letter: '',
  recent_work: '',
  unique_view: '',

  // Step 4: Community History
  is_og_member: false,
  og_member_details: '',
  discovery_source: (scoutCode ? 'scout' : '') as DiscoverySource | '',
  scout_code: scoutCode,

  // Step 5: Agreement
  agree_terms: false,
  agree_privacy: false,
  agree_profile_visible: false
})

const errors = ref<Record<string, string>>({})

const experienceLevelOptions = [
  { value: 'none', label: 'No professional experience yet' },
  { value: 'junior', label: 'Junior (0-2 years)' },
  { value: 'mid', label: 'Mid-level (2-5 years)' },
  { value: 'senior', label: 'Senior (5+ years)' }
]

const discoverySourceOptions = [
  { value: 'scout', label: 'Invited by a Scout' },
  { value: 'social', label: 'Social media' },
  { value: 'friend', label: 'Friend or colleague' },
  { value: 'event', label: 'Event or workshop' },
  { value: 'returning', label: "I'm a returning member" },
  { value: 'other', label: 'Other' }
]

const skillOptions = computed(() => {
  return skillsStore.skills.map(skill => ({
    value: skill.id,
    label: skill.name
  }))
})

const otherSkillOptions = computed(() => {
  return skillOptions.value.filter(opt => opt.value !== form.value.primary_skill_id)
})

const stepTitles = [
  'Before You Apply',
  'Basic Information',
  'Skills & Work',
  'About You',
  'Community History',
  'Terms & Agreement'
]

onMounted(() => {
  skillsStore.fetchSkills()

  // Track scout link click if there's a scout code in the URL, and look up
  // who it belongs to so the banner can say who invited you, not just show
  // a code.
  if (scoutCode) {
    scoutsApi.trackClick(scoutCode).catch(() => {
      // Silently ignore tracking errors
    })
    scoutsApi.getByCode(scoutCode).then((res) => {
      if (res.status && res.data) referringScout.value = res.data
    }).catch(() => {
      referringScout.value = null
    })
  }
})

function validateStep(step: number): boolean {
  errors.value = {}

  // Step 0: Philosophy intro - no validation needed, just informational
  if (step === 0) {
    return true
  }

  if (step === 1) {
    if (!form.value.first_name || form.value.first_name.length < 1) {
      errors.value.first_name = 'First name is required'
    }
    if (!form.value.last_name || form.value.last_name.length < 1) {
      errors.value.last_name = 'Last name is required'
    }
    if (!form.value.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
      errors.value.email = 'Please enter a valid email'
    }
    if (!form.value.password) {
      errors.value.password = 'Password is required'
    } else if (!passwordValid.value) {
      errors.value.password = 'Password must meet all the requirements below'
    }
    if (form.value.password !== form.value.password_confirm) {
      errors.value.password_confirm = 'Passwords do not match'
    }
    if (!form.value.city || form.value.city.length < 2) {
      errors.value.city = 'City is required'
    }
    if (!form.value.country || form.value.country.length < 2) {
      errors.value.country = 'Country is required'
    }
  }

  if (step === 2) {
    if (!form.value.primary_skill_id) {
      errors.value.primary_skill_id = 'Please select your primary skill'
    }
    if (!form.value.experience_level) {
      errors.value.experience_level = 'Please select your experience level'
    }
    if (!form.value.portfolio_url) {
      errors.value.portfolio_url = 'Portfolio URL is required'
    } else if (!/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(form.value.portfolio_url)) {
      errors.value.portfolio_url = 'Please enter a valid URL (e.g., www.example.com or https://example.com)'
    }
  }

  if (step === 3) {
    if (!form.value.bio || form.value.bio.length < 10) {
      errors.value.bio = 'Bio must be at least 10 characters'
    }
    if (!form.value.recent_work || form.value.recent_work.length < 10) {
      errors.value.recent_work = 'Please tell us about your recent work (at least 10 characters)'
    }
    if (!form.value.unique_view || form.value.unique_view.length < 10) {
      errors.value.unique_view = 'Please share your unique view (at least 10 characters)'
    }
  }

  if (step === 4) {
    if (!form.value.discovery_source) {
      errors.value.discovery_source = 'Please tell us how you heard about us'
    }
  }

  if (step === 5) {
    if (!form.value.agree_terms) {
      errors.value.agree_terms = 'You must agree to the Terms of Membership'
    }
    if (!form.value.agree_privacy) {
      errors.value.agree_privacy = 'You must agree to the Privacy Policy'
    }
    if (!form.value.agree_profile_visible) {
      errors.value.agree_profile_visible = 'You must acknowledge that your profile will be visible'
    }
  }

  return Object.keys(errors.value).length === 0
}

function nextStep() {
  if (validateStep(currentStep.value)) {
    if (currentStep.value < totalSteps - 1) {
      currentStep.value++
      window.scrollTo(0, 0)
    }
  }
}


function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
    window.scrollTo(0, 0)
  }
}

// Helper to ensure URL has protocol
function ensureHttps(url: string): string {
  if (!url) return url
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`
  }
  return url
}

async function handleSubmit() {
  if (!validateStep(currentStep.value)) return

  authStore.clearError()

  const additionalLinks = form.value.additional_links
    .filter(link => link.url.trim() !== '')
    .map(link => ({
      label: link.label.trim() || undefined,
      url: ensureHttps(link.url)
    }))

  const result = await authStore.register({
    full_name: `${form.value.first_name.trim()} ${form.value.last_name.trim()}`.trim(),
    first_name: form.value.first_name.trim(),
    last_name: form.value.last_name.trim(),
    email: form.value.email,
    password: form.value.password,
    password_confirm: form.value.password_confirm,
    phone: form.value.phone || undefined,
    city: form.value.city,
    country: form.value.country,
    primary_skill_id: form.value.primary_skill_id!,
    other_skill_ids: form.value.other_skill_ids.length > 0 ? form.value.other_skill_ids : undefined,
    experience_level: form.value.experience_level as ExperienceLevel,
    portfolio_url: ensureHttps(form.value.portfolio_url),
    additional_links: additionalLinks.length > 0 ? additionalLinks : undefined,
    bio: form.value.bio,
    cover_letter: form.value.cover_letter || undefined,
    recent_work: form.value.recent_work,
    unique_view: form.value.unique_view,
    is_og_member: form.value.is_og_member,
    og_member_details: form.value.og_member_details || undefined,
    discovery_source: form.value.discovery_source as DiscoverySource,
    scout_code: form.value.scout_code || undefined
  })

  if (result.success) {
    registrationComplete.value = true
  }
}


function addLink() {
  if (form.value.additional_links.length < 5) {
    form.value.additional_links.push({ label: '', url: '' })
  }
}

function removeLink(index: number) {
  if (form.value.additional_links.length > 1) {
    form.value.additional_links.splice(index, 1)
  }
}
</script>

<template>
  <div class="application-page">
    <header class="application-header">
      <RouterLink to="/" class="application-brand" aria-label="SENPAI COLLECTIVE home">
        <img src="/senpai_logo.svg" alt="" width="44" height="44" />
        <span>SENPAI<small>COLLECTIVE</small></span>
      </RouterLink>
      <div class="application-header-actions">
        <p>Already have an account? <RouterLink to="/login">Sign in</RouterLink></p>
        <RouterLink to="/" class="close-application" aria-label="Close application and return to the homepage"><XMarkIcon /></RouterLink>
      </div>
    </header>

    <div class="application-layout" :class="{ 'application-finished': registrationComplete }">
      <aside class="application-sidebar">
        <p class="application-eyebrow">Your application</p>
        <h1>Apply to join<br /><em>the collective.</em></h1>
        <p class="sidebar-caption">Skill. Ambition. Character.</p>
        <nav v-if="!registrationComplete" aria-label="Application progress">
          <ol class="application-steps">
            <li v-for="(title, index) in stepTitles" :key="title" :class="{ active: index === currentStep, completed: index < currentStep }" :aria-current="index === currentStep ? 'step' : undefined">
              <span class="sidebar-step-number"><CheckIcon v-if="index < currentStep" aria-hidden="true" /><span v-else>{{ String(index + 1).padStart(2, '0') }}</span></span>
              <span>{{ title }}<span v-if="index < currentStep" class="sr-only"> — completed</span></span>
            </li>
          </ol>
        </nav>
        <div class="sidebar-art">
          <img src="/illustrations/collective-orbit.svg" alt="Creative disciplines connected through the collective" width="600" height="300" />
          <p>Independent minds.<br /><strong>Something bigger, together.</strong></p>
        </div>
        <a class="application-parent" href="https://senpaifutures.com/" target="_blank" rel="noopener noreferrer"><img src="/senpai.svg" width="30" height="28" alt="" /><span>A <strong>SENPAI FUTURES</strong> company</span></a>
      </aside>

      <main class="application-main" id="application-content">
      <!-- Registration Complete -->
      <div v-if="registrationComplete" class="application-success">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Application submitted</h2>
        <!-- Confirming the email is a required step, not a courtesy, so it is
             the whole message here rather than a clause inside a thank-you. -->
        <p class="text-gray-700 mb-4">
          <strong>Check your email — or your spam folder — and confirm your address.</strong>
          We don't review your application until you do.
        </p>
        <p class="text-sm text-gray-500 mb-8">
          Once it's confirmed we review every application carefully, and we'll email you our decision.
        </p>
        <!-- Deliberately not a "Go to login" button: sign-in refuses
             unconfirmed accounts, so it sent every new applicant straight into
             an error on the one action we offered them. -->
        <RouterLink to="/" class="text-sm font-medium text-senpai-600 hover:text-senpai-700">
          Back to the homepage
        </RouterLink>
      </div>

      <!-- Registration Form -->
      <div v-else class="application-panel">
        <!-- Progress Bar -->
        <div class="application-progress">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-900">Step {{ currentStep + 1 }} of {{ totalSteps }}</span>
            <span class="text-sm text-gray-500">{{ stepTitles[currentStep] }}</span>
          </div>
          <div class="progress-track" role="progressbar" :aria-valuenow="currentStep + 1" :aria-valuemin="1" :aria-valuemax="totalSteps" :aria-valuetext="`Step ${currentStep + 1} of ${totalSteps}: ${stepTitles[currentStep]}`" aria-label="Application progress">
            <div
              class="progress-fill"
              :style="{ width: `${((currentStep + 1) / totalSteps) * 100}%` }"
            />
          </div>
        </div>

        <!-- Loading -->
        <div v-if="currentStep === 2 && skillsStore.loading" class="application-loading" role="status" aria-label="Loading skills">
          <LoadingSpinner size="lg" />
        </div>

        <!-- Form Steps -->
        <form v-else @submit.prevent="currentStep === 5 ? handleSubmit() : nextStep()" class="application-form">
          <!-- Scout invite confirmation (auto-applied from a ?ref= invite link) -->
          <div
            v-if="scoutCode"
            class="mb-6 flex items-center gap-3 rounded-lg bg-senpai-50 border border-senpai-200 px-4 py-3 text-sm text-senpai-800"
          >
            <span v-if="referringScout" class="h-9 w-9 rounded-full overflow-hidden shrink-0 bg-white ring-2 ring-senpai-200">
              <img v-if="referringScout.photo_url" :src="referringScout.photo_url" :alt="referringScout.full_name" class="h-full w-full object-cover" />
              <span v-else class="h-full w-full flex items-center justify-center text-xs font-medium text-senpai-600">
                {{ referringScout.full_name.split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase() }}
              </span>
            </span>
            <svg v-else class="h-5 w-5 flex-shrink-0 text-senpai-600" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              <template v-if="referringScout">
                You were invited by <span class="font-semibold">{{ referringScout.full_name }}</span> — this application is linked to their invite.
              </template>
              <template v-else>
                You were invited by a scout — invite code
                <span class="font-mono font-semibold">{{ scoutCode }}</span>
                is applied to your application.
              </template>
            </span>
          </div>

          <BaseAlert v-if="authStore.error" type="error" class="mb-6" dismissible @dismiss="authStore.clearError">
            {{ authStore.error }}
          </BaseAlert>

          <header v-if="currentStep > 0" class="form-step-heading">
            <p class="application-eyebrow">Your application / {{ String(currentStep + 1).padStart(2, '0') }}</p>
            <h2>{{ stepTitles[currentStep] }}</h2>
          </header>
          <BaseAlert v-if="currentStep === 2 && skillsStore.error" type="error" class="mb-6">
            We couldn’t load the skill list. Please try again.
            <button type="button" class="retry-skills" @click="skillsStore.fetchSkills()">Retry loading skills</button>
          </BaseAlert>

          <!-- Step 0: Philosophy Intro -->
          <div v-if="currentStep === 0" class="introduction space-y-8">
            <!-- Header -->
            <div class="intro-heading">
              <p class="application-eyebrow">SENPAI COLLECTIVE</p>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">Before You Apply</h2>
              <p class="text-gray-600">Read this carefully. This is who we are.</p>
            </div>

            <!-- Mission - Full Version -->
            <div class="mission-panel">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Our Mission</h3>
              <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ SENPAI_MANIFESTO.mission.replace(/\bSenpai\b/g, 'SENPAI') }}</p>
            </div>

            <!-- Core Values - Vertical List -->
            <div>
              <div class="flex items-center gap-3 mb-4">
                <img src="/corevalues.svg" alt="Core Values" class="h-10 w-auto" />
                <h3 class="text-lg font-semibold text-gray-900">Our Six Core Values</h3>
              </div>
              <div class="space-y-4">
                <div
                  v-for="(value, index) in SENPAI_MANIFESTO.values"
                  :key="value.name"
                  class="value-row"
                >
                  <span class="value-number">
                    {{ index + 1 }}
                  </span>
                  <div>
                    <h4 class="font-semibold text-gray-900 mb-1">{{ value.name }}</h4>
                    <p class="text-sm text-gray-600">{{ value.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- What We Expect -->
            <div class="expectations-panel">
              <h3 class="text-lg font-semibold mb-4">What We Expect From Members</h3>
              <ul class="space-y-3">
                <li
                  v-for="(expectation, index) in SENPAI_MANIFESTO.expectations"
                  :key="index"
                  class="flex items-start"
                >
                  <svg class="h-5 w-5 expectation-check mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span class="font-medium">{{ expectation.title }}:</span>
                    <span class="expectation-description"> {{ expectation.description }}</span>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Action Buttons -->
            <div class="pt-4">
              <BaseButton
                type="button"
                @click="nextStep"
                class="application-primary begin-application"
              >
                I Want to Apply <ArrowRightIcon class="h-5 w-5" />
              </BaseButton>
              <div class="text-center mt-4">
                <RouterLink
                  to="/"
                  class="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  No thanks, take me back
                </RouterLink>
              </div>
            </div>

            <!-- Footer -->
            <div class="text-center pt-4 border-t border-gray-200">
              <a href="https://senpaifutures.com/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 text-sm text-gray-500 hover:opacity-80 transition-opacity">
                <img src="/senpai.svg" alt="" class="h-5 w-auto" />
                <span>A <strong class="font-medium text-gray-700">SENPAI FUTURES</strong> company</span>
              </a>
            </div>
          </div>

          <!-- Step 1: Basic Info -->
          <div v-if="currentStep === 1" class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <BaseInput
                v-model="form.first_name"
                label="First Name"
                placeholder="John"
                :error="errors.first_name"
                name="given-name"
                autocomplete="given-name"
                required
              />
              <BaseInput
                v-model="form.last_name"
                label="Last Name"
                placeholder="Doe"
                :error="errors.last_name"
                name="family-name"
                autocomplete="family-name"
                required
              />
            </div>

            <BaseInput
              v-model="form.email"
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              :error="errors.email"
              name="email"
              autocomplete="email"
              required
            />

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <BaseInput
                v-model="form.password"
                type="password"
                label="Password"
                placeholder="Create a strong password"
                :error="errors.password"
                name="new-password"
                autocomplete="new-password"
                required
              />

              <BaseInput
                v-model="form.password_confirm"
                type="password"
                label="Confirm Password"
                placeholder="Confirm your password"
                :error="errors.password_confirm"
                name="confirm-password"
                autocomplete="new-password"
                required
              />
            </div>

            <!-- Live password requirements -->
            <ul v-if="form.password.length > 0" class="-mt-3 space-y-1">
              <li
                v-for="check in passwordChecks"
                :key="check.label"
                class="flex items-center gap-2 text-sm"
                :class="check.met ? 'text-green-600' : 'text-gray-400'"
              >
                <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path v-if="check.met" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  <circle v-else cx="12" cy="12" r="9" stroke-width="1.5" />
                </svg>
                {{ check.label }}
              </li>
            </ul>

            <BaseInput
              v-model="form.phone"
              label="Phone/WhatsApp"
              placeholder="+234123456789"
              hint="Optional - for easier communication"
            />

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <BaseInput
                v-model="form.city"
                label="City"
                placeholder="Lagos"
                :error="errors.city"
                required
              />

              <BaseInput
                v-model="form.country"
                label="Country"
                placeholder="Nigeria"
                :error="errors.country"
                required
              />
            </div>
          </div>

          <!-- Step 2: Skills & Work -->
          <div v-if="currentStep === 2" class="space-y-6">
            <BaseSelect
              v-model="form.primary_skill_id"
              :options="skillOptions"
              label="Primary Skill"
              placeholder="Select your main skill"
              :error="errors.primary_skill_id"
              required
            />

            <BaseMultiSelect
              v-model="form.other_skill_ids"
              :options="otherSkillOptions"
              label="Other Skills"
              placeholder="Select additional skills"
              :max="5"
            />

            <BaseSelect
              v-model="form.experience_level"
              :options="experienceLevelOptions"
              label="Experience Level"
              placeholder="Select your experience level"
              :error="errors.experience_level"
              required
            />

            <BaseInput
              v-model="form.portfolio_url"
              label="Portfolio/Work Link"
              placeholder="https://yourportfolio.com"
              :error="errors.portfolio_url"
              hint="Share your best work - Behance, Dribbble, personal site, etc."
              required
            />

            <div class="space-y-4">
              <label class="block text-sm font-medium text-gray-700">Additional Links (Optional)</label>
              <div
                v-for="(link, index) in form.additional_links"
                :key="index"
                class="flex items-start gap-2 p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex-1 space-y-2">
                  <BaseInput
                    v-model="link.label"
                    placeholder="Label (e.g., GitHub, LinkedIn)"
                    class="text-sm"
                  />
                  <BaseInput
                    v-model="link.url"
                    :placeholder="index === 0 ? 'https://github.com/username' : 'https://...'"
                  />
                </div>
                <button
                  v-if="form.additional_links.length > 1"
                  type="button"
                  @click="removeLink(index)"
                  class="p-2 text-gray-400 hover:text-red-500 transition-colors mt-1"
                  title="Remove link"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <button
                v-if="form.additional_links.length < 5"
                type="button"
                @click="addLink"
                class="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add another link
              </button>
            </div>
          </div>

          <!-- Step 3: About You -->
          <div v-if="currentStep === 3" class="space-y-6">
            <BaseTextarea
              v-model="form.bio"
              label="Bio"
              placeholder="Tell us about yourself, your background, and what you're passionate about..."
              :maxlength="500"
              :rows="4"
              :error="errors.bio"
              required
            />

            <BaseTextarea
              v-model="form.recent_work"
              label="What have you built or created lately?"
              placeholder="Tell us about your recent projects, work, or creative endeavors. What are you most proud of?"
              :maxlength="1000"
              :rows="4"
              :error="errors.recent_work"
              required
            />

            <BaseTextarea
              v-model="form.unique_view"
              label="What is your unique view on life?"
              placeholder="Share your perspective, philosophy, or approach to creativity and work. What drives you?"
              :maxlength="1000"
              :rows="4"
              :error="errors.unique_view"
              required
            />

            <BaseTextarea
              v-model="form.cover_letter"
              label="Why do you want to join SENPAI? (Optional)"
              placeholder="What excites you about joining this community? What are you hoping to gain and contribute?"
              :maxlength="2000"
              :rows="4"
            />
          </div>

          <!-- Step 4: Community History -->
          <div v-if="currentStep === 4" class="space-y-6">
            <div>
              <BaseCheckbox
                v-model="form.is_og_member"
                label="Were you part of the original SENPAI community?"
              />

              <div v-if="form.is_og_member" class="mt-4 ml-7">
                <BaseTextarea
                  v-model="form.og_member_details"
                  label="How were you involved?"
                  placeholder="Tell us about your previous involvement with SENPAI..."
                  :maxlength="500"
                  :rows="3"
                />
              </div>
            </div>

            <BaseSelect
              v-model="form.discovery_source"
              :options="discoverySourceOptions"
              label="How did you hear about SENPAI?"
              placeholder="Select an option"
              :error="errors.discovery_source"
              required
            />

            <BaseInput
              v-model="form.scout_code"
              label="Scout/Referral Code"
              placeholder="ABC123"
              hint="If someone invited you, enter their code here"
            />
          </div>

          <!-- Step 5: Terms & Agreement -->
          <div v-if="currentStep === 5" class="space-y-6">
            <div class="agreement-panel">
              <h3 class="font-medium text-gray-900 mb-4">Before you submit</h3>
              <p class="text-sm text-gray-600 mb-4">
                Please review and agree to the following to complete your application:
              </p>

              <div class="space-y-4">
                <BaseCheckbox v-model="form.agree_terms" :error="errors.agree_terms">
                  I agree to the
                  <RouterLink
                    to="/terms"
                    target="_blank"
                    class="text-senpai-600 underline hover:text-senpai-700"
                    @click.stop
                  >Terms of Membership</RouterLink>
                </BaseCheckbox>

                <BaseCheckbox v-model="form.agree_privacy" :error="errors.agree_privacy">
                  I agree to the
                  <RouterLink
                    to="/privacy"
                    target="_blank"
                    class="text-senpai-600 underline hover:text-senpai-700"
                    @click.stop
                  >Privacy Policy</RouterLink>
                </BaseCheckbox>

                <BaseCheckbox
                  v-model="form.agree_profile_visible"
                  label="I understand my profile will be visible to other members (if accepted)"
                  :error="errors.agree_profile_visible"
                />
              </div>
            </div>

            <div class="next-steps-panel">
              <h4 class="font-medium text-gray-900 mb-2">What happens next?</h4>
              <ol class="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>You'll receive an email to verify your account</li>
                <li>Our team will review your application</li>
                <li>We'll email you our decision — we review every application carefully</li>
              </ol>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div v-if="currentStep > 0" class="form-navigation">
            <BaseButton
              v-if="currentStep > 1"
              type="button"
              variant="outline"
              class="application-secondary"
              :disabled="authStore.loading"
              @click="prevStep"
            >
              <ArrowLeftIcon class="h-4 w-4" /> Previous
            </BaseButton>
            <div v-else />

            <BaseButton
              type="submit"
              :loading="authStore.loading"
              class="application-primary"
            >
              {{ currentStep === 5 ? 'Submit Application' : 'Continue' }} <ArrowRightIcon v-if="!authStore.loading" class="h-4 w-4" />
            </BaseButton>
          </div>
        </form>
      </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.application-page {
  --application-ink: #162b23;
  --application-line: #d5dfd4;
  min-height: 100vh;
  background: #fbfcfa;
  color: var(--application-ink);
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.application-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 88px;
  padding: 18px max(32px, calc((100vw - 1260px) / 2));
  border-bottom: 1px solid var(--application-line);
}
.application-brand { display: inline-flex; align-items: center; gap: 11px; text-decoration: none; color: var(--application-ink); font-size: 25px; font-weight: 800; letter-spacing: .2px; line-height: 1; }
.application-brand img { display: block; width: 44px; height: 44px; flex: 0 0 44px; object-fit: contain; }
.application-brand small { display: block; margin-top: 5px; font-size: 12px; font-weight: 500; letter-spacing: 1.3px; }
.application-header-actions { display: flex; align-items: center; gap: 28px; }
.application-header-actions p { font-size: 14px; color: #647267; }
.application-header-actions p a { margin-left: 6px; color: #244e3e; font-weight: 600; text-underline-offset: 4px; }
.application-header-actions p a:hover { text-decoration: underline; }
.close-application { display: grid; place-items: center; width: 42px; height: 42px; border: 1px solid var(--application-line); color: #617267; }
.close-application svg { width: 20px; height: 20px; }
.close-application:hover { background: #eaf0e6; }
.application-layout { display: grid; grid-template-columns: 310px minmax(0, 790px); gap: 80px; width: min(1180px, calc(100% - 64px)); margin: 54px auto 0; padding-bottom: 72px; align-items: start; }
.application-sidebar { position: sticky; top: 28px; }
.application-eyebrow { font-size: 12px; font-weight: 600; letter-spacing: 1.7px; text-transform: uppercase; line-height: 1.6; color: #587361; margin: 0; }
.application-sidebar h1 { margin: 20px 0 0; font-size: 44px; font-weight: 550; line-height: 1.13; letter-spacing: -1.8px; }
.application-sidebar h1 em { color: #28786a; font-family: Georgia, 'Times New Roman', serif; font-weight: 400; }
.sidebar-caption { font-size: 14px; color: #6d7d6e; margin-top: 18px; }
.application-steps { list-style: none; padding: 0; margin: 32px 0 0; }
.application-steps li { display: flex; align-items: center; gap: 14px; min-height: 51px; font-size: 14px; color: #637263; }
.sidebar-step-number { display: grid; place-items: center; width: 29px; height: 29px; flex: 0 0 29px; border: 1px solid #ccd7c9; border-radius: 50%; font-size: 12px; font-family: monospace; }
.sidebar-step-number svg { width: 16px; height: 16px; }
.application-steps .active { font-weight: 600; color: #164f3e; }
.active .sidebar-step-number { background: #1f5745; border-color: #1f5745; color: white; }
.completed .sidebar-step-number { background: #dcece0; border-color: #c5dccb; color: #276b50; }
.sidebar-art { padding-top: 25px; border-top: 1px solid var(--application-line); margin-top: 30px; }
.sidebar-art img { display: block; width: 100%; height: auto; aspect-ratio: 2; }
.sidebar-art p { font-size: 14px; line-height: 1.7; color: #687767; margin-top: 14px; }
.sidebar-art strong { color: #344d39; font-weight: 500; }
.application-parent { display: inline-flex; align-items: center; gap: 10px; color: #6c7a6c; margin-top: 24px; font-size: 12px; text-decoration: none; }
.application-parent img { width: 30px; height: 28px; object-fit: contain; }
.application-parent strong { color: #385b45; }
.application-main { min-width: 0; }
.application-panel { background: white; border: 1px solid var(--application-line); }
.application-progress { padding: 25px 36px 24px; border-bottom: 1px solid var(--application-line); background: #f5f6f4; }
.progress-track { height: 3px; width: 100%; background: #d6e1d3; margin-top: 15px; }
.progress-fill { height: 3px; background: #2d8878; transition: width .3s ease; }
.application-loading { display: flex; justify-content: center; padding: 70px; }
.application-form { padding: 36px; }
.form-step-heading { margin-bottom: 30px; }
.form-step-heading h2, .intro-heading h2 { font-size: 34px; font-weight: 550; line-height: 1.15; letter-spacing: -1px; color: var(--application-ink); margin: 14px 0 12px; }
.intro-heading > p:last-child { font-size: 16px; line-height: 1.7; color: #637060; }
.mission-panel { padding: 32px; background: #242828; border: 1px solid #242828; }
.mission-panel h3 { color: #d5eacb; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }
.mission-panel p { color: #f0f5e9; font-size: 16px; line-height: 1.85; }
.value-row { display: flex; align-items: flex-start; gap: 17px; padding: 18px 0; border-bottom: 1px solid var(--application-line); }
.value-number { display: grid; place-items: center; width: 30px; height: 30px; flex: 0 0 30px; background: #e6efe1; color: #3c6a46; font-size: 12px; font-family: monospace; }
.value-row h4 { font-size: 17px; font-weight: 550; }
.value-row p { font-size: 15px; line-height: 1.75; color: #64715f; }
.expectations-panel { padding: 28px; background: #f7f3ea; border: 1px solid #dce0ca; color: #354831; }
.expectations-panel h3 { color: #283e28; }
.expectations-panel li { font-size: 15px; line-height: 1.8; }
.expectation-check { color: #668048; }
.expectation-description { color: #5f6b4e; }
.application-form :deep(input:not([type='checkbox'])),
.application-form :deep(textarea),
.application-form :deep(button[aria-haspopup='listbox']) { min-height: 49px; border-radius: 3px; font-size: 16px; background-color: #fcfdf9; padding-top: 12px; padding-bottom: 12px; }
.application-form :deep(input.border-gray-300),
.application-form :deep(textarea.border-gray-300),
.application-form :deep(button[aria-haspopup='listbox'].border-gray-300) { border-color: #c6d3c5; }
.application-form :deep(input::placeholder), .application-form :deep(textarea::placeholder) { color: #889386; }
.application-form :deep(label) { font-size: 14px; line-height: 1.7; }
.application-form :deep(textarea) { resize: vertical; line-height: 1.8; }
.application-form :deep(input[type='checkbox']) { width: 18px; height: 18px; accent-color: #277d64; }
.application-form :deep([role='listbox']) { border-radius: 3px; font-size: 16px; }
.application-form :deep([role='option']) { padding-top: 12px; padding-bottom: 12px; }
.application-primary, .application-secondary { display: inline-flex; align-items: center; justify-content: center; gap: 14px; min-height: 50px; padding: 14px 22px; border-radius: 2px; font-size: 15px; font-weight: 550; }
.application-primary { background: #242828; color: white; border: 1px solid #242828; }
.application-primary:hover { background: #383e3e; }
.application-secondary { background: transparent; color: #36533c; border: 1px solid #bccdbb; }
.application-secondary:hover { background: #edf3e9; }
.begin-application { width: 100%; min-height: 54px; }
.form-navigation { display: flex; justify-content: space-between; gap: 20px; margin-top: 36px; padding-top: 25px; border-top: 1px solid var(--application-line); }
.agreement-panel, .next-steps-panel { padding: 26px; border: 1px solid var(--application-line); background: #f5f6f4; }
.next-steps-panel { background: #fcfdf9; }
.next-steps-panel ol { font-size: 14px; line-height: 1.9; }
.retry-skills { display: block; margin-top: 10px; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
.application-success { border: 1px solid var(--application-line); padding: 60px 42px; text-align: center; background: white; }
.application-success h2 { font-size: 32px; letter-spacing: -.8px; font-weight: 550; }
.application-success p { line-height: 1.8; }
.application-page a:focus-visible, .application-page button:focus-visible { outline: 3px solid #2b8974; outline-offset: 4px; }
@media (max-width: 1100px) {
  .application-layout { grid-template-columns: 265px minmax(0, 1fr); gap: 40px; }
  .application-sidebar h1 { font-size: 39px; }
  .application-form { padding: 28px; }
  .application-progress { padding-inline: 28px; }
}
@media (max-height: 900px) and (min-width: 801px) { .sidebar-art { display: none; } }
@media (max-width: 800px) {
  .application-layout { display: block; width: min(700px, calc(100% - 40px)); margin-top: 36px; }
  .application-sidebar { position: static; margin-bottom: 30px; }
  .application-sidebar h1 { font-size: 42px; }
  .application-sidebar h1 br { display: none; }
  .sidebar-caption { margin-top: 12px; }
  .application-steps, .sidebar-art, .application-parent { display: none; }
  .application-header { padding-inline: 20px; }
  .application-header-actions p { font-size: 0; }
  .application-header-actions p a { font-size: 14px; }
  .application-header-actions { gap: 14px; }
}
@media (max-width: 480px) {
  .application-layout { width: calc(100% - 28px); margin-top: 28px; padding-bottom: 40px; }
  .application-header { min-height: 76px; padding: 14px; gap: 12px; }
  .application-brand { font-size: 21px; gap: 8px; }
  .application-brand img { width: 36px; height: 36px; flex-basis: 36px; }
  .application-brand small { font-size: 12px; letter-spacing: .6px; }
  .application-header-actions { gap: 8px; }
  .close-application { width: 36px; height: 36px; }
  .application-sidebar { padding-inline: 8px; }
  .application-sidebar h1 { font-size: 35px; letter-spacing: -1.2px; }
  .application-form { padding: 24px 20px; }
  .application-progress { padding: 20px; }
  .application-progress > div:first-child { gap: 14px; }
  .application-progress > div:first-child > span { font-size: 12px; }
  .form-step-heading h2, .intro-heading h2 { font-size: 30px; }
  .mission-panel, .expectations-panel { padding: 24px 20px; }
  .mission-panel p { font-size: 16px; line-height: 1.8; }
  .value-row { gap: 12px; }
  .agreement-panel, .next-steps-panel { padding: 20px; }
  .application-primary, .application-secondary { padding: 13px 16px; gap: 8px; font-size: 14px; }
  .application-success { padding: 40px 24px; }
}
@media (prefers-reduced-motion: reduce) { .progress-fill { transition: none; } }
</style>
