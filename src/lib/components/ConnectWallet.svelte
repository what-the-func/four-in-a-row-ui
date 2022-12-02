<script lang="ts">
  import { Game } from '$lib/services/game'
  import { wallet, chain } from '$lib/stores/wallet'
  import type { JsonRpcSigner } from '@ethersproject/providers'
  import { gameService } from '$lib/stores/game'

  const connect = async () => {
    await wallet.connect('builtin')
    const gs = new Game(<JsonRpcSigner>wallet.provider?.getSigner())
    gameService.set(gs)
  }
</script>

<div class="width-full flex justify-center">
  <button class="btn btn-wide glass" on:click={connect}>Connect Wallet</button>
</div>
