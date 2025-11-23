<script lang='ts'>
    let {data} = $props()
</script>

{#if data.user?.role === "admin"}
    <p>Connected in admin mode</p>
{/if}

{#if data.user}
  <p>👋 Bonjour {data.user.name} ({data.user.email})</p>
 
{:else}
  <p>Connectes toi ou inscris toi pour jouer une partie de tarot</p>


{/if}


