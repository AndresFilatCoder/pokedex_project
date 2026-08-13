const timeout = ref<ReturnType<typeof setTimeout>>()

export const useDelay = (callback: () => void, delay: number) => {
  clearTimeout(timeout.value)
  timeout.value = setTimeout(() => callback(), delay)
}

export const usePlayAudio = (audioUrl: string) => {
  const audio = new Audio(audioUrl)
  audio.play()
}

export const useClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text)
}
