import { auth } from '$lib/auth'
import { fail } from '@sveltejs/kit';
import {isValid} from "$lib/server/auth-utils"

export const actions = {
    signup : async({request}) => {
        const formData = await request.formData();
        const email = formData.get('email')
        const username = formData.get('username');
        const password = formData.get('password');
        const password2 = formData.get('password2');
        const name = username

        try {
            
            isValid(password)
            if(password !== password2){
                throw new Error('Les mots de passe doivent être identiques !')
            }
        
        } catch (err) {
            return fail(400, { error : err.message });
        }


        try {
            const data = await auth.api.signUpEmail({
                body: {
                    email,
                    name,
                    password,
                    username
                }
            });

            console.log("New user:", data);

            if (data){
                await auth.api.sendVerificationEmail({
                    email : data.user.email,
                    callbackURL : "/login"
                })
            }

            return {
                success: true,
                message: 'Account created successfully'
            };
        } catch (err) {
            return fail(400, { error : err.message });
        }
    }
}