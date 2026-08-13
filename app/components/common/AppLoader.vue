<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Ocupa toda la pantalla, como el splash del diseño. */
    fullscreen?: boolean
    size?: 'sm' | 'md' | 'lg'
    label?: string
  }>(),
  {
    fullscreen: false,
    size: 'md',
    label: 'Cargando Pokémon'
  }
)

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'size-8',
  md: 'size-16',
  lg: 'size-28 md:size-36'
}
</script>

<template>
  <div
    :class="[
      'flex flex-col items-center justify-center gap-4',
      fullscreen ? 'min-h-dvh w-full' : 'w-full py-10'
    ]"
    role="status"
    :aria-label="label"
  >
    <img
      src="/images/pokeball.png"
      alt=""
      aria-hidden="true"
      :class="[sizeClasses[size], 'animate-spin motion-reduce:animate-none']"
      style="animation-duration: 1.2s"
    />
    <span class="sr-only">{{ label }}</span>
  </div>
</template>
