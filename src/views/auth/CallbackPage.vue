<script setup lang="ts">
import AuthLayout from '@/components/layout/AuthLayout.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { completeZitadelLogin } from '@/lib/oidc'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const message = ref('Signing you in…')
const failed = ref(false)

onMounted(async () => {
  try {
    // Finish the redirect from Zitadel and grab the ID token.
    const user = await completeZitadelLogin()
    if (!user.id_token) throw new Error('No identity token returned')

    // Trade it with our backend for a Senpai session.
    const result = await authStore.loginWithZitadel(user.id_token)

    if (result.success) {
      router.replace('/dashboard')
      return
    }

    // Verified identity, but not (yet) a member.
    if (result.reason === 'no_membership') {
      message.value = 'Identity verified — but you are not a member yet. Taking you to the application…'
      router.replace({ name: 'join', query: { email: result.email, name: result.name } })
      return
    }
    if (result.reason === 'pending_approval') {
      router.replace({ name: 'pending' })
      return
    }

    failed.value = true
    message.value = authStore.error || 'Sign in failed. Please try again.'
  } catch (e: any) {
    failed.value = true
    message.value = e?.message || 'Sign in failed. Please try again.'
  }
})
</script>

<template>
  <AuthLayout :title="failed ? 'Sign in failed' : 'Signing you in…'" eyebrow="Your account">
    <div class="text-center" role="status">
      <LoadingSpinner v-if="!failed" size="lg" class="mx-auto mb-6" />
      <p class="text-gray-700">{{ message }}</p>
      <RouterLink v-if="failed" to="/login" class="auth-primary mt-6">Back to sign in</RouterLink>
    </div>
  </AuthLayout>
</template>
