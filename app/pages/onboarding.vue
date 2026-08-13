<script setup lang="ts">
import { ONBOARDING_STEPS } from '~/constants/onboarding'
import { ROUTES } from '~/constants/routes'

definePageMeta({ layout: 'blank' })

useSeoMeta({ title: 'Bienvenido' })

const onboardingStore = useOnboardingStore()

const currentStep = ref(0)
const step = computed(() => ONBOARDING_STEPS[currentStep.value])
const isLastStep = computed(() => currentStep.value === ONBOARDING_STEPS.length - 1)

/** Solo avanza: una vez pasado un paso no se puede volver atrás. */
const goToNextStep = async () => {
  if (!isLastStep.value) {
    currentStep.value += 1
    return
  }

  onboardingStore.completeOnboarding()
  await navigateTo(ROUTES.pokedex)
}
</script>

<template>
  <div
    v-if="step"
    class="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-between px-6 py-10 md:max-w-xl md:py-16"
  >
    <div class="flex flex-1 items-center justify-center overflow-hidden">
      <Transition
        mode="out-in"
        enter-active-class="transition duration-300 ease-out motion-reduce:transition-none"
        enter-from-class="opacity-0 translate-x-8"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition duration-200 ease-in motion-reduce:transition-none"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 -translate-x-8"
      >
        <OnboardingSlide :key="currentStep" :step="step" />
      </Transition>
    </div>

    <div class="mt-12 flex flex-col items-center gap-8">
      <OnboardingDots :total="ONBOARDING_STEPS.length" :current="currentStep" />

      <UButton
        block
        size="xl"
        class="justify-center rounded-full py-4 text-lg font-semibold"
        @click="goToNextStep"
      >
        {{ step.action }}
      </UButton>
    </div>
  </div>
</template>
