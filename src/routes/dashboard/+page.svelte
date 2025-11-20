<script lang="ts">
    // import type { PageData } from "./$types.js";
    let {data, form} = $props()
    import { enhance } from "$app/forms";


    let showChangePassword = $state(false)
    let changingPassword = $state(false)
    
    function toggleChangePassword(){
      showChangePassword = !showChangePassword
    }

</script>

<div>
  <button onclick={()=>toggleChangePassword()}> Changer de mot de passe</button>
  
  {#if showChangePassword}

    <form method="post" action="?/changePassword" 
    use:enhance ={(({formElement})=>{
      changingPassword = true
    return async ({result, update}) => {
        await update(); 
        changingPassword = false
        if (result?.data.success) {
          formElement.reset()
          console.log(result.data.message)
        }

      }
    })}
    >
    <div id="field">
      <label>
        Nouveau mot de passe  :
        <input type="password" name="newPassword" required />
      </label>
      <label>
        Répéter nouveau mot de passe :
        <input type="password" name="newPassword2" required />
      </label>
      
      <label>
       Ancien mot de passe :
        <input type="password" name="password" required />
      </label>

    </div>
    
    <button disabled={changingPassword}> Changer de mot de passe </button>
  </form> 

  {/if}

  {#if form?.error}
      <p style="color:red;">{form.error}</p>
  {/if}

  {#if form?.success}
    <p>{form.message}</p>
  {/if}
  
</div>
  