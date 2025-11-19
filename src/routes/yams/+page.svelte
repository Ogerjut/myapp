<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

    let {data, form} = $props()
    
    let creating = $state(true)
	let nbPlayers = $state(1)

	function handleChangeNbPlayers(event){
		nbPlayers = event?.target.value
	}
  
	

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
              goto(`/yams/${table?._id}`)
                  
            }
          }
        }}>

        <fieldset>
          
		  <input type="range" name="nbPlayers" id="nbPlayers" value=1 min=1 max=8 step=1 onchange={(e)=>handleChangeNbPlayers(e)}>
		  <label for="nbPlayers"> {nbPlayers} players</label>
		 
          </fieldset>
        <button type="submit"> Create a table </button>
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

