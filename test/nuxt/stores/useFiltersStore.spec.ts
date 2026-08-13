import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useFiltersStore } from '~/stores/useFiltersStore'

describe('useFiltersStore', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('empieza sin ningún filtro aplicado', () => {
    const store = useFiltersStore()

    expect(store.search).toBe('')
    expect(store.selectedTypes).toEqual([])
    expect(store.hasActiveFilters).toBe(false)
  })

  it('normaliza el texto de búsqueda', () => {
    const store = useFiltersStore()
    store.setSearch('  BULba ')

    expect(store.normalizedSearch).toBe('bulba')
    expect(store.hasActiveFilters).toBe(true)
  })

  it('guarda varios tipos seleccionados', () => {
    const store = useFiltersStore()
    store.setSelectedTypes(['grass', 'poison'])

    expect(store.selectedTypes).toEqual(['grass', 'poison'])
    expect(store.hasActiveFilters).toBe(true)
  })

  it('limpia los dos filtros a la vez', () => {
    const store = useFiltersStore()
    store.setSearch('bul')
    store.setSelectedTypes(['fire'])

    store.clearFilters()

    expect(store.search).toBe('')
    expect(store.selectedTypes).toEqual([])
    expect(store.hasActiveFilters).toBe(false)
  })
})
