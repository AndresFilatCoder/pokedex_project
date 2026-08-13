import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    // El entorno de Nuxt resuelve las importaciones automáticas que usan
    // las utilidades y los stores, sin tener que añadirlas al código.
    environment: 'nuxt',
    include: ['test/**/*.spec.ts']
  }
})
