# Pokédex — Plan de implementación

> Estado del proyecto y plan por fases.
> **Proyecto completado. Las siete fases están cerradas.**

---

## 1. Análisis del proyecto existente

### Stack instalado (verificado en `package.json`)

| Tecnología | Versión |
| --- | --- |
| Nuxt | 4.5.0 |
| Vue | 3.5.40 |
| TypeScript | 6.0.3 |
| Tailwind CSS | 4.3.3 |
| Nuxt UI | 4.10.0 |
| Pinia | 4.0.2 + `pinia-plugin-persistedstate` 4.7.1 |
| Iconify | solo la colección `@iconify-json/uil` |

Configuración ya presente: `runtimeConfig.public.apiUrl = https://pokeapi.co/api/v2`, `titleTemplate: '%s - PokePage'`, `ui.colorMode: false`, ESLint + Prettier (sin `;`, comillas simples, 100 cols).

### Estructura actual

Páginas vacías (`index`, `favorites`, `regions`, `profile`), un layout `default` sin contenido, `useCustomFetch` completo y funcional, `usePokemon` con dos métodos de ejemplo, y `error.vue` para el 404.

### Defectos detectados en la base (a corregir en Fase 1)

1. **`app/services/usePokemon.ts` no compila**: usa los tipos `Pokemon`, `PokemonDetails` y `PokemonList`, que **no están definidos en ningún archivo** del proyecto. No existe carpeta `types/`.
2. **`app/error.vue` usa `<Button>`**, componente inexistente. En Nuxt UI el componente es `<UButton>`.
3. **`app/plugins/seo.global.ts` apunta a `/img/pikachu-silhouette.png`**, ruta que no existe (`public/img/` no existe; las imágenes están en `public/images/`).

### Recursos gráficos

`graphic_identity` está en **`public/graphic_identity/`** (13 diseños, todos inspeccionados). Imágenes disponibles en `public/images/`, todas con destino asignado:

| Imagen | Uso |
| --- | --- |
| `bug_catcher_and_professor.png` | Onboarding paso 1 |
| `hilda.png` | Onboarding paso 2 |
| `magikarp.png` | Favoritos vacío + error de petición |
| `jigglypuff.png` | Regiones / Perfil ("Muy pronto disponible") |
| `pokeball.png` | Loader (rotación 360°) |
| `gifs/pokemon-confused.gif` | Error 404 (ya en uso) |

**Faltan** las formas decorativas del panel derecho de cada card (hoja para Planta, llama para Fuego, etc.) y los iconos de cada tipo dentro de los badges. Se resolverán con gradiente CSS + Iconify, dejando `<!-- TODO: Add image -->` donde corresponda.

### Validación de la PokeAPI (endpoints probados con datos reales)

- `GET /pokemon?limit=100000` → **1.351** Pokémon (solo `name` + `url`, sin tipos ni sprite).
- `GET /pokemon/{name}` → tipos, `height` (dm), `weight` (hg), habilidades, sprites.
  Bulbasaur: `weight 69` → **6,9 kg**; `height 7` → **0,7 m**. Coincide con el diseño.
- `GET /pokemon-species/{id}` → descripción en español, `genera` (`Pokémon Semilla` → **SEMILLA**) y `gender_rate: 1` → **87,5 % ♂ / 12,5 % ♀**. Coincide con el diseño.
- `GET /ability/overgrow` → nombre es-ES **"Espesura"**. Coincide con el diseño.
- `GET /type` → 21 tipos; `GET /type/{name}` → nombre en español (Agua, Dragón, Eléctrico, Hada, Fantasma, Fuego…) exactamente como el modal del diseño, `damage_relations` y la lista de Pokémon de ese tipo.

**Debilidades:** el diseño muestra para Bulbasaur (planta/veneno) → Fuego, Psíquico, Hielo, Volador. Eso **no** es la unión de `double_damage_from`; es el cálculo multiplicativo real de efectividad combinando ambos tipos (planta+veneno anula bicho, veneno y tierra). Se implementará el cálculo completo con `double/half/no_damage_from`.

---

## 2. Decisiones aprobadas

| Tema | Decisión |
| --- | --- |
| Carga del listado | Índice completo en 1 petición + carga progresiva de detalles en tandas de 30 con scroll infinito |
| Barra de filtros | Solo en Pokédex y Favoritos (según diseños) |
| Botón lupa del diseño | Decorativo; se añade un botón "Filtros" aparte que abre el modal de tipos |
| Navegación | Barra superior en ≥768 px, tab bar inferior en móvil |
| Dependencias | **No se instala ninguna nueva.** Si un icono no existe se usa el más parecido |

### Supuestos declarados (avísame si alguno no aplica)

- **Varios tipos seleccionados = unión (OR)**: al marcar Fuego y Planta se muestran los Pokémon de fuego *o* de planta. La intersección devolvería casi siempre 0 resultados.
- **Color de la card** = tipo principal (primer tipo del array de la API), como en el diseño.
- **Desmarcar favorito** se hace con el corazón. El panel rojo de papelera de `favorites_page_remove_pokemon_of_favorite_list` es un gesto de *swipe* móvil; en web se implementará solo el corazón, salvo que pidas lo contrario.
- **Pokémon sin género** (`gender_rate: -1`): se ocultará la barra de género en lugar de mostrar 0 % / 0 %.
- Se usa únicamente la colección Iconify ya instalada (`@iconify-json/uil`, Unicons). Los iconos por defecto de Nuxt UI, que son de Lucide, se reasignan a Unicons para no añadir dependencias ni depender de la API remota de Iconify.

---

## 3. Arquitectura propuesta

```
app/
├── assets/css/main.css          # tokens de color por tipo + utilidades
├── components/
│   ├── common/                  # AppLoader, AppFeedbackState, AppErrorState, ComingSoon
│   ├── layout/                  # AppNavbar, AppPageHeader
│   ├── onboarding/              # OnboardingSlide, OnboardingDots
│   ├── filters/                 # PokemonFilterBar, PokemonTypeFilterModal, FilterResultsSummary
│   └── pokemon/                 # PokemonCard, PokemonCardSkeleton, PokemonTypeBadge,
│                                # PokemonFavoriteButton, PokemonGrid, PokemonDetailCard,
│                                # PokemonGenderBar, PokemonInfoBox
├── composables/
│   ├── common/fetching/useCustomFetch.ts   (existente, sin cambios)
│   ├── common/utils.ts                     (existente)
│   ├── usePokemonList.ts        # índice + carga progresiva + filtros aplicados
│   ├── usePokemonDetails.ts     # detalle + species + debilidades
│   └── usePokemonTypes.ts       # catálogo de tipos en español
├── constants/pokemon.ts         # colores, iconos y traducciones por tipo, PAGE_SIZE
├── layouts/
│   ├── default.vue              # con navbar
│   └── blank.vue                # onboarding, sin navbar
├── middleware/onboarding.global.ts
├── pages/
│   ├── index.vue · onboarding.vue · favorites.vue
│   ├── details/[id].vue
│   └── regions.vue · profile.vue · [...slug].vue
├── services/usePokemon.ts       # capa HTTP pura sobre la PokeAPI
├── stores/                      # onboarding, favorites, filters
├── types/                       # pokemon.ts, api.ts
└── utils/                       # formateo + cálculo de efectividad
```

Separación de responsabilidades: **servicio** (HTTP crudo) → **composable** (orquestación, estado de carga/error) → **store** (estado persistente compartido) → **componente** (presentación).

---

## 4. Fases

### Fase 1 — Base y arquitectura ✅
Tipado completo de la PokeAPI en `app/types/`; corrección de los 3 defectos detectados; ampliación del servicio `usePokemon` (índice, detalle, species, tipos, relaciones de daño); constantes de tipo (color, icono, nombre en español); tokens CSS por tipo en `main.css`; stores Pinia `onboarding`, `favorites` y `filters` con persistencia; layouts `default` y `blank`; componentes comunes `AppLoader` (pokeball girando), `AppErrorState` (`request_error`), `AppFeedbackState` y `ComingSoon`.

**Archivos creados**

| Archivo | Contenido |
| --- | --- |
| `app/types/api.ts` · `app/types/pokemon.ts` | Tipos de la PokeAPI y modelos de interfaz (`PokemonSummary`, `PokemonTypeOption`) |
| `app/constants/pokemon.ts` | Tamaño de tanda, catálogo de tipos, iconos y nombres de respaldo |
| `app/utils/pokemon.ts` | `formatPokemonNumber`, `normalizeText`, `getIdFromResourceUrl`, `toPokemonSummary`, … |
| `app/services/usePokemon.ts` | Capa HTTP: índice, detalle, especie, habilidad, tipos y relaciones de daño |
| `app/stores/useOnboardingStore.ts` | `onboardingCompleted` persistido |
| `app/stores/useFavoritesStore.ts` | Favoritos persistidos con `add` / `remove` / `toggle` / `isFavorite` |
| `app/stores/useFiltersStore.ts` | Filtros compartidos de nombre y tipos (sin persistir) |
| `app/components/common/*` | `AppLoader`, `AppFeedbackState`, `AppErrorState`, `ComingSoon` |
| `app/layouts/blank.vue` | Layout sin navbar para el onboarding |

**Decisiones técnicas de esta fase**

- **Iconos:** Unicons no tiene hoja ni dragón. Planta usa `i-uil-flower` y Dragón `i-uil-tornado`, los más parecidos disponibles. Los 43 iconos internos de Nuxt UI se reasignaron a Unicons desde `appConfig` en `nuxt.config.ts`; ya no se solicita ningún icono de Lucide.
- **Paleta:** los colores se extrajeron píxel a píxel de los diseños. Confirmados desde la imagen: Planta `#97C15D`, Veneno `#9031A9`, Fuego `#F19E38`, Psíquico `#603BAC`, Hielo `#5587F8`, Volador `#55B9D1`, azul de botones `#4386DE`, azul activo `#233CA0`, fondo `#FAFAFA`. Los 13 tipos restantes usan el color canónico de la saga ajustado al mismo tono.
- **Un solo color por tipo:** el tono claro de las cards se deriva con `color-mix(base 55%, white)`, fórmula que reproduce los valores exactos del diseño (Fuego `#F19E38` → `#F4CC87`; Planta `#97C15D` → `#C7DEA8`). Cada card solo necesita `data-pokemon-type="fire"` y las variables `--type-base`, `--type-soft` y `--type-tint` quedan resueltas.
- **`@theme static`:** obligatorio. Nuxt UI enlaza su color primario con `--color-pokedex-*` en tiempo de ejecución y Tailwind v4 descartaba esas variables por no verlas usadas, dejando los botones sin fondo.
- **Sprites:** se usa `sprites.front_default` (pixel art) en lugar del render oficial, porque es la estética de todos los diseños. Se añadió la utilidad `pixelated` para escalarlos sin difuminar.
- **Persistencia en `localStorage`:** `pinia-plugin-persistedstate` guarda en cookies por defecto; la lista de favoritos superaría el límite de 4 KB y viajaría en cada petición.
- **Contexto de Nuxt:** `usePokemon` captura `useNuxtApp()` y envuelve cada petición en `runWithContext`, para que `useFetch` siga funcionando en las peticiones encadenadas de la carga progresiva (Fase 3).
- `app/services` no se auto-importa en Nuxt; se registró vía `imports.dirs`. Los componentes se auto-importan sin prefijo de carpeta (`<AppLoader />`).

**Verificación:** `tsc --noEmit` sin errores, `eslint` sin avisos y `nuxt build` correcto. Se comprobó en el servidor de desarrollo, con una página temporal ya eliminada, que el índice devuelve 1.351 Pokémon, que `/type/grass` traduce a "Planta", que los tres stores operan y que los componentes, los tokens de color y el color primario de Nuxt UI se resuelven en el HTML y el CSS generados.

**Dato útil:** los archivos de `public/graphic_identity` son JPEG con extensión `.png`.

**Queda para su fase:** el cálculo de debilidades se implementará en la Fase 6, junto a la pantalla que lo consume.

### Fase 2 — Onboarding, middleware y navegación ✅
Página `/onboarding` de 2 pasos con transición, dots de progreso y botones "Continuar" / "Empecemos" (sin retroceso); persistencia de `onboardingCompleted`; middleware global de cliente que redirige a `/onboarding` a quien no lo haya completado; `AppNavbar` responsive (superior en desktop, inferior en móvil) en el layout `default`; páginas Regiones y Perfil con `ComingSoon`; `useSeoMeta` por página.

**Archivos creados**

| Archivo | Contenido |
| --- | --- |
| `app/constants/routes.ts` | Rutas de la aplicación y opciones del menú |
| `app/constants/onboarding.ts` | Contenido de los dos pasos (imagen, textos y botón) |
| `app/pages/onboarding.vue` | Paso actual, transición y cierre del onboarding |
| `app/components/onboarding/OnboardingSlide.vue` · `OnboardingDots.vue` | Contenido de cada paso e indicador de progreso |
| `app/middleware/onboarding.global.ts` | Redirección según `onboardingCompleted` |
| `app/components/layout/AppNavbar.vue` | Cabecera en escritorio y barra inferior en móvil |
| `app/layouts/default.vue` | Contenedor con navegación y espacio para la barra inferior |

**Decisiones de esta fase**

- **El onboarding no se puede revisitar:** quien ya lo completó y entra a `/onboarding` es redirigido al listado. Se desprende de que el onboarding es solo para usuarios nuevos.
- **Sin retroceso:** el paso solo avanza; no existe ninguna acción que lo disminuya.
- **Menú en un solo componente:** `AppNavbar` pinta la cabecera de escritorio y la barra inferior de móvil desde la misma lista de opciones, alternando con `md:`. Su raíz usa `contents` para no crear una caja propia, que impediría fijar la cabecera al hacer scroll.
- **Enlace activo:** se usa `exact-active-class` en lugar de `active-class`, porque la ruta `/` de Pokedex es prefijo de todas y quedaría siempre marcada.
- **Textos del menú:** se usan los del requerimiento, con "Favoritos" en mayúscula inicial como las otras tres opciones; en los diseños aparece en minúscula.
- **Iconos:** los del menú son de trazo y en los diseños son sólidos. La colección instalada es Unicons Line; las variantes sólidas son paquetes aparte que no se instalan.
- Los estados centrados (`AppFeedbackState`) se alinean al centro vertical del área visible, como en los diseños.

**Verificación en navegador (Chrome, 430 px y 1440 px):** entrar a `/favorites` sin haber pasado el onboarding redirige a él; "Continuar" lleva al paso 2 con los dots invertidos; "Empecemos" guarda `{"onboardingCompleted":true}` en localStorage y lleva al listado; volver a `/onboarding` redirige al listado y recargar `/favorites` ya no redirige. Sin errores ni avisos de hidratación en consola. `tsc`, `eslint` y `nuxt build` correctos.

### Fase 3 — Listado de Pokémon ✅
Carga del índice y de detalles por tandas con scroll infinito; `PokemonCard` con color por tipo principal, número, nombre, badges de tipo y botón de favorito; grid responsive; skeletons durante la carga; estado de error con reintento; card clicable hacia el detalle.

**Archivos creados**

| Archivo | Contenido |
| --- | --- |
| `app/composables/usePokemonList.ts` | Índice, caché de detalles, tandas y estados de carga y error |
| `app/components/pokemon/PokemonCard.vue` | Card completa con enlace, sprite y color del tipo principal |
| `app/components/pokemon/PokemonTypeBadge.vue` | Distintivo con el color y el icono de su propio tipo |
| `app/components/pokemon/PokemonFavoriteButton.vue` | Botón de corazón conectado al store |
| `app/components/pokemon/PokemonGrid.vue` · `PokemonCardSkeleton.vue` | Rejilla responsive y card de carga |

**Decisiones de esta fase**

- **Caché por nombre:** los detalles se guardan en un `Map` dentro de `useState`, así que volver a un tramo ya visto no repite peticiones y navegar al detalle y regresar conserva el listado. La Fase 4 aprovechará esta caché al filtrar.
- **Enlace extendido:** la card es un `article` con un enlace absoluto que la cubre, en lugar de envolverlo todo en un `NuxtLink`. Evita anidar el botón de favorito dentro de un enlace y mantiene el HTML válido.
- **Scroll infinito con `IntersectionObserver`** sobre un elemento centinela, con 400 px de margen para que la siguiente tanda llegue antes de alcanzar el final. El observador se reengancha mediante un `watch` sobre la referencia, porque el centinela desaparece cuando ya no queda nada por cargar.
- **Sprites a tamaño completo del panel:** los sprites de la PokeAPI traen mucho margen transparente, así que a tamaño fijo se veían mucho menores que en los diseños.
- **Silueta decorativa:** no existe la imagen de la hoja, la llama ni las demás siluetas del panel derecho. Se sustituye por un degradado radial con el color del tipo y queda marcado con `TODO: Add image`.
- **Corazón:** Unicons no incluye ningún corazón sólido, así que el marcado se distingue por el color (rojo `#D9443F`) manteniendo el trazo. En los diseños el corazón marcado es sólido.
- **Rejilla:** una columna en móvil como en los diseños, dos desde 768 px y tres desde 1280 px.

**Verificación en navegador (Chrome, 430 px y 1440 px):** el listado carga 30 cards y el scroll infinito llega a 90; marcar un favorito lo persiste, no navega y **el Pokémon sigue en el listado general**; pulsar la card navega a `/details/{id}`; simulando una caída de la API aparece la interfaz de error y "Reintentar" recupera el listado; ralentizando las peticiones se ven las 30 cards de carga. `tsc`, `eslint` y `nuxt build` correctos.

**Nota:** las cards ya enlazan a `/details/{id}`, cuya página llega en la Fase 6; hasta entonces esa ruta cae en el 404.

### Fase 4 — Filtros ✅
Barra de búsqueda sin debounce con filtro *case-insensitive* tipo `icontains`; modal de tipos con checkboxes múltiples, scroll y botones Aplicar / Cancelar; combinación de ambos filtros; resumen "Se han encontrado N resultados" + "Borrar filtro"; estado sin resultados. Reutilizable en Pokédex y Favoritos.

**Archivos creados**

| Archivo | Contenido |
| --- | --- |
| `app/composables/usePokemonTypes.ts` | Catálogo de tipos y pertenencia de cada Pokémon a ellos |
| `app/components/filters/PokemonFilterBar.vue` | Búsqueda, acceso al modal y resumen de resultados |
| `app/components/filters/PokemonTypeFilterModal.vue` | Selección múltiple de tipos con Aplicar y Cancelar |
| `app/components/filters/FilterResultsSummary.vue` | Recuento y botón "Borrar filtro" |
| `app/utils/filters.ts` | Predicados de nombre y de tipos, compartidos con Favoritos |

**Decisiones de esta fase**

- **Una sola carga resuelve el modal y el filtrado:** el detalle de cada tipo trae a la vez su nombre en español y la lista de Pokémon que lo tienen, así que las 21 peticiones se hacen una única vez y quedan en caché.
- **Los filtros se aplican sobre el índice completo**, no sobre lo ya cargado: buscar "bul" encuentra a Tadbulb aunque nunca se haya desplazado hasta él. Al cambiar un filtro el listado vuelve a la primera tanda y pide solo los detalles que falten.
- **Varios tipos se combinan como unión**, según el supuesto declarado: "Planta" y "Veneno" devuelve los de planta *o* de veneno.
- **Tipos sin ningún Pokémon fuera del modal:** la PokeAPI devuelve 21 tipos, entre ellos algunos sin miembros que solo darían cero resultados. El criterio es la propia respuesta de la API, no una lista fija.
- **La selección del modal es un borrador:** solo llega al store al pulsar "Aplicar", de modo que "Cancelar" descarta los cambios.
- **Modal centrado en lugar de hoja inferior:** el diseño móvil muestra una hoja que sube desde abajo; en web se adapta como modal centrado con desplazamiento interno.
- **Texto del buscador:** el diseño dice "Procurar Pókemon...", que no es español. Se usa "Buscar Pokémon...".
- La barra de filtros permanece montada mientras se recargan los resultados, para que el campo no pierda el foco al escribir.

**Fallo corregido durante la verificación:** al escribir rápido, el contador mostraba 5 resultados pero solo se pintaban 3 cards. Cada pulsación lanza una carga y las nuevas se descartaban mientras había una en curso, dejando el listado desincronizado respecto al texto escrito. Ahora cada carga lleva un identificador y solo la última puede escribir el resultado.

**Verificación en navegador (Chrome, 430 px y 1440 px):** "BUL" en mayúsculas encuentra los 5 Pokémon que contienen "bul" en cualquier posición; el modal lista los tipos en español desde la API con desplazamiento; marcar Planta y Veneno junto a "BUL" deja 2 resultados; "Cancelar" descarta la selección; "Borrar filtro" restaura los 30 iniciales; una búsqueda sin coincidencias muestra "0 resultados" y la interfaz correspondiente. `tsc`, `eslint` y `nuxt build` correctos.

**Cambio pedido aparte:** el corazón de favoritos ahora se pinta relleno en rojo. Ambos trazados salen del icono `uil:heart` —el original y el mismo sin su contorno interior— para que la silueta sea idéntica en los dos estados sin añadir dependencias.

### Fase 5 — Favoritos ✅
Página `/favorites` con cabecera, listado desde el store persistido, desmarcado por corazón, estado vacío (`favorites_page_list_of_favorite_pokemons_empty`) y filtros de la Fase 4 integrados.

**Archivos creados**

| Archivo | Contenido |
| --- | --- |
| `app/pages/favorites.vue` | Listado filtrado de favoritos y sus estados vacíos |
| `app/components/layout/AppPageHeader.vue` | Cabecera con flecha de retroceso y título centrado |

**Decisiones de esta fase**

- **Filtrado sin API:** los favoritos guardan sus tipos, así que se filtran en memoria con los mismos predicados que usa el listado general (`app/utils/filters.ts`). No hacen falta peticiones.
- **Dos estados vacíos distintos:** sin ningún favorito se muestra la interfaz del diseño, y si los filtros no encuentran coincidencias se muestra el aviso de búsqueda sin resultados. La barra de filtros solo aparece cuando hay favoritos que filtrar.
- **`ClientOnly` en el listado:** los favoritos viven en el navegador, así que el servidor los renderizaría siempre vacíos y provocaría un desajuste al hidratar. Mientras tanto se muestra el loader.
- **Contenedor más ancho (`max-w-7xl`):** en tres columnas las cards quedaban estrechas y los distintivos de tipos largos, como "Fantasma" y "Veneno", se partían en dos líneas. Ahora las cards se acercan al ancho del diseño original.
- **Cursor de los botones:** Tailwind v4 dejó de aplicar el cursor de mano en `button`, así que se restaura desde `main.css` para todos a la vez, en lugar de repetir la utilidad en cada componente.

**Verificación en navegador (Chrome, 430 px y 1440 px):** sin favoritos aparece la interfaz del diseño; con cuatro favoritos se listan correctamente; buscar "CHA" deja 1 resultado y el texto concuerda en singular; filtrar por "Fuego" deja solo a Charmeleon; el filtro aplicado se conserva al pasar al listado general, donde devuelve 109 Pokémon de fuego; desmarcar un favorito lo quita del listado y de `localStorage`; al desmarcar el último vuelve la interfaz de lista vacía. `tsc`, `eslint` y `nuxt build` correctos.

### Fase 6 — Detalle del Pokémon ✅
Página `/details/[id]` con la card completa: sprite sobre panel de color, número, nombre, badges, descripción en español, peso, altura, categoría, habilidad, barra de género, debilidades calculadas, botón de favorito, retroceso, loader y estado de error; SEO dinámico con el nombre del Pokémon.

**Archivos creados**

| Archivo | Contenido |
| --- | --- |
| `app/pages/details/[id].vue` | Carga del detalle y sus estados |
| `app/composables/usePokemonDetail.ts` | Combina Pokémon, especie, habilidad y tipos |
| `app/utils/effectiveness.ts` | Cálculo de debilidades |
| `app/components/pokemon/PokemonDetailCard.vue` | Ficha completa según el diseño |
| `app/components/pokemon/PokemonInfoBox.vue` · `PokemonGenderBar.vue` | Recuadros de datos y barra de género |

**Decisiones de esta fase**

- **Las debilidades se calculan multiplicando efectividades**, no uniendo los `double_damage_from` de cada tipo. Un segundo tipo puede resistir lo que el primero encaja mal: Bulbasaur, de planta y veneno, no es débil a bicho, veneno ni tierra, aunque la planta sí lo sea. Solo se evalúan los tipos que dañan el doble a alguno de sus tipos, porque ningún otro puede superar el daño normal.
- **Cuatro recursos combinados:** el Pokémon da tipos, medidas y habilidad; la especie da descripción, categoría y género; la habilidad da su nombre en español; y cada tipo, sus relaciones de daño.
- **Categoría:** la API devuelve "Pokémon Semilla" y el diseño solo muestra "SEMILLA", así que se recorta el prefijo.
- **Habilidad principal, no oculta:** el diseño muestra una sola, y la primera no oculta es la que corresponde.
- **Sin género la barra desaparece**, según el supuesto declarado. Se comprobó con Magnemite.
- **Retroceso al origen:** la flecha vuelve a la página anterior, sea el listado general o el de favoritos, y cae en la Pokédex si se entró por enlace directo.
- **Adaptación a escritorio:** columna centrada de ancho máximo, conservando el diseño vertical. El panel de color llega a los bordes en móvil, como en el diseño.
- Se añadió la variante `plain` al botón de favorito, porque en la cabecera del detalle el corazón va sin el círculo de fondo.

**Verificación en navegador (Chrome, 430 px y 1440 px):** Bulbasaur reproduce el diseño dato por dato — 6,9 kg, 0,7 m, SEMILLA, Espesura, 87,5 % / 12,5 % — y sus debilidades son **Volador, Fuego, Hielo y Psíquico**, exactamente las cuatro del diseño. Magnemite oculta la barra de género y muestra Tierra, Lucha y Fuego. Un id inexistente muestra la interfaz de error. Marcar favorito desde el detalle lo persiste, y la flecha devuelve al listado sin recargarlo. `tsc`, `eslint` y `nuxt build` correctos.

### Fase 7 — Pulido final ✅
Revisión de animaciones y transiciones, accesibilidad (foco, `aria-label`, navegación por teclado), ajuste responsive, ejecución de ESLint/Prettier y verificación del build.

**Correcciones**

- **Un error al hacer scroll ya no borra el listado.** Si fallaba una tanda intermedia, el estado de error sustituía a las cards ya cargadas y se perdía todo el avance. Ahora ese estado solo ocupa la pantalla cuando no hay nada cargado; si ya hay resultados aparece al final de la lista y su botón reintenta únicamente la tanda que falló. El error también se limpia al empezar cada intento.
- **El contorno de foco de las cards era invisible.** Se dibujaba por fuera del enlace y la card lo recortaba con `overflow-hidden`. Ahora va hacia dentro y se ve al recorrer con el tabulador.
- **Jerarquía de encabezados:** cada página tiene un único `h1`. El listado lleva uno para lectores de pantalla, ya que el diseño no muestra título, y los estados que son el contenido principal de su página lo indican con `title-tag`.
- **Degradado duplicado:** la misma regla estaba repetida en la card del listado y en la del detalle. Ahora vive en `main.css` y el centro se ajusta con variables.
- **Cursor de los botones** restaurado globalmente, y la página 404 alineada con la paleta del proyecto.
- Se retiraron bloques `<script setup>` vacíos.

**Sobre las transiciones:** se probó añadir una transición entre páginas, pero no se incluye. En el navegador automatizado la ventana está oculta, Chrome detiene `requestAnimationFrame` y Vue nunca retira la clase inicial, de modo que **cualquier** transición CSS queda congelada y no se puede verificar. Como es un extra no pedido y su fallo dejaría páginas sin cambiar, se descartó. La transición del onboarding sí se mantiene: quedó verificada funcionando.

**Verificación final:** navegación completa entre las cinco páginas en dos ciclos, sin contenido obsoleto; foco por teclado visible en cards y botones; diseño correcto a 375, 430, 1024 y 1440 px; flujo de onboarding desde cero hasta el listado. Sin `any` ni `@ts-ignore` en todo el proyecto. `tsc`, `eslint` y `nuxt build` correctos.

**Pendientes conocidos:** los dos `TODO: Add image` de la silueta decorativa del tipo, en la card del listado y en la del detalle.

**Añadido en esta fase:** funcionalidad de copiar en el portapapeles el nombre del Pokémon junto con sus detalles separados por coma desde la card del detalle.

---

### Añadido posterior — sonido del Pokémon ✅

Al montarse la página de detalle suena el grito del Pokémon, mediante `usePlayAudio`.

- El campo `cries` de la PokeAPI trae `latest` y `legacy`; se usa `latest` y se recurre a `legacy` porque en varias formas falta uno de los dos. Si no hay ninguno, no suena.
- `usePlayAudio` ignora el rechazo de `play()`: el navegador bloquea la reproducción automática cuando el usuario todavía no ha interactuado con la página, y sin capturarlo aparecería un error en consola al entrar al detalle por enlace directo.

**Verificación en navegador:** al abrir el detalle de Charmander se crea un único audio con la url `.../cries/pokemon/latest/4.ogg` y se llama a `play()` una sola vez; el clip carga y avanza hasta 0,47 s de sus 0,72 s de duración.

---

## 5. Registro de avance

| Fase | Estado | Fecha | Notas |
| --- | --- | --- | --- |
| 1 | ✅ Completada | 2026-08-12 | Base de datos, estado y estilos. Sin dependencias nuevas |
| 2 | ✅ Completada | 2026-08-12 | Onboarding, middleware global y navegación |
| 3 | ✅ Completada | 2026-08-12 | Listado, carga progresiva y favoritos |
| 4 | ✅ Completada | 2026-08-12 | Filtros combinables, recuento y limpieza |
| 5 | ✅ Completada | 2026-08-12 | Favoritos con filtros y estados vacíos |
| 6 | ✅ Completada | 2026-08-12 | Detalle con debilidades calculadas |
| 7 | ✅ Completada | 2026-08-12 | Accesibilidad, foco, estados de error y limpieza |
