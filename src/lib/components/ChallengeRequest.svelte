<script lang="ts">
  import { gameService, challenges } from '$lib/stores/game'
  import type { Challenge } from '$lib/types'

  export let challenge: Challenge

  const acceptChallenge = async () => {
    await $gameService?.acceptChallenge(challenge.p1)
    const c = await $gameService?.getOpenChallenges()
    challenges.set(c ?? [])
  }
</script>

<div class="alert shadow-lg">
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      class="stroke-info flex-shrink-0 w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <div>
      <h3 class="font-bold">New Challenge!</h3>
      <div class="text-xs">
        You have a challenge from {challenge.p1}
      </div>
    </div>
  </div>
  <div class="flex-none">
    <button class="btn btn-sm" on:click={acceptChallenge}>Accept</button>
  </div>
</div>
