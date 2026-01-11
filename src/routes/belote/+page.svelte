<script lang='ts'>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

    let {data, form} = $props()
    
    let creating = $state(true)

</script>

<div id='setting-container'>  	
  
    {#if creating}
        <form action="?/createTable" method="post"
        use:enhance ={()=>{
          return async ({result, update}) => {
            await update(); 
            if (result?.data?.success) {
              console.log(result.data.message)
              creating = false 
              const table = result.data.table
              goto(`/belote/${table?._id}`)
                  
            }
          }
        }}>

            
        <fieldset>
            <legend>Sélectionnes un mode de jeu :</legend>
            
            <label class="hit-area" for="r4">
                <input checked type="radio" name="gameMode" id="r4" value="1000">
            En 1000 pts
            </label>
            
            <label class="hit-area" for="r5">
                <input type="radio" name="gameMode" id="r5" value="12" >
                En 12 coups
            </label>

        </fieldset>

        <div id="buttons"> 
          <button type="submit"> Créer la table </button>          
          <button type="button" onclick={() => goto('/')}> Menu </button>
        </div>
        
        </form>
        

    {/if}

    {#if form?.success}
      <p>{form.message}</p>
    {/if}


</div>


<style>
  #setting-container {
    display: flex;
    flex-direction: column;
    text-align: center;
    border-radius: 25px;
    margin: 10px ;
    padding: 10px;
    background-color:var(--color-bg-box);
    box-shadow: var(--box-shadow-1);

  }

  button:disabled{
    cursor: not-allowed;
  }

  fieldset{
    border : var(--border-1);
    text-align: center;
    border-radius: 10px;
    padding-left: 15px;
    padding-right: 15px;
    padding-bottom: 15px;
    margin: 10px;
    display: flex;
    flex-direction: column;

  }

  legend{
    font-size:medium;
    margin: 5px;
    padding: 5px;
  }
  
  .hit-area{
    border : var(--border-1);
    padding: 10px;
    margin: 5px;
    border-radius: 15px;
    background-color: beige;
  
  }

  .hit-area:has(input:checked){
      border: var(--border-4);
      background-color:peru;
      color:var(--color-text-2);
      font-weight: bold;
    }

  input:checked{
    color:var(--color-text-2);
  }

  #buttons{
    display: flex;
    justify-content: space-around;
  }

  .hit-area:has(input:disabled){
    opacity: 60%;
  }



</style>