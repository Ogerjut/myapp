import { auth } from '$lib/auth'
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
    sendLinkByEmail : async ({request}) => {
      const formData = await request.formData();
      const email = formData.get('email');
    
      try {
        const data = await auth.api.requestPasswordReset({
            body: {
                email: email, // required
                redirectTo: "/reset-password",
            },
        });

        if (data.status){
          return {success : true, message : 'Lien envoyé par e-mail'}
        } else {
          throw new Error(`Erreur( ${data.status}) lors de l'envoie du mail`)
        }
      } catch (err) {
          return fail(400, { error : err.message });
      }
      
    }
  };