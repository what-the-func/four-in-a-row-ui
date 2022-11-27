<script lang="ts">
  export let val: number

  let cellClass: string
  $: {
    cellClass = 'rounded-full h-16 w-16 flex items-center justify-center border border-black'
    switch (val) {
      case 1:
        cellClass = `${cellClass} bg-red-700`
        break
      case 2:
        cellClass = `${cellClass} bg-yellow-500`
        break
      default:
        cellClass = `${cellClass} bg-base-300`
        break
    }
  }
</script>

<div class={cellClass}>
  <div class="self-center" />
</div>
