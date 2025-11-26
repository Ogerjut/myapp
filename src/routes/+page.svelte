<script lang='ts'>
  import GameCard from '$lib/client/components/GameCard.svelte'
  import tarotImage from '$lib/assets/tarot-icon.jpg'
  import chessImage from '$lib/assets/chess-icon.jpg'
  import yamsImage from '$lib/assets/yams-icon.jpg'
  import beloteImage from '$lib/assets/belote-icon.jpg'
	import Login from '$lib/client/components/Login.svelte';
	import SignUp from '$lib/client/components/SignUp.svelte';

  let {data, form} = $props()

  let loginBox = $state(true)

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

{#if data.user}
  <div id='games-container'>
    {#each games as game}
      <GameCard {...game} />
    {/each}
  </div>

  {:else}
  <p>Connectes toi ou inscris toi pour jouer une partie de tarot</p>
  
  {#if loginBox}
    <Login {form}/>
    <p> Pas encore inscrit ?
      <a onclick={()=> loginBox = !loginBox }>
        <u>Cliques ici</u>
      </a>
    </p> 

    {:else}
    <SignUp {form} />
    <p>  Connectes toi 
      <a onclick={()=> loginBox = !loginBox }>
        <u>ici</u>
      </a>
    </p> 
  {/if}

{/if}


<style>
  #games-container{
    display: grid;
    /* border: var(--border-2);
    border-radius: 25px;
    background-color: var(--color-bg-box);
    padding: 25px; */
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    grid-template-rows: repeat(2, auto);   
    gap: 5px;
    margin-top: 10px;
  }

  a:hover{
    cursor: pointer;
    color : var(--color-text-2)
  }

  p{
    margin: 5px;
  }

  u{
    font-weight: bold;
  }

</style>



