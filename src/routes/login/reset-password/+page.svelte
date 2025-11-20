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
    </div>
    
    <button disabled={changingPassword}> Changer de mot de passe </button>
  </form> 
