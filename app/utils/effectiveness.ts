import type { PokemonTypeDetails, PokemonTypeName } from '~/types/pokemon'

const NO_DAMAGE = 0
const HALF_DAMAGE = 0.5
const NORMAL_DAMAGE = 1
const DOUBLE_DAMAGE = 2

/** Multiplicador de un tipo atacante contra un único tipo defensor. */
const getMultiplier = (attacker: string, defender: PokemonTypeDetails): number => {
  const { no_damage_from, half_damage_from, double_damage_from } = defender.damage_relations

  if (no_damage_from.some(type => type.name === attacker)) return NO_DAMAGE
  if (half_damage_from.some(type => type.name === attacker)) return HALF_DAMAGE
  if (double_damage_from.some(type => type.name === attacker)) return DOUBLE_DAMAGE

  return NORMAL_DAMAGE
}

/**
 * Debilidades reales de un Pokémon: los tipos cuyo daño combinado contra todos
 * sus tipos supera el normal.
 *
 * No basta con unir los `double_damage_from` de cada tipo, porque el segundo
 * tipo puede resistir lo que el primero encaja mal. Bulbasaur, de planta y
 * veneno, no es débil a bicho ni a veneno pese a que la planta sí lo sea.
 *
 * Solo se evalúan los tipos que dañan el doble a alguno de sus tipos: el resto
 * nunca puede llegar a superar el daño normal.
 */
export const getPokemonWeaknesses = (types: PokemonTypeDetails[]): PokemonTypeName[] => {
  const candidates = new Set(
    types.flatMap(type => type.damage_relations.double_damage_from.map(entry => entry.name))
  )

  return [...candidates].filter(candidate => {
    const damage = types.reduce(
      (total, defender) => total * getMultiplier(candidate, defender),
      NORMAL_DAMAGE
    )

    return damage > NORMAL_DAMAGE
  }) as PokemonTypeName[]
}
