import type { Game } from '$lib/services/game'
import { writable } from 'svelte/store'
import type { Challenge } from '$lib/types'

const board = writable<number[][]>([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
])

const challenges = writable<Challenge[]>([])

const gameService = writable<Game | undefined>(undefined)

export { challenges, board, gameService }
