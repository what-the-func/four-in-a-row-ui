<script lang="ts">
  import { board } from '$lib/stores/game'
  import { onDestroy, onMount } from 'svelte'
  import Cell from './Cell.svelte'
  import { gameService } from '$lib/stores/game'
  import type { GameInfo } from '$lib/types'
  import { wallet } from '$lib/stores/wallet'

  export let game: GameInfo
  let turn = 'Player 2'
  let myPlayer = game.p1.toLowerCase() === $wallet.address?.toLowerCase() ? 'Player 1' : 'Player 2'
  let ended = false

  const takeMove = async (col: number) => {
    await $gameService?.takeMove(game.id, col)
  }

  const updateBoard = async () => {
    const state = await $gameService?.getGameState(game.id)
    ended = state?.ended ?? false
    board.set(state?.board ?? [])
    turn = state?.turn ?? 'Player 2'
  }

  onMount(async () => {
    await updateBoard()
    $gameService?.subscribeToMoves(game.id, async () => await updateBoard())
    $gameService?.subscribeToGameEnd(game.id, () => {
      alert('GAME OVER')
    })
  })

  onDestroy(() => {
    $gameService?.removeSubscriptions()
  })
</script>

{#if !ended}
  <div>
    <div class="inline-block">Your color =</div>
    <div
      class={`rounded-full h-4 w-4 inline-block ml-2 ${
        myPlayer === 'Player 1' ? 'bg-red-700' : 'bg-yellow-500'
      }`}
    />
  </div>
  <h1 class="text-xl font-bold text-center mb-2">
    {turn === myPlayer ? 'Your Turn' : "Opponent's Turn"}
  </h1>
{:else}
  <h1 class="text-xl font-bold text-center mb-2">GAME OVER!</h1>
{/if}
<div class="grid grid-cols-7 grid-rows-5 gap-4">
  {#if !ended}
    {#each [...Array(7).keys()] as col}
      <button
        class="btn btn-ghost w-full text-center text-primary"
        on:click={() => takeMove(col)}
        disabled={$board[4][col] > 0 || myPlayer !== turn}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-10 h-10"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    {/each}
  {/if}
  {#each $board as _, row}
    {#each $board[4 - row] as val}
      <Cell {val} />
    {/each}
  {/each}
</div>
