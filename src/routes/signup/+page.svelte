<script>
    import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
    let {form} = $props()
    let registering = $state(false)

  </script>
  


<div >

  
  <form method="post" action="?/signup" 
    use:enhance={(({formElement})=>{
      registering = true
    return async ({result, update}) => {
        await update(); 
        registering = false
        if (result?.data.success) {
          formElement.reset()
          console.log(result.data.message)
          goto('/')

        }

      }
    })}>

    <h1><u>Registration</u></h1>

    <div id="field">
      <label>
        Username :
        <input type="text" name="username" required />
      </label>
  
      <label>
        Name :
        <input type="text" name="name" required />
      </label>
      
      <label>
        Email :
        <input type="email" name="email" required />
      </label>
      
      <label>
       Password :
        <input type="password" name="password" required />
      </label>

    </div>
    
    <button disabled={registering}> Sign up ! </button>

    {#if form?.error}
      <p style="color:red;">{form.error}</p>
    {/if}

  </form>

  {#if registering }
    <span class="saving"> saving your datas...</span>        
  {/if}

  {#if form?.success}
    <span> Registered, you can now log in  </span>
  {/if}

</div>





  <style>
    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      
    }

    input {
      margin: 2px;
      border-radius: 5px;
    }
    
    form {
      display: flex;
      flex-direction: column;
      padding: 15px;
      background-color: beige;
      justify-content: center;
      align-items: center;
      border-radius: 15px;
      
    }
  button {
    background-color: burlywood ;
    border-radius: 15px;
    margin: 2px;
    padding: 8px;
  }
  
  button:hover {
    cursor: pointer;
    opacity: 90%;
    
  }

  #field {
    align-items: end;
    padding: 10px;
  }

  </style>


  