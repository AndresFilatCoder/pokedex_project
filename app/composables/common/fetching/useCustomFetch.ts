import type { UseFetchOptions } from 'nuxt/app'

const useCustomFetch = () => {
  const runtime = useRuntimeConfig()
  const { apiUrl } = runtime.public

  const getOptions = <T>(options: UseFetchOptions<T> = {}) => ({
    baseURL: apiUrl,
    immediate: options.immediate ?? false,
    ...options
  })

  const fetch = async <T>(url: string | (() => string), options: UseFetchOptions<T> = {}) => {
    const { data, error, execute } = useFetch(url, getOptions(options))
    await execute()
    return { data, error }
  }

  return {
    async post<T>(url: string | (() => string), options: UseFetchOptions<T> = {}) {
      options.method = 'POST'
      options.dedupe = 'cancel'
      return await fetch(url, { ...options })
    },
    async $post<T>(url: string | (() => string), options: UseFetchOptions<T> = {}) {
      options.method = 'POST'
      options.dedupe = 'defer'
      return await fetch(url, { ...options })
    },
    async get<T>(url: string | (() => string), options: UseFetchOptions<T> = {}) {
      options.method = 'GET'
      options.dedupe = 'cancel'
      return await fetch(url, { ...options })
    },
    async $get<T>(url: string | (() => string), options: UseFetchOptions<T> = {}) {
      options.method = 'GET'
      options.dedupe = 'defer'
      return await fetch(url, { ...options })
    },
    async put<T>(url: string | (() => string), options: UseFetchOptions<T> = {}) {
      options.method = 'PUT'
      options.dedupe = 'cancel'
      return await fetch(url, { ...options })
    },
    async $put<T>(url: string | (() => string), options: UseFetchOptions<T> = {}) {
      options.method = 'PUT'
      options.dedupe = 'defer'
      return await fetch(url, { ...options })
    },
    async patch<T>(url: string | (() => string), options: UseFetchOptions<T> = {}) {
      options.method = 'PATCH'
      options.dedupe = 'cancel'
      return await fetch(url, { ...options })
    },
    async $patch<T>(url: string | (() => string), options: UseFetchOptions<T> = {}) {
      options.method = 'PATCH'
      options.dedupe = 'defer'
      return await fetch(url, { ...options })
    },
    async delete<T>(url: string | (() => string), options: UseFetchOptions<T> = {}) {
      options.method = 'DELETE'
      options.dedupe = 'cancel'
      return await fetch(url, { ...options })
    },
    async $delete<T>(url: string | (() => string), options: UseFetchOptions<T> = {}) {
      options.method = 'DELETE'
      options.dedupe = 'defer'
      return await fetch(url, { ...options })
    }
  }
}

export default useCustomFetch
