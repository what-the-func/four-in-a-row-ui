<script lang="ts">
  import { wallet } from '$lib/stores/wallet'
</script>

<div class="flex flex-col w-full justify-center">
  <h3 class="w-full text-center text-xl font-bold mb-2">Connected</h3>
  <div class="btn btn-info no-animation">{$wallet.address}</div>
</div>
