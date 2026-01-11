
import { PUBLIC_BELOTE_GAME_KEY } from '$env/static/public';
import { setContext, getContext, hasContext} from 'svelte';

const KEY = Symbol(PUBLIC_BELOTE_GAME_KEY)

export function setBeloteContext(game) {
    let socket = $state(game.socket)
    let table = $state(game.table)
    let user = $state(game.user)
    let isPlayableCard = $state(undefined)
    let betRound = $state(0)
    let activeCard = $state({})
    let url = $state("")
    
    setContext(KEY, {
        get socket() { return socket },
        set socket(value) { socket = value },
        get table() { return table },
        set table(value) { table = value },
        get user() { return user },
        set user(value) { user = value },
        get betRound() { return betRound },
        set betRound(value) { betRound = value },
        get url() {return url},
        set url(value) {url = value},
        get isPlayableCard() { return isPlayableCard },
        set isPlayableCard(value) { isPlayableCard = value },
        get activeCard() { return activeCard },
        set activeCard(value) { activeCard = value },
        });
}

export function useBeloteContext() {
	if (hasContext(KEY)) {
        return getContext(KEY)
    }
}