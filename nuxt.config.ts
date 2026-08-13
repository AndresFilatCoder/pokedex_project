// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt'],
  css: ['~/assets/css/main.css'],
  // Sin prefijo de carpeta: <AppLoader /> en lugar de <CommonAppLoader />.
  components: [{ path: '~/components', pathPrefix: false }],
  // Los servicios se auto-importan igual que los composables.
  imports: {
    dirs: ['services']
  },
  ui: {
    colorMode: false
  },
  /**
   * Nuxt UI resuelve colores e iconos desde `appConfig` en tiempo de módulo,
   * por eso se declaran aquí y no en un `app.config.ts` aparte.
   * Sus iconos por defecto son de Lucide: se reasignan a Unicons, la única
   * colección Iconify instalada, para no añadir dependencias ni depender de
   * la API remota de Iconify en producción.
   */
  appConfig: {
    ui: {
      colors: {
        primary: 'pokedex',
        neutral: 'zinc'
      },
      icons: {
        arrowDown: 'i-uil-arrow-down',
        arrowLeft: 'i-uil-arrow-left',
        arrowRight: 'i-uil-arrow-right',
        arrowUp: 'i-uil-arrow-up',
        caution: 'i-uil-exclamation-circle',
        check: 'i-uil-check',
        chevronDoubleLeft: 'i-uil-angle-double-left',
        chevronDoubleRight: 'i-uil-angle-double-right',
        chevronDown: 'i-uil-angle-down',
        chevronLeft: 'i-uil-angle-left',
        chevronRight: 'i-uil-angle-right',
        chevronUp: 'i-uil-angle-up',
        close: 'i-uil-times',
        copy: 'i-uil-copy',
        copyCheck: 'i-uil-file-check-alt',
        dark: 'i-uil-moon',
        drag: 'i-uil-grip-horizontal-line',
        ellipsis: 'i-uil-ellipsis-h',
        error: 'i-uil-times-circle',
        external: 'i-uil-external-link-alt',
        eye: 'i-uil-eye',
        eyeOff: 'i-uil-eye-slash',
        file: 'i-uil-file',
        folder: 'i-uil-folder',
        folderOpen: 'i-uil-folder-open',
        hash: 'i-uil-list-ol',
        info: 'i-uil-info-circle',
        light: 'i-uil-sun',
        loading: 'i-uil-spinner-alt',
        menu: 'i-uil-bars',
        minus: 'i-uil-minus',
        panelClose: 'i-uil-angle-double-left',
        panelOpen: 'i-uil-angle-double-right',
        plus: 'i-uil-plus',
        reload: 'i-uil-refresh',
        search: 'i-uil-search',
        stop: 'i-uil-square',
        star: 'i-uil-star',
        success: 'i-uil-check-circle',
        system: 'i-uil-desktop',
        tip: 'i-uil-lightbulb-alt',
        upload: 'i-uil-upload',
        warning: 'i-uil-exclamation-triangle'
      }
    }
  },
  // Los favoritos superan el límite de una cookie: se guardan en localStorage.
  piniaPluginPersistedstate: {
    storage: 'localStorage'
  },
  runtimeConfig: {
    public: {
      apiUrl: 'https://pokeapi.co/api/v2'
    }
  },
  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      titleTemplate: '%s - PokePage',
      title: 'PokePage'
    }
  }
})
