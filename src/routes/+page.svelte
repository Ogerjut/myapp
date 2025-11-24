<script lang='ts'>
    import GameCard from '$lib/client/components/GameCard.svelte'
    import tarotImage from '$lib/assets/tarot-icon.jpg'
    import chessImage from '$lib/assets/chess-icon.jpg'
    import yamsImage from '$lib/assets/yams-icon.jpg'
    import beloteImage from '$lib/assets/belote-icon.jpg'

    let {data} = $props()

    const games = [
      {
        row : 1, col : 1,
        name : "tarot",
        url : "/table",
        image : tarotImage,
        published : true 
      },
      {
        row : 1, col : 2,
        name : "yam's",
        url : "/yams",
        image : yamsImage,
        published : false 
      },
      {
        row : 2, col : 1,
        name : "échec",
        url : "/chess",
        image : chessImage,
        published : false 
      },
      {
        row : 2, col : 2,
        name : "belote",
        url : "/belote",
        image : beloteImage,
        published : false 
      },
    ]
</script>

{#if data.user?.role === "admin"}
    <p>Connected in admin mode</p>
{/if}

{#if data.user}
  <p>👋 Bonjour {data.user.name} ({data.user.email})</p>
 
{:else}
  <p>Connectes toi ou inscris toi pour jouer une partie de tarot</p>


{/if}

{#if data.user}
  <div id='games-container'>
    {#each games as game}
      <GameCard {...game} />
    {/each}
  </div>
{/if}


<style>
  #games-container{
    display: grid;
    /* border: var(--border-2);
    border-radius: 25px;
    background-color: var(--color-bg-box);
    padding: 25px; */
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    grid-template-rows: repeat(2, auto);     /* 2 lignes */
    gap: 5px;
    margin-top: 10px;
  }

</style>



