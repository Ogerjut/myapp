<script>
    import { enhance } from "$app/forms";
      import { goto } from "$app/navigation";
      let  {form} = $props()
      let logingin = $state(false)
  
  </script>
  
  
  <div>
    
    <form method="post" action="?/login" 
    use:enhance={(({formElement})=>{
      logingin = true
    return async ({result, update}) => {
        await update(); 
        logingin = false
        if (result?.data.success) {
          formElement.reset()
          console.log(result.data.message)
            goto("/")
        }

      }
    })}
    class="overflow-hidden shadow rounded-xl"
    >

    <h1><u>Connection</u></h1>

    <div id="field">
      <label>
        Pseudo :
        <input type="text" name="username" required />
      </label>
      
      <label>
       Mot de passe :
        <input type="password" name="password" required />
      </label>

    </div>
    
    <button disabled={logingin}> Se connecter </button>

    <a href="/login/forgotten-password">mot de passe oublié</a>

    {#if form?.error}
      <p style="color:red;">{form.error}</p>
    {/if}

  </form>
  </div>
  
  {#if logingin }
    <span class="saving"> connecting...</span>        
  {/if}
  
  
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


  