<script lang='ts'>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

    let {data, form} = $props()
    
    let creating = $state(true)
  
</script>

<div class='tableContainer'>  	
  
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
          
          <div class="dr">
            <input type="radio" name="nbPlayers" id="r1" value="4" checked>
            <label for="r1">4</label>
          </div>
      
          <!-- <div class="dr">
            <input type="radio" name="nbPlayers" id="r2" value="5" >
            <label for="r2">5</label>
          </div> -->
      
          </fieldset>
        <button type="submit"> Créer la table </button>
        </form>
        

    {/if}

    {#if form?.success}
      <p>{form.message}</p>
    {/if}


</div>


<style>
  .tableContainer {
    display: flex;
    text-align: center;
    border: 10px solid brown;
    border-radius: 25px;
    margin: 10px ;
    padding: 10px;
    background-color:burlywood;
    justify-content: center;
    align-items: center;

  }

  button {
      background-color:lawngreen;
      padding: 7px;
      border-radius: 15px;
      border: 1px solid green ;
      text-align: center;
      margin: 15px;

  }

  button:hover{
  opacity: 80%;
  cursor: pointer;
}

  button:disabled{
    cursor: not-allowed;
  }

  fieldset{
    border : 2px solid brown;
    margin: 5px;
    text-align: center;
    padding: 5px;
    border-radius: 10px; 
  }

  legend{
    color: brown;
    font-size:small;
    margin: 5px;
  }

  .dr {
    color : white;
    background-color: orange;
    border-radius: 15px;
    margin: 5px;
    margin-left: 20px;
    margin-right: 20px;
    border : 1px solid brown;
  }

</style>