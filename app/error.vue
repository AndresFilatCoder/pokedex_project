<script setup lang="ts">
defineProps<{
  error: {
    statusCode: number
    statusMessage: string
  }
}>()
</script>

<template>
  <main class="flex min-h-dvh items-center justify-center bg-surface px-6">
    <div class="flex max-w-5xl flex-col items-center gap-12 md:flex-row">
      <div class="flex justify-center">
        <img src="/gifs/pokemon-confused.gif" alt="Pokémon confundido" class="w-72 md:w-96" />
      </div>

      <div class="text-center md:text-left">
        <span class="text-sm font-semibold uppercase tracking-[0.3em] text-heart"> Error </span>

        <h1 class="mt-2 text-7xl font-extrabold text-ink">
          {{ error.statusCode }}
        </h1>

        <h2 class="mt-3 text-3xl font-bold text-ink">
          {{ error.statusMessage }}
        </h2>

        <p class="mt-4 max-w-md text-zinc-500">
          Parece que este Pokémon se perdió y la página que buscas no existe o fue movida a otra
          ubicación.
        </p>

        <UButton to="/" size="xl" class="mt-8 rounded-full"> Volver al inicio </UButton>
      </div>
    </div>
  </main>
</template>
