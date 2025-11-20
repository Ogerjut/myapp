<script lang='ts'>
    import {enhance} from "$app/forms"
    import {useTarotContext} from '../game/context/tarotContext.svelte'
	  import Timer from "./Timer.svelte";

    let tarotContext = useTarotContext()
    const socket = $derived(tarotContext.socket)
    let table = $derived(tarotContext.table)
    let user = $derived(tarotContext.user)
    let tarot = $derived(tarotContext.user.tarot)
    let actualBet = $derived(tarotContext.table.gameState.actualBet)
    
    const duration = $state(3000)

    function sendBet(bet){
        // console.log("bet sent : ", bet)
        socket.emit("playerHasBet", table._id, user._id, bet )
    }

</script>

<div id="bet">
    {#if tarot.isSpeaker}
      <Timer {duration} callback={() => sendBet(0)}/>
    {/if}
    
    <p> {tarot.isSpeaker ? "Your turn to bet ! " : "Waiting to bet"} </p>
    
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
          <legend> <u>SChoisis ton annonce :</u> </legend>

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
        background: white;
        padding: 10px;
        border: 1px solid black;
        border-radius: 15px;
        justify-items: center;
        justify-content: center;

    }
    
    input:disabled + label {
      cursor: not-allowed;
      opacity: 0.6;
    }

    button:disabled{
      cursor:not-allowed;
    }

  
</style>