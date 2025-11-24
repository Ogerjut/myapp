<script lang='ts'>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

    let {data, form} = $props()
    
    let creating = $state(true)
  
</script>

<div id='table-container'>  	
  
    {#if creating}
        <form action="?/createTable" method="post"
        use:enhance ={()=>{
          return async ({result, update}) => {
            await update(); 
            if (result?.data?.success) {
              console.log(result.data.message)
              creating = false 
              const table = result.data.table
              goto(`/table/${table?._id}`)
                  
            }
          }
        }}>

        <fieldset>
          <legend>Sélectionnes un nombre de joueurs :</legend>
          
          <label class="hit-area" for="r1">
            <input type="radio" name="nbPlayers" id="r1" value="2" checked>
            4 joueurs
          </label>
        
          <label class="hit-area" for="r2">
            <input type="radio" name="nbPlayers" id="r2" value="5" >
            5 joueurs
          </label>

        </fieldset>
        <div id="buttons">
          <button type="submit"> Créer la table </button>
          <button type="button" onclick={() => goto('/')}> Retour </button>
        </div>
        
        </form>
        

    {/if}

    {#if form?.success}
      <p>{form.message}</p>
    {/if}


</div>


<style>
  #table-container {
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

</style>