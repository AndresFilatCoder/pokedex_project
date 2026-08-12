const timeout = ref()

export const useDelay = (callback: any, delay: number) => {
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
