<script lang="ts">
  import {
    Address,
    ConnectWallet,
    Board,
    ChallengeOpponent,
    ChallengeRequest,
  } from '$lib/components'
  import { wallet } from '$lib/stores/wallet'
  import { gameService, challenges } from '$lib/stores/game'
  import { onDestroy } from 'svelte'
  import type { GameInfo } from '$lib/types'

  let game: GameInfo | null = null
  let initialized = false

  onDestroy(() => {
    $gameService?.removeSubscriptions()
  })

  $: {
    if ($gameService && !initialized) {
      initialized = true
      $gameService.getOpenChallenges().then((result) => {
        challenges.set(result)
      })
      $gameService.getOpenGame().then((result) => {
        game = result
      })
      $gameService?.subscribeToChallenges((p1, p2, id) => {
        const c = $challenges
        c.push({ p1, p2, id })
        challenges.set(c)
      })
      $gameService.subscribeToGameStart((p2, p1, id) => {
        if (
          p1.toLowerCase() === $wallet.address?.toLowerCase() ||
          p2.toLowerCase() === $wallet.address?.toLowerCase()
        ) {
          game = { p1, p2, id }
        }
      })
    }
  }
</script>

<div class="flex flex-col w-1/3 mx-auto mt-24 space-y-5">
  {#if $wallet.address}
    <Address />
    <ChallengeOpponent />
  {:else}
    <ConnectWallet />
  {/if}
  {#each $challenges as challenge}
    <ChallengeRequest {challenge} />
  {/each}
  {#if game}
    <Board {game} />
  {/if}
</div>
