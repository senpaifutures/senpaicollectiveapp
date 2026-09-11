<script setup lang="ts">
import AuthLayout from '@/components/layout/AuthLayout.vue'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const token = ref('')
const form = ref({
  password: '',
  password_confirm: ''
})
const errors = ref<Record<string, string>>({})
const success = ref(false)

onMounted(() => {
  token.value = (route.query.token as string) || ''

  if (!token.value) {
    router.push('/forgot-password')
  }
})

function validate(): boolean {
  errors.value = {}

  if (!form.value.password || form.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
  }

  if (form.value.password !== form.value.password_confirm) {
    errors.value.password_confirm = 'Passwords do not match'
  }

  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validate()) return

  authStore.clearError()
  const result = await authStore.resetPassword(
    token.value,
    form.value.password,
    form.value.password_confirm
  )

  if (result.success) {
    success.value = true
  }
}
</script>

<template>
  <AuthLayout title="Set new password" eyebrow="Account recovery">
    <template #intro><RouterLink to="/login">Back to sign in</RouterLink></template>
        <!-- Success State -->
        <div v-if="success" class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Password reset successful</h3>
          <p class="text-sm text-gray-600 mb-6">
            Your password has been reset. You can now sign in with your new password.
          </p>
          <RouterLink
            to="/login"
            class="auth-primary"
          >
            Sign in
          </RouterLink>
        </div>

        <!-- Form State -->
        <div v-else>
          <BaseAlert v-if="authStore.error" type="error" class="mb-6" dismissible @dismiss="authStore.clearError">
            {{ authStore.error }}
          </BaseAlert>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <BaseInput
              v-model="form.password"
              type="password"
              label="New Password"
              name="new-password"
              autocomplete="new-password"
              placeholder="Min 8 characters"
              :error="errors.password"
              required
            />

            <BaseInput
              v-model="form.password_confirm"
              type="password"
              label="Confirm New Password"
              name="confirm-password"
              autocomplete="new-password"
              placeholder="Confirm your password"
              :error="errors.password_confirm"
              required
            />

            <BaseButton
              type="submit"
              class="w-full"
              size="lg"
              :loading="authStore.loading"
            >
              Reset password
            </BaseButton>
          </form>
        </div>
  </AuthLayout>
</template>
