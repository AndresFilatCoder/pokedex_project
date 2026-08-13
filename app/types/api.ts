export interface NamedApiResource {
  name: string
  url: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface LocalizedName {
  name: string
  language: NamedApiResource
}
