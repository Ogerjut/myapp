import { auth } from '$lib/auth'
import { fail } from '@sveltejs/kit';
import { usersCollection } from "$lib/server/db/db.js"
import {ObjectId} from 'mongodb'
import {isValid} from "$lib/server/auth-utils"


export const actions = {
    login : async({request, cookies}) => {
        const formData = await request.formData();
        const username = formData.get('username');
        const password = formData.get('password');

        const normalizedUsername = username.toLowerCase().trim()
        
        try {
            const response = await auth.api.signInUsername({
                body: {
                    username : normalizedUsername,
                    password, 
                },
            });
            
            // await usersCollection.updateOne(
            //     {_id : new ObjectId(response.user.id) },
            //     {$set : {isActive : true}}
            // )
            
            // const user = await usersCollection.findOne({_id : new ObjectId(response.user.id) })
            // console.log("signin user : ", user)


            return {
                success: true,
                message: 'User successfully connected'
            };
            
        } catch (err) {
            return fail(400, { error : err.message });
        }

        

    },

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

            // console.log("New user:", data);

            if (data){
                await auth.api.sendVerificationEmail({
                    body : {
                        email : data.user.email,
                        callbackURL : "/"
                    }
                    
                })
            }

            return {
                success: true,
                message: 'Account created successfully'
            };
        } catch (err) {
            return fail(400, { error : err.message });
        }
    },

    sendMessage : async ({request}) => {
        const formData = await request.formData();
        const msg = formData.get('msg')

    }
}