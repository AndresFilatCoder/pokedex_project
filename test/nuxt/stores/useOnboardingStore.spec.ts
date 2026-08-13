import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useOnboardingStore } from '~/stores/useOnboardingStore'

describe('useOnboardingStore', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('un usuario nuevo no ha completado el onboarding', () => {
    expect(useOnboardingStore().onboardingCompleted).toBe(false)
  })

  it('marca el onboarding como completado', () => {
    const store = useOnboardingStore()
    store.completeOnboarding()

    expect(store.onboardingCompleted).toBe(true)
  })
})
