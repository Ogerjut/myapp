import { auth } from '$lib/auth'
import { fail } from '@sveltejs/kit';

export const actions = {
    signup : async({request}) => {
        const formData = await request.formData();
        const name = formData.get('name')
        const email = formData.get('email')
        const username = formData.get('username');
        const password = formData.get('password');
   
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

            return {
                success: true,
                message: 'Account created successfully'
            };
        } catch (err) {
            return fail(400, { error : err.message });
        }
    }
}