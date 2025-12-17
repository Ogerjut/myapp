
let opponents = $state([])

export const useOpponents = () => { return opponents }

export function resetOpponent(){
    opponents = []
}

export async function fetchOpponents(ids, tableId, game) {
        if (!ids.length) {
        opponents = []
        return;
        }

        const res = await fetch(`/${game}/${tableId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids })
        });

        if (res.ok) {
        const data = await res.json();
        opponents = data
        // opponents.push(...data)
        } 
    }


