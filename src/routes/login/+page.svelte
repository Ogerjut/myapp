<script>
    import { enhance } from "$app/forms";
      import { goto } from "$app/navigation";
      let  {form} = $props()
      let logingin = $state(false)
  
  </script>
  
  
  <div id='sign-in-container'>
    
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

    <a href="/login/forgotten-password">mot de passe oublié ?</a>

    {#if form?.error}
      <p style="color:red;">{form.error}</p>
    {/if}

  </form>
  </div>
  
  {#if logingin }
    <span class="saving"> connecting...</span>        
  {/if}
  
  
  


<style>

 
#sign-in-container {
    box-shadow: var(--box-shadow-1);
    border-radius: 15px;
    margin-top: 10px;
    
  }
  
  form {
    padding: 15px;
    background-color: var(--color-bg-box);
    border-radius: 15px;
    align-items: center;
    display: flex;
    flex-direction: column;
    
  }

  #field {
    align-items: end;
    padding: 10px;
    display: flex;
    flex-direction: column;
  }

  input {
    margin: 2px;
    border-radius: 10px;
  }


  h1{
    font-size:xx-large;
  }

  a{
    font-size: medium;
    margin-top : 10px;
  }

  a:hover{
    text-decoration: underline;
  }
  </style>