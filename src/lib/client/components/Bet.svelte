<script lang='ts'>
	import { browser } from "$app/environment";
    import {enhance} from "$app/forms"
    import {useTarotContext} from '../game/context/tarotContext.svelte'
	  import Timer from "./Timer.svelte";

    let tarotContext = useTarotContext()
    const socket = $derived(tarotContext.socket)
    let table = $derived(tarotContext.table)
    let user = $derived(tarotContext.user)
    let tarot = $derived(tarotContext.user.tarot)
    let actualBet = $derived(tarotContext.table.gameState.actualBet)
    
    const duration = $state(300) //s

    function sendBet(bet){
        // console.log("bet sent : ", bet)
        socket.emit("playerHasBet", table._id, user._id, bet )
    }

</script>


<div id="bet">
    {#if tarot.isSpeaker && browser}
      <Timer {duration} callback={() => sendBet(0)}/>
    {/if}
    
    <p> {tarot.isSpeaker ? "Choisis ton annonce ! " : "Ce n'est pas ton tour !"} </p>
    
    <form action="?/bet" method="post" 
        use:enhance ={()=>{
          return async ({result, update}) => {
            await update(); 
            // if (result?.data?.success) {
            //   console.log(result.data)
            // }
            sendBet(result.data.bet)
          }
        }}>
        
        <fieldset disabled = {!tarot.isSpeaker}>

          <div class="dr">
            <input type="radio" name="bet" id="r0" value="0" checked >
            <label for="r0"> Passer </label>
          </div>
          
          <div class="dr">
            <input type="radio" name="bet" id="r1" value="1" disabled = {actualBet >= 1}>
            <label for="r1"> Prise </label>
          </div>
      
          <div class="dr">
            <input type="radio" name="bet" id="r2" value="2" disabled = {actualBet >= 2}>
            <label for="r2"> Garde</label>
          </div>

          <div class="dr">
            <input type="radio" name="bet" id="r3" value="3" disabled = {actualBet >= 3}>
            <label for="r3">Garde sans</label>
          </div>
      
          <div class="dr">
            <input type="radio" name="bet" id="r4" value="4">
            <label for="r4">Garde contre</label>
          </div>

           
          </fieldset>
        <button disabled = {!tarot.isSpeaker} type="submit"> Annoncer </button>
        
        </form>

</div>

<style>
    #bet {
        display : flex; 
        background: var(--color-bg-box);
        padding: 10px;
        border: var(--border-4);
        border-radius: 10px;
        align-items: center;
        flex-direction: column;
        color : var(--color-text-2)

    }
    
    input:disabled + label {
      cursor: not-allowed;
      opacity: 0.6;
    }

    button:disabled{
      cursor:not-allowed;
    }

    form{
      display: flex;
      flex-direction: column;
      align-items: center;
    }

  
</style>