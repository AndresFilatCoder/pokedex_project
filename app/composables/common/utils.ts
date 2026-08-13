const timeout = ref<ReturnType<typeof setTimeout>>()

export const useDelay = (callback: () => void, delay: number) => {
  clearTimeout(timeout.value)
  timeout.value = setTimeout(() => callback(), delay)
}

export const usePlayAudio = (audioUrl: string) => {
  const audio = new Audio(audioUrl)
  // El navegador puede bloquear la reproducción si el usuario aún no ha
  // interactuado con la página; en ese caso simplemente no suena.
  audio.play().catch(() => undefined)
}

export const useClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text)
}
