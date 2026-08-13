# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Pokédex construida con Nuxt 4 (Vue 3, Composition API) sobre la PokeAPI. El código va en inglés
(variables, funciones, tipos); el texto visible para el usuario y los comentarios, en español.

## Comandos

```bash
npm run dev          # servidor de desarrollo en :3000
npm run build        # compilación
npm test             # todas las pruebas unitarias
npm run test:watch   # pruebas en modo observador
npm run typecheck    # vue-tsc: tipa también los .vue y las pruebas
npx eslint app/ test/ --fix
npx vitest run test/nuxt/utils/effectiveness.spec.ts   # un solo archivo
npx vitest run -t "marca y desmarca"                   # una sola prueba
```

`npm test`, `npm run test:watch` y `npm run typecheck` **solo existen en la rama `testing`**.

## Ramas

- `main`: configuración inicial.
- `dev`: toda la aplicación. Aquí van los cambios de funcionalidad.
- `testing`: parte de `dev` y añade Vitest y las pruebas. `git merge testing` desde `dev` es directo.

## Arquitectura

Flujo de datos en capas: **servicio → composable → store → componente**.

- `app/services/usePokemon.ts`: única capa HTTP. Solo resuelve peticiones, no transforma ni guarda estado.
- `app/composables/usePokemon*.ts`: orquestan peticiones y exponen `isLoading` / `error`.
- `app/stores/`: Pinia. `onboarding` y `favorites` persisten; `filters` no.
- `app/components/`: presentación, reciben todo por props.

### Carga del listado (`usePokemonList`)

El índice de la PokeAPI trae 1.351 Pokémon con solo nombre y url. La estrategia:

1. Una petición trae el índice completo.
2. Los detalles se piden por tandas de `POKEMON_PAGE_SIZE` y se guardan en un `Map` dentro de
   `useState`, así que volver atrás o repetir un tramo no vuelve a consultarlos.
3. **Los filtros se aplican sobre el índice completo**, no sobre lo ya cargado. Al cambiar un filtro
   el listado vuelve a la primera tanda y solo pide los detalles que falten.
4. El filtro por nombre no lleva debounce, así que cada pulsación lanza una carga. Un contador
   `currentRequest` garantiza que solo la última escriba el resultado; sin él el listado queda
   desincronizado respecto al texto escrito.

`usePokemonTypes` carga el detalle de los 21 tipos una sola vez y de ahí salen a la vez las opciones
traducidas del modal y la pertenencia de cada Pokémon a cada tipo.

### Color por tipo

Cada tipo define **un solo color base** en `app/assets/css/main.css`. Un elemento con
`data-pokemon-type="fire"` recibe `--type-base`, `--type-soft` (derivado con `color-mix`) y
`--type-tint`. Los distintivos llevan su propio `data-pokemon-type` para no heredar el de la card.

### Debilidades (`app/utils/effectiveness.ts`)

Se calculan multiplicando efectividades contra todos los tipos del Pokémon, **no** uniendo los
`double_damage_from`. El segundo tipo puede resistir lo que el primero encaja mal: Bulbasaur, de
planta y veneno, no es débil a bicho, veneno ni tierra.

## Configuración con motivo

Cambiar cualquiera de estos puntos rompe algo que no es evidente:

- **`@theme static` en `main.css`**: Nuxt UI enlaza su color primario con `--color-pokedex-*` en
  tiempo de ejecución y Tailwind v4 descarta las variables del `@theme` que no ve usadas. Sin
  `static`, los botones se quedan sin fondo.
- **Iconos de Nuxt UI en `nuxt.config.ts` bajo `appConfig`, no en `app/app.config.ts`**: el módulo lee
  `nuxt.options.appConfig` en tiempo de setup para decidir qué empaquetar. En `app.config.ts`
  funcionan en runtime pero se siguen pidiendo los iconos de Lucide.
- **Solo está instalada la colección `@iconify-json/uil`** (Unicons Line). No hay corazón sólido: el
  marcado usa `HEART_SOLID_PATH` de `constants/pokemon.ts`, que es el contorno exterior de
  `uil:heart`. Si falta un icono, usa el más parecido de `uil` antes que instalar otra colección.
- **`piniaPluginPersistedstate.storage: 'localStorage'`**: por defecto guarda en cookies y la lista
  de favoritos superaría los 4 KB y viajaría en cada petición.
- **`imports.dirs: ['services']`**: `app/services` no se auto-importa en Nuxt por defecto.
  `components` usa `pathPrefix: false`, así que se escribe `<AppLoader />`, no `<CommonAppLoader />`.
- **`usePokemon` captura `useNuxtApp()` y envuelve cada petición en `runWithContext`**: sin eso
  `useFetch` pierde el contexto de Nuxt en las peticiones encadenadas de la carga por tandas.
- **`useFetch` tipa la respuesta como `PickFrom<T, KeysOf<T>>`**, que TypeScript no reconcilia con un
  genérico abierto; el servicio hace un `as T` con ese motivo comentado.
- **El middleware de onboarding es solo de cliente** porque la marca vive en `localStorage`. La
  página de favoritos envuelve su listado en `ClientOnly` por lo mismo.

## Restricciones de código

- Prohibido `any` y `@ts-ignore`. `noUncheckedIndexedAccess` está activo: los accesos por índice
  devuelven `T | undefined`.
- ESLint aplica Prettier (sin punto y coma, comillas simples, 100 columnas) y prohíbe varias raíces
  en un `<template>`.
- Estilos con Tailwind. Solo se usa `<style>` cuando no hay alternativa.
- Peticiones HTTP siempre a través de `useCustomFetch`, nunca `$fetch` directo.

## Pruebas

Vitest con `environment: 'nuxt'`, para que las importaciones automáticas funcionen dentro de los
tests sin tocar el código de la aplicación.

- Viven en `test/nuxt/`, que es la ruta que la configuración de Nuxt incluye por convención; por eso
  `npm run typecheck` también las cubre.
- En pruebas de componente, **obtén el store después de `mountSuspended`**: el componente usa la
  instancia de Pinia de la app de Nuxt, no la que cree el test con `setActivePinia`.
- `matchesPokemonSearch` recibe el término **ya normalizado**; quien normaliza es el store.

## Diseños de referencia

Están en `public/graphic_identity/`. Son **JPEG con extensión `.png`**: para leerlos por píxeles hay
que convertirlos antes (`sips -s format png`).

Las siluetas decorativas del tipo (hoja, llama, gota…) no existen como imagen; se sustituyen por un
degradado y quedan marcadas con `TODO: Add image` en `PokemonCard.vue` y `PokemonDetailCard.vue`.

## Historial

`.claude/AI_PROGRESS.md` documenta las siete fases del desarrollo, con la decisión tomada en cada
punto y cómo se verificó. Consúltalo antes de cambiar algo que parezca arbitrario.
