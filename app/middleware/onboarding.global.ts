import { ROUTES } from '~/constants/routes'

/**
 * El onboarding es solo para usuarios nuevos: quien no lo haya completado
 * es redirigido a él, y quien ya pasó por él no puede volver a verlo.
 *
 * La comprobación es solo de cliente porque la marca se persiste en
 * localStorage, al que el servidor no tiene acceso.
 */
export default defineNuxtRouteMiddleware(to => {
  if (import.meta.server) return

  const { onboardingCompleted } = storeToRefs(useOnboardingStore())
  const isOnboardingRoute = to.path === ROUTES.onboarding

  if (isOnboardingRoute && onboardingCompleted.value) return navigateTo(ROUTES.pokedex)
  if (!isOnboardingRoute && !onboardingCompleted.value) return navigateTo(ROUTES.onboarding)
})
