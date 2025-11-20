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

        console.log("data / forgotten pw", data)
        return {success : true, message : 'Lien envoyé par e-mail'}
        
      } catch (err) {
          return fail(400, { error : err.message });
      }
      
    }
  };