<script lang="ts">
  import { gameService } from '$lib/stores/game'
  import { isAddress } from '@ethersproject/address'

  let address = ''

  const challengeOpponent = async () => {
    if (!isAddress(address)) {
      alert('Invalid Ethereum Address')
      return
    }
    $gameService?.challengeOpponent(address)
  }
</script>

<div class="form-control">
  <label for="opponent-address" class="label">
    <span class="label-text">Challenge Opponent</span>
  </label>
  <div class="input-group">
    <input
      type="text"
      id="opponent-address"
      class="input bg-base-200 w-full"
      placeholder="0x..."
      bind:value={address}
    />
    <button class="btn" on:click={challengeOpponent}>Challenge!</button>
  </div>
</div>
