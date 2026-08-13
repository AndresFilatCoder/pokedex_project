<script setup lang="ts">
import { NAVIGATION_ITEMS, ROUTES } from '~/constants/routes'

const desktopLinkClass =
  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors'
const mobileLinkClass = 'flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors'
</script>

<template>
  <!-- `contents` evita crear una caja propia, para que la cabecera pueda fijarse al hacer scroll. -->
  <div class="contents">
    <header
      class="sticky top-0 z-40 hidden border-b border-zinc-200 bg-surface/90 backdrop-blur md:block"
    >
      <nav class="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <NuxtLink :to="ROUTES.pokedex" class="flex items-center gap-2.5">
          <img src="/images/pokeball.png" alt="" class="size-8" />
          <span class="text-lg font-bold tracking-tight text-ink">Pokédex</span>
        </NuxtLink>

        <ul class="flex items-center gap-1">
          <li v-for="item in NAVIGATION_ITEMS" :key="item.to">
            <NuxtLink
              :to="item.to"
              :class="[
                desktopLinkClass,
                'text-zinc-500 hover:bg-pokedex-50 hover:text-pokedex-800'
              ]"
              exact-active-class="!bg-pokedex-50 !text-pokedex-800 font-semibold"
            >
              <UIcon :name="item.icon" class="size-5" />
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </header>

    <nav
      class="fixed inset-x-0 bottom-0 z-40 rounded-t-3xl border-t border-zinc-200 bg-surface pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_12px_rgba(0,0,0,0.06)] md:hidden"
      aria-label="Navegación principal"
    >
      <ul class="flex items-stretch justify-around px-2 pt-1">
        <li v-for="item in NAVIGATION_ITEMS" :key="item.to" class="flex flex-1">
          <NuxtLink
            :to="item.to"
            :class="[mobileLinkClass, 'text-zinc-500']"
            exact-active-class="!text-pokedex-800 font-semibold"
          >
            <UIcon :name="item.icon" class="size-6" />
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>
