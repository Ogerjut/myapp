import { redirect, fail, error } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import { msgCollection } from "$lib/server/db/db.js"
import {ObjectId} from 'mongodb'

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.session) {
        throw redirect(302, "/");
    }

    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const rawMessages = await msgCollection.find({date : {$gt: cutoff}}).toArray()
    const messages = rawMessages.map(msg => ({...msg, _id : msg._id.toString()}))
    return {messages}
  
};

export const actions = {
    sendMessage : async ({request, locals}) => {
        const formData = await request.formData();
        const msg = formData.get('msg')
        const fontColor = formData.get('color')
        const user = locals.user

        try {
            await msgCollection.insertOne({
                _id : new ObjectId(),
                date : new Date(),
                author : user.username,
                content : msg,
                fontColor : fontColor

            })

            const rawMessages = await msgCollection.find().toArray()
            const messages = rawMessages.map(msg => ({...msg, _id : msg._id.toString()}))
        
            return  {success : true, messages}
        } catch (error) {
            return fail(400, {error : error.message})
        }
    }
}