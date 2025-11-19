import { auth } from '$lib/auth'
import { fail } from '@sveltejs/kit';
import { usersCollection } from "$lib/server/db/db.js"
import {ObjectId} from 'mongodb'


export const actions = {
    login : async({request, cookies}) => {
        const formData = await request.formData();
        const username = formData.get('username');
        const password = formData.get('password');
        
        try {
            const response = await auth.api.signInUsername({
                body: {
                    username,
                    password
                },
            });
            
            await usersCollection.updateOne(
                {_id : new ObjectId(response.user.id) },
                {$set : {isActive : true}}
            )
            
            const user = await usersCollection.findOne({_id : new ObjectId(response.user.id) })
            console.log("signin user : ", user)


            return {
                success: true,
                message: 'User successfully connected'
            };
            
        } catch (err) {
            return fail(400, { error : err.message });
        }

        

    }
}