export interface OnboardingStep {
  image: string
  imageAlt: string
  title: string
  description: string
  /** Texto del botón que lleva al siguiente paso o cierra el onboarding. */
  action: string
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    image: '/images/bug_catcher_and_professor.png',
    imageAlt: 'Un cazabichos y un profesor Pokémon',
    title: 'Todos los Pokémon en un solo lugar',
    description:
      'Accede a una amplia lista de Pokémon de todas las generaciones creadas por Nintendo',
    action: 'Continuar'
  },
  {
    image: '/images/hilda.png',
    imageAlt: 'Entrenadora Pokémon',
    title: 'Mantén tu Pokédex actualizada',
    description:
      'Regístrate y guarda tu perfil, Pokémon favoritos, configuraciones y mucho más en la aplicación',
    action: 'Empecemos'
  }
]
