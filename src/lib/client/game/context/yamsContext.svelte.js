
import { PUBLIC_YAMS_GAME_KEY } from '$env/static/public';
import { setContext, getContext, hasContext} from 'svelte';

const KEY = Symbol(PUBLIC_YAMS_GAME_KEY)

export function setYamsContext(game) {
    let socket = $state(game.socket)
    let table = $state(game.table)
    let user = $state(game.user)
    let url = $state("")
    
    setContext(KEY, {
        get socket() { return socket },
        set socket(value) { socket = value },
        get table() { return table },
        set table(value) { table = value },
        get user() { return user },
        set user(value) { user = value },
        get url() {return url},
        set url(value) {url = value},
        });
}

export function useYamsContext() {
	if (hasContext(KEY)) {
        return getContext(KEY)
    }
}