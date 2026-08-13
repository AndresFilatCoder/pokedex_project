export const ROUTES = {
  pokedex: '/',
  regions: '/regions',
  favorites: '/favorites',
  profile: '/profile',
  onboarding: '/onboarding',
  details: '/details'
} as const

export interface NavigationItem {
  label: string
  to: string
  icon: string
}

/** Opciones del menú, en el orden en que aparecen en los diseños. */
export const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: 'Pokedex', to: ROUTES.pokedex, icon: 'i-uil-estate' },
  { label: 'Regiones', to: ROUTES.regions, icon: 'i-uil-globe' },
  { label: 'Favoritos', to: ROUTES.favorites, icon: 'i-uil-heart' },
  { label: 'Perfil', to: ROUTES.profile, icon: 'i-uil-user' }
]
