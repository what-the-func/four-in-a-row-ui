<script lang="ts">
  import { wallet, chain } from '$lib/stores/wallet'
  import { gameService } from '$lib/stores/game'
  import { onMount } from 'svelte'

  $: {
    if ($chain.chainId && $chain.chainId !== '80001') {
      gameService.set(undefined)
      wallet.disconnect().then(() => {
        alert('Please connect to Polygon Mumbai')
      })
    }
  }

  let needsGas = false

  onMount(async () => {
    const balance = await wallet.provider?.getBalance(<string>$wallet.address)
    if (balance && balance.eq(0)) {
      needsGas = true
    }
  })
</script>

{#if needsGas}
  <h1>You don't have any MATIC for gas. You can get some from the faucet below.</h1>
  <a href="https://faucet.quicknode.com" class="link" target="_blank" rel="noreferrer">
    https://faucet.quicknode.com/
  </a>
{/if}

<div class="flex flex-col w-full justify-center">
  <h3 class="w-full text-center text-xl font-bold mb-2">Connected</h3>
  <div class="btn btn-info no-animation">{$wallet.address}</div>
</div>
