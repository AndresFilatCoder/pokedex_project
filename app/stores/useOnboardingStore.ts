/**
 * Marca si el usuario ya vio el onboarding. Se persiste para que un
 * recargado de página no vuelva a mostrarlo.
 */
export const useOnboardingStore = defineStore(
  'onboarding',
  () => {
    const onboardingCompleted = ref(false)

    const completeOnboarding = () => {
      onboardingCompleted.value = true
    }

    return { onboardingCompleted, completeOnboarding }
  },
  { persist: true }
)
